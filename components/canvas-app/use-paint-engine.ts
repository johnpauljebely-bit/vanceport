"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type Tool =
  | "draw"
  | "line"
  | "rect"
  | "circle"
  | "arrow"
  | "text"
  | "eraser"
  | "eyedropper";

export interface LayerMeta {
  id: string;
  name: string;
  visible: boolean;
  opacity: number;
}

export const CANVAS_W = 420;
export const CANVAS_H = 280;

let uid = 0;
const nextId = () => `layer-${++uid}`;

interface Snapshot {
  layers: LayerMeta[];
  activeId: string;
  images: Record<string, string>;
}

export function usePaintEngine() {
  const [firstLayerId] = useState(() => nextId());
  const [layers, setLayers] = useState<LayerMeta[]>(() => [
    { id: firstLayerId, name: "Layer 1", visible: true, opacity: 1 },
  ]);
  const [activeLayerId, setActiveLayerId] = useState(firstLayerId);
  const [tool, setTool] = useState<Tool>("draw");
  const [color, setColor] = useState("#111111");
  const [brushSize, setBrushSize] = useState(4);
  const [fillMode, setFillMode] = useState(false);
  const [zoom, setZoom] = useState(1);

  const canvasRefs = useRef<Map<string, HTMLCanvasElement>>(new Map());
  const historyRef = useRef<Snapshot[]>([]);
  const historyIndexRef = useRef(-1);
  const [historyTick, setHistoryTick] = useState(0);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const syncHistoryFlags = useCallback(() => {
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
  }, []);

  const registerCanvas = useCallback((id: string, el: HTMLCanvasElement | null) => {
    if (el) canvasRefs.current.set(id, el);
    else canvasRefs.current.delete(id);
  }, []);

  const snapshot = useCallback((): Snapshot => {
    const images: Record<string, string> = {};
    canvasRefs.current.forEach((canvas, id) => {
      images[id] = canvas.toDataURL();
    });
    return { layers: layers.map((l) => ({ ...l })), activeId: activeLayerId, images };
  }, [layers, activeLayerId]);

  const pushHistory = useCallback(() => {
    const snap = snapshot();
    historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
    historyRef.current.push(snap);
    if (historyRef.current.length > 40) historyRef.current.shift();
    historyIndexRef.current = historyRef.current.length - 1;
    setHistoryTick((t) => t + 1);
    syncHistoryFlags();
  }, [snapshot]);

  const restoreSnapshot = useCallback((snap: Snapshot) => {
    setLayers(snap.layers.map((l) => ({ ...l })));
    setActiveLayerId(snap.activeId);
    Object.entries(snap.images).forEach(([id, dataUrl]) => {
      const canvas = canvasRefs.current.get(id);
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = dataUrl;
    });
  }, []);

  const undo = useCallback(() => {
    if (historyIndexRef.current <= 0) return;
    historyIndexRef.current -= 1;
    restoreSnapshot(historyRef.current[historyIndexRef.current]);
    setHistoryTick((t) => t + 1);
    syncHistoryFlags();
  }, [restoreSnapshot]);

  const redo = useCallback(() => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;
    historyIndexRef.current += 1;
    restoreSnapshot(historyRef.current[historyIndexRef.current]);
    setHistoryTick((t) => t + 1);
    syncHistoryFlags();
  }, [restoreSnapshot]);

  // seed initial history once canvases are mounted
  useEffect(() => {
    const id = setTimeout(() => {
      if (historyRef.current.length === 0) pushHistory();
    }, 50);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addLayer = useCallback(() => {
    const id = nextId();
    setLayers((ls) => [...ls, { id, name: `Layer ${ls.length + 1}`, visible: true, opacity: 1 }]);
    setActiveLayerId(id);
    setTimeout(pushHistory, 0);
  }, [pushHistory]);

  const duplicateLayer = useCallback((id: string) => {
    setLayers((ls) => {
      const idx = ls.findIndex((l) => l.id === id);
      if (idx === -1) return ls;
      const newId = nextId();
      const copy = { ...ls[idx], id: newId, name: `${ls[idx].name} copy` };
      const next = [...ls];
      next.splice(idx + 1, 0, copy);
      requestAnimationFrame(() => {
        const src = canvasRefs.current.get(id);
        const dst = canvasRefs.current.get(newId);
        if (src && dst) {
          const ctx = dst.getContext("2d");
          ctx?.drawImage(src, 0, 0);
        }
        pushHistory();
      });
      return next;
    });
  }, [pushHistory]);

  const deleteLayer = useCallback((id: string) => {
    setLayers((ls) => {
      if (ls.length <= 1) return ls;
      const next = ls.filter((l) => l.id !== id);
      if (activeLayerId === id) setActiveLayerId(next[next.length - 1].id);
      return next;
    });
    setTimeout(pushHistory, 0);
  }, [activeLayerId, pushHistory]);

  const renameLayer = useCallback((id: string, name: string) => {
    setLayers((ls) => ls.map((l) => (l.id === id ? { ...l, name } : l)));
  }, []);

  const setOpacity = useCallback((id: string, opacity: number) => {
    setLayers((ls) => ls.map((l) => (l.id === id ? { ...l, opacity } : l)));
  }, []);

  const toggleVisible = useCallback((id: string) => {
    setLayers((ls) => ls.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l)));
  }, []);

  const moveLayer = useCallback((id: string, dir: -1 | 1) => {
    setLayers((ls) => {
      const idx = ls.findIndex((l) => l.id === id);
      const swapWith = idx + dir;
      if (idx === -1 || swapWith < 0 || swapWith >= ls.length) return ls;
      const next = [...ls];
      [next[idx], next[swapWith]] = [next[swapWith], next[idx]];
      return next;
    });
  }, []);

  const clearActiveLayer = useCallback(() => {
    const canvas = canvasRefs.current.get(activeLayerId);
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    pushHistory();
  }, [activeLayerId, pushHistory]);

  const exportPng = useCallback(() => {
    const composite = document.createElement("canvas");
    composite.width = CANVAS_W;
    composite.height = CANVAS_H;
    const ctx = composite.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    layers.forEach((layer) => {
      if (!layer.visible) return;
      const canvas = canvasRefs.current.get(layer.id);
      if (!canvas) return;
      ctx.globalAlpha = layer.opacity;
      ctx.drawImage(canvas, 0, 0);
    });
    ctx.globalAlpha = 1;
    const link = document.createElement("a");
    link.download = "canvas-export.png";
    link.href = composite.toDataURL("image/png");
    link.click();
  }, [layers]);

  const eyedrop = useCallback(
    (x: number, y: number): string | null => {
      const composite = document.createElement("canvas");
      composite.width = CANVAS_W;
      composite.height = CANVAS_H;
      const ctx = composite.getContext("2d");
      if (!ctx) return null;
      layers.forEach((layer) => {
        if (!layer.visible) return;
        const canvas = canvasRefs.current.get(layer.id);
        if (!canvas) return;
        ctx.globalAlpha = layer.opacity;
        ctx.drawImage(canvas, 0, 0);
      });
      const [r, g, b] = ctx.getImageData(Math.round(x), Math.round(y), 1, 1).data;
      return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
    },
    [layers]
  );

  return {
    layers,
    activeLayerId,
    setActiveLayerId,
    tool,
    setTool,
    color,
    setColor,
    brushSize,
    setBrushSize,
    fillMode,
    setFillMode,
    zoom,
    setZoom,
    registerCanvas,
    pushHistory,
    undo,
    redo,
    canUndo,
    canRedo,
    historyTick,
    addLayer,
    duplicateLayer,
    deleteLayer,
    renameLayer,
    setOpacity,
    toggleVisible,
    moveLayer,
    clearActiveLayer,
    exportPng,
    eyedrop,
  };
}

export type PaintEngine = ReturnType<typeof usePaintEngine>;

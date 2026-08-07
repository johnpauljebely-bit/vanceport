"use client";

import { useEffect } from "react";
import {
  Pencil,
  Square,
  Circle,
  Type,
  Eraser,
  Undo2,
  Download,
  Pipette,
  Slash,
  ArrowRight,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import PopupShell from "@/components/desktop/popup-shell";
import { Toolbar } from "@/components/kokonutui/toolbar";
import PaintCanvasStack from "@/components/canvas-app/paint-canvas-stack";
import LayersPanel from "@/components/canvas-app/layers-panel";
import { usePaintEngine, type Tool } from "@/components/canvas-app/use-paint-engine";
import { cn } from "@/lib/utils";

const PRIMARY_TOOLBAR_ITEMS = [
  { id: "draw", title: "Draw", icon: Pencil },
  { id: "rect", title: "Rectangle", icon: Square },
  { id: "circle", title: "Circle", icon: Circle },
  { id: "text", title: "Text", icon: Type },
  { id: "eraser", title: "Eraser", icon: Eraser },
  { id: "undo", title: "Undo", icon: Undo2 },
  { id: "export", title: "Export", icon: Download },
];

const SWATCHES = ["#111111", "#ffffff", "#3D5AFE", "#ff4fd8", "#ff9a56", "#28c840"];

export default function CanvasAppPopup({ onClose }: { onClose: () => void }) {
  const engine = usePaintEngine();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "z" && e.shiftKey) {
        e.preventDefault();
        engine.redo();
      } else if (mod && e.key.toLowerCase() === "z") {
        e.preventDefault();
        engine.undo();
      } else if (e.key === "Delete" || e.key === "Backspace") {
        if ((e.target as HTMLElement)?.tagName === "INPUT") return;
        e.preventDefault();
        engine.clearActiveLayer();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engine.undo, engine.redo, engine.clearActiveLayer]);

  return (
    <PopupShell title="Canvas" onClose={onClose} className="w-[600px]">
      <div className="m-3.5 flex flex-wrap items-center gap-2">
        <Toolbar
          items={PRIMARY_TOOLBAR_ITEMS}
          defaultSelected="draw"
          showLockToggle={false}
          onSelect={(id) => {
            if (id === "undo") engine.undo();
            else if (id === "export") engine.exportPng();
            else engine.setTool(id as Tool);
          }}
        />

        <div className="flex items-center gap-1 rounded-xl border border-neutral-200 bg-white p-1.5">
          <button
            type="button"
            title="Line"
            onClick={() => engine.setTool("line")}
            className={cn("rounded-lg p-1.5", engine.tool === "line" && "bg-[#1F9CFE] text-white")}
          >
            <Slash size={15} />
          </button>
          <button
            type="button"
            title="Arrow"
            onClick={() => engine.setTool("arrow")}
            className={cn("rounded-lg p-1.5", engine.tool === "arrow" && "bg-[#1F9CFE] text-white")}
          >
            <ArrowRight size={15} />
          </button>
          <button
            type="button"
            title="Eyedropper"
            onClick={() => engine.setTool("eyedropper")}
            className={cn("rounded-lg p-1.5", engine.tool === "eyedropper" && "bg-[#1F9CFE] text-white")}
          >
            <Pipette size={15} />
          </button>
          <button
            type="button"
            title={engine.fillMode ? "Fill" : "Stroke"}
            onClick={() => engine.setFillMode(!engine.fillMode)}
            className="rounded-lg border border-neutral-200 px-2 py-1 text-[10px] font-medium text-neutral-600"
          >
            {engine.fillMode ? "Fill" : "Stroke"}
          </button>
        </div>

        <div className="flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-2.5 py-1.5">
          <span className="text-[10px] text-neutral-400">Size</span>
          <input
            type="range"
            min={1}
            max={24}
            value={engine.brushSize}
            onChange={(e) => engine.setBrushSize(Number(e.target.value))}
            className="h-1 w-16"
          />
        </div>

        <div className="flex items-center gap-1 rounded-xl border border-neutral-200 bg-white p-1.5">
          {SWATCHES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => engine.setColor(c)}
              className={cn(
                "h-5 w-5 rounded-full ring-1 ring-neutral-200",
                engine.color === c && "ring-2 ring-[#1F9CFE]"
              )}
              style={{ background: c }}
            />
          ))}
          <input
            type="color"
            value={engine.color}
            onChange={(e) => engine.setColor(e.target.value)}
            className="h-5 w-6 cursor-pointer rounded"
          />
        </div>

        <div className="flex items-center gap-1 rounded-xl border border-neutral-200 bg-white p-1.5">
          <button
            type="button"
            onClick={() => engine.setZoom(Math.max(0.25, +(engine.zoom - 0.25).toFixed(2)))}
          >
            <ZoomOut size={14} />
          </button>
          <span className="w-9 text-center text-[10px] text-neutral-500">
            {Math.round(engine.zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => engine.setZoom(Math.min(2, +(engine.zoom + 0.25).toFixed(2)))}
          >
            <ZoomIn size={14} />
          </button>
        </div>
      </div>

      <div className="mx-3.5 mb-3.5 flex gap-3">
        <div className="overflow-auto" style={{ maxWidth: 420, maxHeight: 280 }}>
          <PaintCanvasStack engine={engine} />
        </div>
        <LayersPanel engine={engine} />
      </div>
    </PopupShell>
  );
}

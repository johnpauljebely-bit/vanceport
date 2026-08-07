"use client";

import { useRef } from "react";
import type { PaintEngine } from "@/components/canvas-app/use-paint-engine";
import { CANVAS_W, CANVAS_H } from "@/components/canvas-app/use-paint-engine";

function checkerBg(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const size = 8;
  for (let y = 0; y < canvas.height; y += size) {
    for (let x = 0; x < canvas.width; x += size) {
      ctx.fillStyle = (x / size + y / size) % 2 === 0 ? "#f4f4f4" : "#e4e4e4";
      ctx.fillRect(x, y, size, size);
    }
  }
}

export default function PaintCanvasStack({ engine }: { engine: PaintEngine }) {
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const startPoint = useRef({ x: 0, y: 0 });
  const lastPoint = useRef({ x: 0, y: 0 });

  function toCanvasCoords(e: React.PointerEvent): { x: number; y: number } {
    const overlay = overlayRef.current;
    if (!overlay) return { x: 0, y: 0 };
    const rect = overlay.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * CANVAS_W,
      y: ((e.clientY - rect.top) / rect.height) * CANVAS_H,
    };
  }

  function activeCtx() {
    const canvas = document.getElementById(`layer-canvas-${engine.activeLayerId}`) as HTMLCanvasElement | null;
    return canvas?.getContext("2d") ?? null;
  }

  function clearOverlay() {
    const ctx = overlayRef.current?.getContext("2d");
    if (ctx) ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
  }

  function drawShapePreview(x: number, y: number) {
    const overlay = overlayRef.current;
    const ctx = overlay?.getContext("2d");
    if (!ctx) return;
    clearOverlay();
    ctx.strokeStyle = engine.color;
    ctx.fillStyle = engine.color;
    ctx.lineWidth = engine.brushSize;
    drawShape(ctx, engine.tool, startPoint.current, { x, y }, engine.fillMode);
  }

  function handlePointerDown(e: React.PointerEvent) {
    const p = toCanvasCoords(e);
    startPoint.current = p;
    lastPoint.current = p;
    drawing.current = true;

    if (engine.tool === "eyedropper") {
      const hex = engine.eyedrop(p.x, p.y);
      if (hex) engine.setColor(hex);
      drawing.current = false;
      return;
    }

    if (engine.tool === "text") {
      const text = window.prompt("Text:");
      drawing.current = false;
      if (!text) return;
      const ctx = activeCtx();
      if (!ctx) return;
      ctx.fillStyle = engine.color;
      ctx.font = `${12 + engine.brushSize * 3}px Inter, sans-serif`;
      ctx.fillText(text, p.x, p.y);
      engine.pushHistory();
      return;
    }

    if (engine.tool === "draw" || engine.tool === "eraser") {
      const ctx = activeCtx();
      if (!ctx) return;
      ctx.globalCompositeOperation = engine.tool === "eraser" ? "destination-out" : "source-over";
      ctx.strokeStyle = engine.color;
      ctx.lineWidth = engine.brushSize;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + 0.01, p.y + 0.01);
      ctx.stroke();
    }
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!drawing.current) return;
    const p = toCanvasCoords(e);

    if (engine.tool === "draw" || engine.tool === "eraser") {
      const ctx = activeCtx();
      if (!ctx) return;
      ctx.beginPath();
      ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      lastPoint.current = p;
    } else if (["line", "rect", "circle", "arrow"].includes(engine.tool)) {
      drawShapePreview(p.x, p.y);
    }
  }

  function handlePointerUp(e: React.PointerEvent) {
    if (!drawing.current) return;
    drawing.current = false;
    const p = toCanvasCoords(e);

    if (engine.tool === "draw" || engine.tool === "eraser") {
      const ctx = activeCtx();
      if (ctx) ctx.globalCompositeOperation = "source-over";
      engine.pushHistory();
    } else if (["line", "rect", "circle", "arrow"].includes(engine.tool)) {
      clearOverlay();
      const ctx = activeCtx();
      if (ctx) {
        ctx.strokeStyle = engine.color;
        ctx.fillStyle = engine.color;
        ctx.lineWidth = engine.brushSize;
        drawShape(ctx, engine.tool, startPoint.current, p, engine.fillMode);
      }
      engine.pushHistory();
    }
  }

  return (
    <div
      className="relative overflow-hidden rounded-xl border border-neutral-200 bg-white"
      style={{ width: CANVAS_W * engine.zoom, height: CANVAS_H * engine.zoom }}
    >
      <div
        className="relative origin-top-left"
        style={{ width: CANVAS_W, height: CANVAS_H, transform: `scale(${engine.zoom})` }}
      >
        <canvas
          width={CANVAS_W}
          height={CANVAS_H}
          className="absolute left-0 top-0"
          ref={(el) => {
            if (el) checkerBg(el);
          }}
        />
        {engine.layers.map((layer) => (
          <canvas
            key={layer.id}
            id={`layer-canvas-${layer.id}`}
            width={CANVAS_W}
            height={CANVAS_H}
            className="absolute left-0 top-0"
            style={{ opacity: layer.opacity, display: layer.visible ? "block" : "none" }}
            ref={(el) => engine.registerCanvas(layer.id, el)}
          />
        ))}
        <canvas
          ref={overlayRef}
          width={CANVAS_W}
          height={CANVAS_H}
          className="absolute left-0 top-0 touch-none"
          style={{ cursor: engine.tool === "eyedropper" ? "crosshair" : "default" }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        />
      </div>
    </div>
  );
}

function drawShape(
  ctx: CanvasRenderingContext2D,
  tool: string,
  start: { x: number; y: number },
  end: { x: number; y: number },
  fill: boolean
) {
  ctx.beginPath();
  if (tool === "line") {
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  } else if (tool === "rect") {
    const w = end.x - start.x;
    const h = end.y - start.y;
    if (fill) ctx.fillRect(start.x, start.y, w, h);
    else ctx.strokeRect(start.x, start.y, w, h);
  } else if (tool === "circle") {
    const r = Math.hypot(end.x - start.x, end.y - start.y);
    ctx.arc(start.x, start.y, r, 0, Math.PI * 2);
    if (fill) ctx.fill();
    else ctx.stroke();
  } else if (tool === "arrow") {
    const angle = Math.atan2(end.y - start.y, end.x - start.x);
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
    const headLen = 10;
    ctx.beginPath();
    ctx.moveTo(end.x, end.y);
    ctx.lineTo(
      end.x - headLen * Math.cos(angle - Math.PI / 6),
      end.y - headLen * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(end.x, end.y);
    ctx.lineTo(
      end.x - headLen * Math.cos(angle + Math.PI / 6),
      end.y - headLen * Math.sin(angle + Math.PI / 6)
    );
    ctx.stroke();
  }
}

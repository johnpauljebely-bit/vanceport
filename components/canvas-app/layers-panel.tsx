"use client";

import { useState } from "react";
import { Eye, EyeOff, Copy, Trash2, ChevronUp, ChevronDown, Plus } from "lucide-react";
import type { PaintEngine } from "@/components/canvas-app/use-paint-engine";
import { cn } from "@/lib/utils";

export default function LayersPanel({ engine }: { engine: PaintEngine }) {
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="w-[130px] shrink-0">
      <div className="mb-2 font-mono text-[10px] tracking-[0.06em] text-neutral-400">
        LAYERS
      </div>
      <div className="flex flex-col gap-1">
        {[...engine.layers].reverse().map((layer, revIdx) => {
          const idx = engine.layers.length - 1 - revIdx;
          const active = layer.id === engine.activeLayerId;
          return (
            <div
              key={layer.id}
              onClick={() => engine.setActiveLayerId(layer.id)}
              className={cn(
                "cursor-pointer rounded-md px-2 py-1.5 text-[11px]",
                active ? "bg-[#eef4ff]" : "hover:bg-neutral-50"
              )}
            >
              <div className="flex items-center justify-between gap-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    engine.toggleVisible(layer.id);
                  }}
                  className="text-neutral-400 hover:text-neutral-700"
                >
                  {layer.visible ? <Eye size={12} /> : <EyeOff size={12} />}
                </button>
                {editingId === layer.id ? (
                  <input
                    autoFocus
                    defaultValue={layer.name}
                    onBlur={(e) => {
                      engine.renameLayer(layer.id, e.target.value || layer.name);
                      setEditingId(null);
                    }}
                    onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
                    className="min-w-0 flex-1 rounded border border-neutral-300 px-1 text-[11px] outline-none"
                  />
                ) : (
                  <span
                    className="flex-1 truncate"
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      setEditingId(layer.id);
                    }}
                  >
                    {layer.name}
                  </span>
                )}
              </div>

              <div className="mt-1 flex items-center gap-1 text-neutral-400">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    engine.moveLayer(layer.id, 1);
                  }}
                  disabled={idx === engine.layers.length - 1}
                  className="disabled:opacity-30"
                >
                  <ChevronUp size={11} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    engine.moveLayer(layer.id, -1);
                  }}
                  disabled={idx === 0}
                  className="disabled:opacity-30"
                >
                  <ChevronDown size={11} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    engine.duplicateLayer(layer.id);
                  }}
                >
                  <Copy size={11} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    engine.deleteLayer(layer.id);
                  }}
                  disabled={engine.layers.length <= 1}
                  className="disabled:opacity-30"
                >
                  <Trash2 size={11} />
                </button>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={layer.opacity}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => engine.setOpacity(layer.id, Number(e.target.value))}
                className="mt-1 h-1 w-full"
              />
            </div>
          );
        })}
      </div>
      <button
        type="button"
        onClick={engine.addLayer}
        className="mt-1.5 flex w-full items-center justify-center gap-1 rounded-md bg-neutral-100 py-2 text-[11px] text-neutral-600 hover:bg-neutral-200"
      >
        <Plus size={12} /> Add Layer
      </button>
    </div>
  );
}

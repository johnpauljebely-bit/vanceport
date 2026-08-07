"use client";

import { Search, Power, ChevronDown } from "lucide-react";
import PopupShell from "@/components/desktop/popup-shell";
import { useDesktopStore } from "@/lib/desktop-store";

const TEMPLATES = [
  { label: "Instagram Post", bg: "#8b3dff" },
  { label: "Presentation", bg: "#00c4cc" },
  { label: "Poster", bg: "#ff6f91" },
  { label: "Logo", bg: "#ffb84f" },
  { label: "Resume", bg: "#4fd8ff" },
  { label: "Flyer", bg: "#a259ff" },
];

export default function CanvaPopup({ onClose }: { onClose: () => void }) {
  const canvaPanicked = useDesktopStore((s) => s.canvaPanicked);
  const triggerCanvaPanic = useDesktopStore((s) => s.triggerCanvaPanic);

  return (
    <PopupShell title="Canva" onClose={onClose} className="relative w-[540px]">
      <div className="relative">
        <div
          className="flex items-center gap-3.5 border-b border-neutral-100 px-5 py-3.5"
          onClick={triggerCanvaPanic}
        >
          <span className="text-base font-extrabold text-[#8b3dff]">Canva</span>
          <div className="flex flex-1 items-center gap-2 rounded-full bg-neutral-100 px-4 py-2 text-xs text-neutral-400">
            <Search size={12} /> Search templates…
          </div>
          <div className="flex items-center gap-1 rounded-full bg-[#8b3dff] px-1 py-1 text-xs text-white">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#8b3dff] font-semibold">
              V
            </span>
            <ChevronDown size={12} className="mr-1" />
          </div>
        </div>

        <div
          className="cursor-pointer px-5 py-6 text-center text-lg font-bold text-neutral-800"
          onClick={triggerCanvaPanic}
        >
          What will you design today?
        </div>

        <div className="grid grid-cols-3 gap-2.5 px-5 pb-6">
          {TEMPLATES.map((t) => (
            <button
              key={t.label}
              type="button"
              onClick={triggerCanvaPanic}
              className="flex h-20 items-end rounded-lg p-2 text-left text-[11px] font-semibold text-white transition-transform hover:scale-[1.03]"
              style={{ background: t.bg }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {canvaPanicked && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-b-xl bg-black/[0.92] text-center text-white">
            <div className="max-w-[320px] font-mono">
              <Power size={30} className="mx-auto mb-3.5" />
              <p className="text-xs leading-relaxed">
                You need to restart your computer.
                <br />
                Hold down the Power button for several seconds, or press
                Control-Command-Power button.
              </p>
              <p className="mt-2.5 text-[10px] opacity-50">
                (four years of Canva and it still does this)
              </p>
            </div>
          </div>
        )}
      </div>
    </PopupShell>
  );
}

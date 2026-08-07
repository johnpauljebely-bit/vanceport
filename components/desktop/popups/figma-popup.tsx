"use client";

import { Search, Play, MessageSquare, ChevronRight } from "lucide-react";
import PopupShell from "@/components/desktop/popup-shell";

export default function FigmaPopup({ onClose }: { onClose: () => void }) {
  return (
    <PopupShell title="Figma" onClose={onClose} className="w-[620px]">
      <div className="flex h-9 items-center gap-3 border-b border-neutral-200 bg-[#2c2c2c] px-3 text-[12px] text-neutral-200">
        <svg width="14" height="14" viewBox="0 0 38 57">
          <path fill="#0acf83" d="M19 28.5a9.5 9.5 0 119.5-9.5 9.5 9.5 0 01-9.5 9.5z" transform="translate(0 28.5)" />
          <path fill="#a259ff" d="M0 47.5A9.5 9.5 0 019.5 38H19v9.5a9.5 9.5 0 01-19 0z" />
          <path fill="#f24e1e" d="M9.5 0H19v19H9.5a9.5 9.5 0 010-19z" />
          <path fill="#ff7262" d="M19 0h9.5a9.5 9.5 0 010 19H19z" />
          <path fill="#1abcfe" d="M28.5 28.5a9.5 9.5 0 100 19 9.5 9.5 0 000-19z" />
        </svg>
        <span className="font-medium">Vance — Case Studies</span>
        <div className="ml-auto flex items-center gap-3 text-neutral-400">
          <Play size={13} />
          <MessageSquare size={13} />
          <span className="rounded-full bg-[#0d99ff] px-2.5 py-1 text-white">Share</span>
        </div>
      </div>

      <div className="flex h-[300px] text-[11px]">
        <div className="w-[130px] border-r border-neutral-200 bg-[#fafafa] p-2.5 text-neutral-600">
          <div className="mb-1.5 flex items-center justify-between px-1 font-semibold text-neutral-400">
            <span>Pages</span>
          </div>
          <div className="rounded bg-[#e8e8fd] px-2 py-1.5 font-medium text-[#5551ff]">Wireframes</div>
          <div className="px-2 py-1.5">Ideas</div>
          <div className="px-2 py-1.5 text-neutral-400">Trash (mostly)</div>

          <div className="mt-4 mb-1.5 px-1 font-semibold text-neutral-400">Layers</div>
          <div className="flex items-center gap-1 px-2 py-1"><ChevronRight size={10} /> Frame 01</div>
          <div className="pl-4 py-1">Rectangle</div>
          <div className="pl-4 py-1">Case study text</div>
        </div>

        <div className="relative flex-1 bg-[#e9e9e9]">
          <div className="absolute left-2.5 top-2.5 flex items-center gap-1.5 rounded bg-white px-2 py-1 text-neutral-500 shadow-sm">
            <Search size={11} /> 100%
          </div>
          <div className="flex h-full items-center justify-center">
            <div className="h-[110px] w-[160px] rounded-md border-2 border-[#a259ff] bg-white shadow-sm" />
          </div>
        </div>

        <div className="w-[130px] border-l border-neutral-200 bg-[#fafafa] p-2.5 text-neutral-600">
          <div className="mb-2 font-semibold text-neutral-400">Design</div>
          <div className="mb-1.5">
            <div className="mb-1 text-neutral-400">Fill</div>
            <div className="flex items-center gap-1.5 rounded bg-white px-1.5 py-1">
              <span className="h-3 w-3 rounded-sm bg-white ring-1 ring-neutral-300" />
              FFFFFF
            </div>
          </div>
          <div className="mb-1.5">
            <div className="mb-1 text-neutral-400">Stroke</div>
            <div className="flex items-center gap-1.5 rounded bg-white px-1.5 py-1">
              <span className="h-3 w-3 rounded-sm bg-[#a259ff]" />
              A259FF
            </div>
          </div>
          <div>
            <div className="mb-1 text-neutral-400">Radius</div>
            <div className="rounded bg-white px-1.5 py-1">6</div>
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-200 px-4 py-3 text-[13px] text-neutral-500">
        This is where every idea gets tested before it&apos;s allowed to become a
        real one. Mostly wireframes. Occasionally chaos.
      </div>
    </PopupShell>
  );
}

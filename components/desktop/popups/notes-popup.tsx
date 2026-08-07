"use client";

import { useState } from "react";
import { StickyNote, Search } from "lucide-react";
import PopupShell from "@/components/desktop/popup-shell";
import { projects } from "@/data/projects";

function noteBody(title: string, description: string, role: string, tags: string[]) {
  return `${title}\n${role}\n\n${description}\n\nTags: ${tags.join(", ")}`;
}

export default function NotesPopup({ onClose }: { onClose: () => void }) {
  const [selected, setSelected] = useState(0);
  const active = projects[selected];

  return (
    <PopupShell
      title="Notes"
      onClose={onClose}
      className="w-[520px]"
      bodyClassName="flex h-[340px]"
    >
      <div className="w-[170px] overflow-y-auto border-r border-neutral-200 bg-[#fbf6e9]">
        <div className="flex items-center gap-1.5 border-b border-[#f0e9d0] px-3 py-2.5 text-[11px] text-neutral-500">
          <Search size={11} /> Search
        </div>
        {projects.map((p, i) => (
          <button
            key={p.slug}
            type="button"
            onClick={() => setSelected(i)}
            className={`flex w-full items-start gap-2 border-b border-[#f0e9d0] px-3.5 py-3 text-left text-[12px] ${
              selected === i ? "bg-[#f5e9b8]" : ""
            }`}
          >
            <StickyNote size={12} className="mt-0.5 shrink-0 text-[#a1811f]" />
            <span>
              <div className="font-medium text-neutral-800">{p.title}</div>
              <div className="text-[10px] text-neutral-500">{p.role}</div>
            </span>
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto whitespace-pre-line bg-[#fffef8] p-4.5 font-serif text-[13px] leading-relaxed text-neutral-800">
        {noteBody(active.title, active.description, active.role, active.tags)}
      </div>
    </PopupShell>
  );
}

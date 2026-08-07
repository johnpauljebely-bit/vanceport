"use client";

import { useState } from "react";
import {
  Search,
  Home,
  MessageCircle,
  Bell,
  Plus,
  ArrowLeft,
  Bookmark,
  MoreHorizontal,
  Send,
  Dog,
  Palette,
  Sparkles,
  Grid3x3,
  Coffee,
  Music,
  Camera,
  Rocket,
  Heart,
  Cat,
  Pizza,
  Flower2,
  type LucideIcon,
} from "lucide-react";
import PopupShell from "@/components/desktop/popup-shell";

const RICKROLL_URL = "https://www.youtube.com/watch?v=xvFZjo5PgG0";

interface Pin {
  id: string;
  h: number;
  bg: string;
  icon: LucideIcon;
  caption: string;
  saves: string;
  description: string;
}

const PINS: Pin[] = [
  { id: "p1", h: 210, bg: "linear-gradient(135deg,#ffd36e,#ff9a9a)", icon: Dog, caption: "me at 2am still in Figma", saves: "1.2k", description: "A very accurate self-portrait. Iteration 47 of the same button." },
  { id: "p2", h: 130, bg: "#ffe0e0", icon: Palette, caption: "moodboard #47", saves: "340", description: "The moodboard that finally got client approval, after moodboards 1 through 46 did not." },
  { id: "p3", h: 170, bg: "#e0f0ff", icon: Sparkles, caption: "font pairing inspo", saves: "890", description: "Fraunces + Inter. Works every time. Don't overthink it." },
  { id: "p4", h: 110, bg: "#eaffea", icon: Grid3x3, caption: "grid systems", saves: "512", description: "8pt grid, always. This pin has personally saved 3 client relationships." },
  { id: "p5", h: 190, bg: "#f3e8ff", icon: Coffee, caption: "fuel for the deadline", saves: "2.1k", description: "Cold by the time you remember it exists. Every single time." },
  { id: "p6", h: 150, bg: "#fff0e0", icon: Music, caption: "lo-fi for wireframing", saves: "670", description: "Same 8 songs on loop for the past four years of your career." },
  { id: "p7", h: 200, bg: "#e0fff5", icon: Camera, caption: "before/after — worth it", saves: "1.5k", description: "The client said 'make it pop.' This is what pop looks like, apparently." },
  { id: "p8", h: 120, bg: "#ffe8f0", icon: Rocket, caption: "shipped it at 11:58pm", saves: "980", description: "Two minutes before the deadline. A personal best." },
  { id: "p9", h: 160, bg: "#e8f0ff", icon: Heart, caption: "client said 'i love it!!'", saves: "3.4k", description: "Rarer than a shiny Pokémon. Screenshot immediately." },
  { id: "p10", h: 140, bg: "#f0ffe8", icon: Cat, caption: "office supervisor", saves: "4.8k", description: "Approves of exactly none of your color choices. Sits on the keyboard regardless." },
  { id: "p11", h: 180, bg: "#fff8e0", icon: Pizza, caption: "crunch week dinner, again", saves: "760", description: "A balanced diet of pizza and unresolved Figma comments." },
  { id: "p12", h: 130, bg: "#f5e8ff", icon: Flower2, caption: "the pinterest rabbit hole", saves: "2.9k", description: "Came here for grid inspo. Leaving four hours later with none." },
];

export default function PinterestPopup({ onClose }: { onClose: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const active = PINS.find((p) => p.id === selected) ?? null;
  const related = active ? PINS.filter((p) => p.id !== active.id).slice(0, 4) : [];

  return (
    <PopupShell title="Pinterest" onClose={onClose} className="w-[760px]" bodyClassName="flex h-[600px] flex-col bg-white">
      <div className="flex items-center gap-3 border-b border-neutral-200 px-4 py-2.5">
        {active ? (
          <button
            type="button"
            onClick={() => setSelected(null)}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium text-neutral-600 hover:bg-neutral-100"
          >
            <ArrowLeft size={14} /> Back
          </button>
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e60023] text-white">
            <span className="text-base font-bold">P</span>
          </div>
        )}

        <button
          type="button"
          className="flex items-center gap-2 rounded-full bg-neutral-900 px-4 py-2 text-[12px] font-semibold text-white"
        >
          <Home size={14} /> Home
        </button>

        <div className="flex flex-1 items-center gap-2 rounded-full bg-neutral-100 px-4 py-2 text-[12px] text-neutral-500">
          <Search size={13} />
          Search
        </div>

        <div className="flex items-center gap-1.5">
          <button className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100">
            <Plus size={15} />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100">
            <MessageCircle size={15} />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100">
            <Bell size={15} />
          </button>
          <a
            href={RICKROLL_URL}
            target="_blank"
            rel="noreferrer"
            className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#e60023] to-[#ad081b] text-[11px] font-bold text-white"
            title="Open in new tab"
          >
            V
          </a>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-white p-4">
        {!active ? (
          <div className="columns-3 gap-3">
            {PINS.map((pin) => (
              <button
                key={pin.id}
                type="button"
                onClick={() => setSelected(pin.id)}
                className="group mb-3 block w-full break-inside-avoid overflow-hidden rounded-2xl bg-white text-left shadow-sm ring-1 ring-neutral-100 transition-shadow hover:shadow-md"
              >
                <div
                  className="relative flex items-center justify-center"
                  style={{ height: pin.h, background: pin.bg }}
                >
                  <pin.icon size={pin.h > 170 ? 46 : 32} className="text-black/70" />
                  <span className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-1 text-[10px] font-semibold text-neutral-700 opacity-0 shadow transition-opacity group-hover:opacity-100">
                    Save
                  </span>
                </div>
                <div className="px-2.5 py-2">
                  <div className="text-[12px] font-medium text-neutral-800">{pin.caption}</div>
                  <div className="mt-0.5 text-[10px] text-neutral-400">{pin.saves} saves</div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="mx-auto flex max-w-[560px] gap-6">
            <div
              className="flex h-[320px] w-[320px] shrink-0 items-center justify-center rounded-2xl"
              style={{ background: active.bg }}
            >
              <active.icon size={72} className="text-black/70" />
            </div>
            <div className="flex-1 pt-2">
              <div className="mb-3 flex items-center gap-2">
                <button className="flex items-center gap-1.5 rounded-full bg-[#e60023] px-4 py-2 text-[12px] font-semibold text-white">
                  <Bookmark size={13} /> Save
                </button>
                <button className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
                  <Send size={14} />
                </button>
                <button className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
                  <MoreHorizontal size={14} />
                </button>
              </div>
              <h3 className="mb-1.5 text-[17px] font-semibold text-neutral-900">{active.caption}</h3>
              <p className="text-[13px] leading-relaxed text-neutral-600">{active.description}</p>
              <div className="mt-4 text-[11px] text-neutral-400">{active.saves} saves · a while ago</div>

              <div className="mt-6 border-t border-neutral-100 pt-4">
                <div className="mb-2 text-[11px] font-semibold text-neutral-500">MORE LIKE THIS</div>
                <div className="grid grid-cols-2 gap-2">
                  {related.map((pin) => (
                    <button
                      key={pin.id}
                      type="button"
                      onClick={() => setSelected(pin.id)}
                      className="flex h-20 items-center justify-center rounded-xl"
                      style={{ background: pin.bg }}
                    >
                      <pin.icon size={22} className="text-black/70" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PopupShell>
  );
}

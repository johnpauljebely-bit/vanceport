"use client";

import { Dock, DockIcon } from "@/components/ui/dock";
import { useDesktopStore, type PopupId } from "@/lib/desktop-store";

// image icons dropped into /public/icons/ — see README for exact filenames expected.
const APPS: { id: PopupId; label: string; image: string }[] = [
  { id: "canva", label: "Canva", image: "/icons/canva.png" },
  { id: "photoshop", label: "Photoshop", image: "/icons/photoshop.png" },
  { id: "figma", label: "Figma", image: "/icons/figma.png" },
  { id: "claude", label: "Claude", image: "/icons/claude.png" },
  { id: "pinterest", label: "Pinterest", image: "/icons/pintrist.png" },
];

export default function AppleDock() {
  const openPopup = useDesktopStore((s) => s.openPopup);

  return (
    <Dock
      direction="middle"
      iconSize={80}
      iconMagnification={112}
      iconDistance={150}
      data-cursor-surface="light"
      className="absolute bottom-5 left-1/2 z-20 -translate-x-1/2 gap-4 rounded-[19px] border-white/40 bg-white/25 p-3 backdrop-blur-xl supports-backdrop-blur:bg-white/25"
    >
      {APPS.map((app) => (
        <DockIcon key={app.id} className="rounded-xl">
          <button
            type="button"
            onClick={() => openPopup(app.id)}
            aria-label={`Open ${app.label}`}
            className="group relative flex h-full w-full items-center justify-center transition-transform"
          >
            <img
              src={app.image}
              alt={app.label}
              className="h-full w-full object-contain drop-shadow-[0_3px_10px_rgba(0,0,0,0.25)]"
              draggable={false}
            />
            <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/80 px-2 py-1 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
              {app.label}
            </span>
          </button>
        </DockIcon>
      ))}
    </Dock>
  );
}

"use client";

import { ArrowLeft } from "lucide-react";
import { useDesktopStore } from "@/lib/desktop-store";
import MenuBar from "@/components/desktop/menu-bar";
import AppleDock from "@/components/desktop/apple-dock";
import ScatteredIcons from "@/components/desktop/scattered-icons";
import PopupManager from "@/components/desktop/popups/popup-manager";

export default function DesktopOverlay() {
  const isOpen = useDesktopStore((s) => s.isOpen);
  const closeDesktop = useDesktopStore((s) => s.closeDesktop);

  if (!isOpen) return null;

  return (
    <div
      data-cursor-surface="dark"
      className="fixed inset-0 z-[2000] overflow-hidden bg-[#dfe3ea] text-neutral-900 [color-scheme:light]"
      style={{
        backgroundImage: "url(/wallpaper/desktop-bg.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-black/45" />

      <MenuBar />

      <button
        type="button"
        onClick={closeDesktop}
        className="absolute left-4.5 top-9 z-50 flex items-center gap-1.5 rounded-lg bg-black/40 px-3.5 py-2 font-mono text-xs text-white backdrop-blur-md"
      >
        <ArrowLeft size={13} /> Back
      </button>

      <ScatteredIcons />
      <AppleDock />

      <PopupManager />
    </div>
  );
}

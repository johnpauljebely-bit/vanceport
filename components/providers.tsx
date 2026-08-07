"use client";

import { SmoothCursor } from "@/components/ui/smooth-cursor";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import SiteDockNav from "@/components/site-dock-nav";
import SiteFooter from "@/components/site-footer";
import DesktopOverlay from "@/components/desktop/desktop-overlay";
import CommandPalette from "@/components/command-palette";
import MusicPlayer from "@/components/music-player";
import SmartCursorDot from "@/components/smart-cursor-dot";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollProgress className="h-[3px] bg-white mix-blend-difference dark:bg-[linear-gradient(to_right,#340B05,#0358F7,#5092C7,#E1ECFE,#FFD400,#FA3D1D,#FD02F5,#FFC0FD)] dark:mix-blend-normal" />
      <SmoothCursor cursor={<SmartCursorDot />} />
      <SiteDockNav />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <DesktopOverlay />
      <CommandPalette />
      <MusicPlayer />
    </>
  );
}

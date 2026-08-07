"use client";

import { pixelFont } from "@/lib/pixel-font";
import { cn } from "@/lib/utils";

export default function GameShell({
  score,
  hint,
  children,
}: {
  score: number;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border-[6px] border-[#232323] bg-[#0c0c0e] p-3 shadow-[inset_0_0_20px_rgba(0,0,0,0.6)]">
      <div className="relative overflow-hidden rounded-lg">
        {children}
        <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(to_bottom,rgba(255,255,255,0.05)_0px,rgba(255,255,255,0.05)_1px,transparent_1px,transparent_3px)]" />
      </div>
      <div
        className={cn(pixelFont.className, "mt-3 flex items-center justify-between px-1 text-[10px] text-[#7dffb0]")}
      >
        <span>SCORE {score.toString().padStart(4, "0")}</span>
      </div>
      <div className="mt-1 px-1 text-center font-mono text-[10px] text-neutral-500">{hint}</div>
    </div>
  );
}

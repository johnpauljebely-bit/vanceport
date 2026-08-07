"use client";

import { useEffect, useState } from "react";
import { isDarkSurfaceAt } from "@/lib/cursor-surface";

export default function SmartCursorDot() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    let rafId = 0;
    let pending: { x: number; y: number } | null = null;

    function onMove(e: PointerEvent) {
      pending = { x: e.clientX, y: e.clientY };
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        if (!pending) return;
        setIsDark(isDarkSurfaceAt(pending.x, pending.y));
      });
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      style={{
        width: 16,
        height: 16,
        borderRadius: "50%",
        background: isDark ? "#fff" : "#000",
      }}
    />
  );
}

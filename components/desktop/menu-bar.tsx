"use client";

import { useEffect, useState } from "react";
import { Battery, Wifi } from "lucide-react";
import { SiApple } from "react-icons/si";

const MENU_LABELS = ["File", "Edit", "View", "Go", "Window", "Help"];

export default function MenuBar() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    function tick() {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        })
      );
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="absolute inset-x-0 top-0 z-[60] flex h-[26px] items-center justify-between bg-white/55 px-3.5 font-mono text-xs font-medium text-[#1a1a1a] backdrop-blur-2xl">
      <div className="flex items-center gap-4">
        <SiApple size={13} />
        <span className="font-semibold">Finder</span>
        {MENU_LABELS.map((label) => (
          <span key={label} className="opacity-85">
            {label}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1 opacity-85">
          <Battery size={13} /> 100%
        </span>
        <Wifi size={13} className="opacity-85" />
        <span suppressHydrationWarning>{time}</span>
      </div>
    </div>
  );
}

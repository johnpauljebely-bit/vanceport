"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Dock } from "@/components/ui/dock";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { useDesktopStore } from "@/lib/desktop-store";
import { usePaletteStore } from "@/lib/palette-store";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Home", href: "/", tip: "Back to top" },
  { label: "Work", href: null, tip: "Open desktop" },
  { label: "About", href: "/about", tip: "Who I am" },
  { label: "Order", href: "/order", tip: "Commissions" },
  { label: "FAQ", href: "/faq", tip: "Questions" },
];

function NavButton({
  label,
  href,
  tip,
  onClick,
}: {
  label: string;
  href: string | null;
  tip: string;
  onClick?: () => void;
}) {
  const [hover, setHover] = useState(false);
  const className =
    "relative rounded-full px-4 py-2 text-xs font-mono tracking-wide text-white/60 transition-colors hover:bg-white/10 hover:text-white";

  const content = (
    <>
      {label}
      <span
        className={cn(
          "pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-full bg-black px-2 py-1 text-[10px] text-white opacity-0 transition-all",
          hover && "translate-y-0 opacity-100"
        )}
      >
        {tip}
      </span>
    </>
  );

  const handlers = {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
  };

  if (href) {
    return (
      <Link href={href} className={className} {...handlers}>
        {content}
      </Link>
    );
  }
  return (
    <button type="button" className={className} onClick={onClick} {...handlers}>
      {content}
    </button>
  );
}

export default function SiteDockNav() {
  const openDesktop = useDesktopStore((s) => s.openDesktop);
  const openPalette = usePaletteStore((s) => s.open);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  return (
    <nav className="fixed top-5 left-1/2 z-[500] -translate-x-1/2">
      <Dock
        direction="middle"
        className="h-auto w-max gap-0.5 rounded-full border-white/10 bg-black/70 p-1.5 backdrop-blur-xl supports-backdrop-blur:bg-black/70"
      >
        {NAV_ITEMS.map((item) => (
          <NavButton
            key={item.label}
            label={item.label}
            href={item.href}
            tip={item.tip}
            onClick={item.label === "Work" ? openDesktop : undefined}
          />
        ))}
        <div className="mx-1.5 h-4 w-px self-center bg-white/15" />
        <div className="group relative">
          <button
            type="button"
            onClick={openPalette}
            aria-label="Search"
            className="flex items-center justify-center rounded-full p-2.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Search size={14} />
          </button>
          <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-full bg-black px-2 py-1 text-[10px] text-white opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
            Search (⌘K)
          </span>
        </div>
        <div className="group relative">
          <AnimatedThemeToggler
            theme={isDark ? "dark" : "light"}
            onThemeChange={(t) => {
              setIsDark(t === "dark");
              localStorage.setItem("theme", t);
            }}
            className="flex items-center justify-center rounded-full p-2.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white [&_svg]:h-3.5 [&_svg]:w-3.5"
            aria-label="Toggle theme"
          />
          <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-full bg-black px-2 py-1 text-[10px] text-white opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
            Toggle theme
          </span>
        </div>
      </Dock>
    </nav>
  );
}

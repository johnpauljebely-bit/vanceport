"use client";

import { SpinningText } from "@/components/ui/spinning-text";
import { MorphingText } from "@/components/ui/morphing-text";
import { Safari } from "@/components/ui/safari";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { useDesktopStore } from "@/lib/desktop-store";

const MORPH_WORDS = [
  "entrepreneurs",
  "company owners",
  "designers",
  "startups",
  "creators",
  "small teams",
];

export default function Hero() {
  const openDesktop = useDesktopStore((s) => s.openDesktop);

  return (
    <section className="hero-surface relative flex min-h-screen flex-col items-center overflow-hidden px-6 pb-24 pt-36 text-center">
      <div className="relative mb-4 flex h-[130px] w-[130px] items-center justify-center">
        <SpinningText
          radius={7.5}
          className="font-mono text-[10px] tracking-wide text-hero-muted"
        >
          commissions open • dm on discord •
        </SpinningText>
      </div>

      <h1 className="max-w-4xl text-balance text-center font-serif text-[clamp(40px,7vw,92px)] font-semibold leading-[1.03] tracking-[-0.02em]">
        Impactful design for
      </h1>
      <MorphingText
        texts={MORPH_WORDS}
        className="!h-[1.1em] !max-w-4xl !text-[clamp(40px,7vw,92px)] italic !font-medium text-hero-muted"
      />

      <p className="mt-6 max-w-[520px] text-center font-sans text-lg text-hero-muted">
        UI/UX + brand identity design — Vance, based in Vancouver, BC.
      </p>

      <InteractiveHoverButton
        onClick={openDesktop}
        className="mt-8 border-0 px-7 py-3 text-sm"
      >
        View Work
      </InteractiveHoverButton>

      <div
        className="relative mt-16 scale-[0.42] sm:scale-[0.62] md:scale-100"
        style={{ perspective: 1600 }}
      >
        <button
          type="button"
          onClick={openDesktop}
          aria-label="Open interactive desktop"
          className="group relative block h-[120px] w-[820px] overflow-hidden rounded-2xl shadow-[0_40px_90px_-20px_rgba(0,0,0,0.65)]"
          style={{ transform: "rotateX(9deg) rotateY(-11deg) rotateZ(1deg)" }}
        >
          <div className="absolute left-0 top-0 w-[820px]">
            <Safari
              url="localhost:8000"
              imageSrc="/wallpaper/desktop-bg.jpg"
              className="w-[820px]"
            />
          </div>
          <div className="pointer-events-none absolute left-1/2 top-[70px] -translate-x-1/2 rounded-full bg-black/45 px-4 py-2 text-xs text-white backdrop-blur-md">
            click here to open desktop →
          </div>
        </button>
      </div>
    </section>
  );
}

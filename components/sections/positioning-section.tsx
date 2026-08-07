"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useMotionValueEvent } from "motion/react";
import { cn } from "@/lib/utils";

const ITEMS = [
  {
    num: "01",
    title: "Start with the actual problem",
    body: "Every project starts with a real constraint — a user, a business goal, a deadline — not a mood board.",
  },
  {
    num: "02",
    title: "Systems, not one-offs",
    body: "Interfaces and identities that hold together across screens and applications, not just the hero shot.",
  },
  {
    num: "03",
    title: "Find the answer without hunting for it",
    body: "Clear hierarchy and plain language so people get where they're going without thinking about it.",
  },
];

type FilmstripPanel =
  | { type: "image"; src: string; invertOnDark?: boolean }
  | { type: "stack"; images: [string, string] };

const FILMSTRIP: FilmstripPanel[] = [
  { type: "image", src: "/work/logos/10.png", invertOnDark: true },
  { type: "image", src: "/work/logos/09.png" },
  { type: "stack", images: ["/work/embed-banners/03.png", "/work/embed-banners/11.jpg"] },
];

export default function PositioningSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const clipRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [clipHeight, setClipHeight] = useState(460);

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });

  const filmY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -(clipHeight * (ITEMS.length - 1))]
  );

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(ITEMS.length - 1, Math.floor(v * ITEMS.length));
    setActiveIndex(idx);
  });

  useEffect(() => {
    function measure() {
      if (clipRef.current) setClipHeight(clipRef.current.clientHeight);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <section className="body-surface">
      <div className="pt-16 text-center">
        <div className="mb-3.5 font-mono text-xs font-semibold tracking-[0.06em] text-body-fg">
          POSITIONING
        </div>
        <h2 className="font-serif text-[clamp(28px,4vw,46px)] font-semibold tracking-[-0.01em]">
          Vance reads between the briefs
        </h2>
      </div>

      <div ref={scrollRef} className="relative h-[280vh]">
        <div className="sticky top-[110px] mx-auto grid h-[70vh] max-h-[460px] max-w-[1100px] grid-cols-1 items-center gap-10 px-6 md:grid-cols-2 md:gap-16">
          <div>
            {ITEMS.map((item, i) => (
              <div
                key={item.num}
                className={cn(
                  "mb-8 border-l-2 pl-4 opacity-35 transition-opacity duration-300",
                  "border-body-muted",
                  activeIndex === i && "border-body-fg opacity-100"
                )}
              >
                <div className="font-mono text-[11px] text-body-muted">{item.num}</div>
                <h3 className="my-1.5 font-serif text-lg font-semibold">{item.title}</h3>
                <p className="text-sm leading-relaxed text-body-muted">{item.body}</p>
              </div>
            ))}
          </div>

          <div
            ref={clipRef}
            className="relative h-[70vh] max-h-[460px] overflow-hidden rounded-[20px] bg-hero-bg"
          >
            <motion.div style={{ y: filmY }} className="will-change-transform">
              {FILMSTRIP.map((panel, i) => (
                <div
                  key={i}
                  className="flex h-[70vh] max-h-[460px] items-center justify-center p-10"
                >
                  {panel.type === "image" ? (
                    <div className="relative h-full w-full">
                      <Image
                        src={panel.src}
                        alt=""
                        fill
                        className={cn(
                          "object-contain",
                          panel.invertOnDark && "dark:invert"
                        )}
                        sizes="550px"
                      />
                    </div>
                  ) : (
                    <div className="flex h-full w-full flex-col gap-4">
                      {panel.images.map((src) => (
                        <div key={src} className="relative flex-1">
                          <Image src={src} alt="" fill className="object-contain" sizes="550px" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

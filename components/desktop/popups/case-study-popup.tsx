"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronUp, ChevronDown } from "lucide-react";
import PopupShell from "@/components/desktop/popup-shell";
import type { Project } from "@/data/projects";

const GALLERY_HEIGHT = 420;

function ImageGallery({ project }: { project: Project }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const total = project.gallery.length;

  function isDarkSlide(i: number) {
    if (!project.galleryDark) return false;
    return !project.galleryLightIndices?.includes(i);
  }

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    function onScroll() {
      if (!el) return;
      setIndex(Math.round(el.scrollTop / el.clientHeight));
    }
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  function goTo(i: number) {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: i * el.clientHeight, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="snap-y snap-mandatory overflow-y-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ height: GALLERY_HEIGHT }}
      >
        {project.gallery.map((src, i) => (
          <div
            key={src}
            className={`relative flex snap-start items-center justify-center ${
              isDarkSlide(i) ? "bg-black" : "bg-neutral-50"
            }`}
            style={{ height: GALLERY_HEIGHT }}
          >
            <Image
              src={src}
              alt={`${project.title} — image ${i + 1} of ${total}`}
              fill
              className="object-contain"
              sizes="520px"
            />
          </div>
        ))}
      </div>

      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b to-transparent ${
          isDarkSlide(index) ? "from-black" : "from-white"
        }`}
      />
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t to-transparent ${
          isDarkSlide(index) ? "from-black" : "from-white"
        }`}
      />

      <div className="absolute right-2.5 top-1/2 flex -translate-y-1/2 flex-col items-center gap-1.5">
        <button
          type="button"
          onClick={() => goTo(Math.max(0, index - 1))}
          disabled={index === 0}
          className="flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-neutral-600 shadow disabled:opacity-30"
          aria-label="Previous image"
        >
          <ChevronUp size={13} />
        </button>
        <span className="rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium text-neutral-500 shadow">
          {index + 1}/{total}
        </span>
        <button
          type="button"
          onClick={() => goTo(Math.min(total - 1, index + 1))}
          disabled={index === total - 1}
          className="flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-neutral-600 shadow disabled:opacity-30"
          aria-label="Next image"
        >
          <ChevronDown size={13} />
        </button>
      </div>
    </div>
  );
}

export default function CaseStudyPopup({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  return (
    <PopupShell title={`${project.slug}.png`} onClose={onClose} className="w-[520px]">
      <div className="p-5 pb-3.5">
        <div className="mb-2.5 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-neutral-100 px-2.5 py-1 text-[10px] text-neutral-600"
            >
              {tag}
            </span>
          ))}
          <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[10px] text-neutral-600">
            {project.role}
          </span>
        </div>
        <h3 className="mb-1.5 font-serif text-base font-semibold text-neutral-900">
          {project.title}
        </h3>
        <p className="text-[13px] leading-relaxed text-neutral-600">{project.description}</p>
      </div>

      {project.video ? (
        <video
          src={project.video}
          poster={project.coverImage}
          controls
          autoPlay
          loop
          muted
          playsInline
          className="block w-full bg-black"
          style={{ maxHeight: GALLERY_HEIGHT }}
        />
      ) : (
        <ImageGallery project={project} />
      )}
    </PopupShell>
  );
}

"use client";

export default function PhotoshopPopup({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="w-[380px] overflow-hidden rounded-xl bg-[#2c2c2e] text-white shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="border-b border-neutral-700 py-3.5 text-center text-[13px] text-neutral-400">
        Adobe Photoshop
      </div>
      <div className="flex items-start gap-3.5 p-5.5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-[#001e36] text-lg font-extrabold text-[#31a8ff]">
          Ps
        </div>
        <p className="text-[13px] leading-relaxed text-neutral-200">
          I won&apos;t save this file, because there&apos;s not enough memory, even
          though you cleaned it up before starting to work. No auto-save? Pity…
        </p>
      </div>
      <div className="px-5.5 pb-5.5 text-right">
        <button
          type="button"
          onClick={onClose}
          className="rounded-md bg-white px-4 py-2 text-[13px] font-medium text-black"
        >
          Start from scratch
        </button>
      </div>
    </div>
  );
}

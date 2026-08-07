"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PopupShellProps {
  title: string;
  onClose: () => void;
  className?: string;
  children: React.ReactNode;
  bodyClassName?: string;
}

export default function PopupShell({
  title,
  onClose,
  className,
  children,
  bodyClassName,
}: PopupShellProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl bg-white shadow-[0_30px_60px_rgba(0,0,0,0.5)]",
        className
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-2 border-b border-neutral-200 bg-neutral-50 px-4 py-3">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="group flex h-3 w-3 items-center justify-center rounded-full bg-[#ff5f57]"
        >
          <X size={8} className="text-[#4d0000] opacity-0 transition-opacity group-hover:opacity-100" />
        </button>
        <span className="ml-1.5 text-xs font-semibold text-neutral-700">{title}</span>
      </div>
      <div className={cn(bodyClassName)}>{children}</div>
    </div>
  );
}

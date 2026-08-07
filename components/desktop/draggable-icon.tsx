"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface DraggableIconProps {
  label: string;
  top: string;
  left: string;
  onOpen: () => void;
  glyphClassName?: string;
  image?: string;
  children?: React.ReactNode;
}

export default function DraggableIcon({
  label,
  top,
  left,
  onOpen,
  glyphClassName,
  image,
  children,
}: DraggableIconProps) {
  const didDrag = useRef(false);

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0}
      onDragStart={() => {
        didDrag.current = true;
      }}
      onPointerDown={() => {
        didDrag.current = false;
      }}
      onClick={() => {
        if (!didDrag.current) onOpen();
      }}
      className="absolute z-10 w-[92px] touch-none select-none"
      style={{ top, left }}
      whileDrag={{ scale: 1.05 }}
    >
      {image ? (
        <img
          src={image}
          alt={label}
          draggable={false}
          className="mx-auto mb-1.5 h-16 w-16 object-contain drop-shadow-[0_4px_14px_rgba(0,0,0,0.35)]"
        />
      ) : (
        <div
          className={cn(
            "mx-auto mb-1.5 flex h-16 w-16 items-center justify-center rounded-[10px] shadow-[0_4px_14px_rgba(0,0,0,0.25)]",
            glyphClassName
          )}
        >
          {children}
        </div>
      )}
      <div className="rounded px-1.5 py-0.5 text-center text-[11px] text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.6)]">
        {label}
      </div>
    </motion.div>
  );
}

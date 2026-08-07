"use client";

import { StickyNote, Gamepad2, Paintbrush, ImageIcon } from "lucide-react";
import DraggableIcon from "@/components/desktop/draggable-icon";
import { useDesktopStore } from "@/lib/desktop-store";
import { projects } from "@/data/projects";

const FILE_COLORS = [
  "bg-gradient-to-br from-[#5b8def] to-[#3157b0]",
  "bg-gradient-to-br from-[#e0a45c] to-[#a8703a]",
  "bg-gradient-to-br from-[#8fc4ff] to-[#4a7fc9]",
  "bg-gradient-to-br from-[#7fbf7f] to-[#4a8f4a]",
  "bg-gradient-to-br from-[#e0665c] to-[#a8382e]",
  "bg-gradient-to-br from-[#a97cf8] to-[#6f45c9]",
  "bg-gradient-to-br from-[#ff9ecf] to-[#c9418f]",
];

export default function ScatteredIcons() {
  const openPopup = useDesktopStore((s) => s.openPopup);

  return (
    <>
      {projects.map((p, i) => (
        <DraggableIcon
          key={p.slug}
          label={p.title}
          top={p.desktopPosition.top}
          left={p.desktopPosition.left}
          onOpen={() => openPopup(`project:${p.slug}`)}
          glyphClassName={FILE_COLORS[i % FILE_COLORS.length]}
        >
          <ImageIcon className="h-6 w-6 text-white" />
        </DraggableIcon>
      ))}

      <DraggableIcon
        label="Notes"
        top="60px"
        left="60px"
        onOpen={() => openPopup("notes")}
        image="/icons/notes.png"
        glyphClassName="bg-gradient-to-br from-[#fff3b0] to-[#ffd76e]"
      >
        <StickyNote className="h-7 w-7 text-[#8a6d1f]" />
      </DraggableIcon>

      <DraggableIcon
        label="Games"
        top="150px"
        left="60px"
        onOpen={() => openPopup("games")}
        image="/icons/games.png"
        glyphClassName="bg-gradient-to-br from-[#2b2b2b] to-black"
      >
        <Gamepad2 className="h-7 w-7 text-white" />
      </DraggableIcon>

      <DraggableIcon
        label="Canvas"
        top="240px"
        left="60px"
        onOpen={() => openPopup("canvasapp")}
        image="/icons/canvas.png"
        glyphClassName="bg-gradient-to-br from-[#ff8a5c] to-[#ff5c8a]"
      >
        <Paintbrush className="h-7 w-7 text-white" />
      </DraggableIcon>
    </>
  );
}

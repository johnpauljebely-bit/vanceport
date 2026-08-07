"use client";

import { useDesktopStore } from "@/lib/desktop-store";
import { projects } from "@/data/projects";
import CanvaPopup from "@/components/desktop/popups/canva-popup";
import PhotoshopPopup from "@/components/desktop/popups/photoshop-popup";
import FigmaPopup from "@/components/desktop/popups/figma-popup";
import ClaudePopup from "@/components/desktop/popups/claude-popup";
import PinterestPopup from "@/components/desktop/popups/pinterest-popup";
import NotesPopup from "@/components/desktop/popups/notes-popup";
import GamesPopup from "@/components/desktop/popups/games-popup";
import CanvasAppPopup from "@/components/desktop/popups/canvas-app-popup";
import CaseStudyPopup from "@/components/desktop/popups/case-study-popup";

export default function PopupManager() {
  const activePopup = useDesktopStore((s) => s.activePopup);
  const closePopup = useDesktopStore((s) => s.closePopup);

  if (!activePopup) return null;

  let content: React.ReactNode = null;

  if (activePopup.startsWith("project:")) {
    const slug = activePopup.slice("project:".length);
    const project = projects.find((p) => p.slug === slug);
    if (project) content = <CaseStudyPopup project={project} onClose={closePopup} />;
  } else {
    switch (activePopup) {
      case "canva":
        content = <CanvaPopup onClose={closePopup} />;
        break;
      case "photoshop":
        content = <PhotoshopPopup onClose={closePopup} />;
        break;
      case "figma":
        content = <FigmaPopup onClose={closePopup} />;
        break;
      case "claude":
        content = <ClaudePopup onClose={closePopup} />;
        break;
      case "pinterest":
        content = <PinterestPopup onClose={closePopup} />;
        break;
      case "notes":
        content = <NotesPopup onClose={closePopup} />;
        break;
      case "games":
        content = <GamesPopup onClose={closePopup} />;
        break;
      case "canvasapp":
        content = <CanvasAppPopup onClose={closePopup} />;
        break;
    }
  }

  if (!content) return null;

  return (
    <div
      className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/50"
      onClick={closePopup}
    >
      {content}
    </div>
  );
}

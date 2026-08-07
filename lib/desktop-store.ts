import { create } from "zustand";

export type PopupId =
  | "canva"
  | "photoshop"
  | "figma"
  | "claude"
  | "pinterest"
  | "notes"
  | "games"
  | "canvasapp"
  | `project:${string}`;

interface DesktopState {
  isOpen: boolean;
  activePopup: PopupId | null;
  canvaPanicked: boolean;
  openDesktop: () => void;
  closeDesktop: () => void;
  openPopup: (id: PopupId) => void;
  closePopup: () => void;
  triggerCanvaPanic: () => void;
}

export const useDesktopStore = create<DesktopState>((set) => ({
  isOpen: false,
  activePopup: null,
  canvaPanicked: false,
  openDesktop: () => set({ isOpen: true }),
  closeDesktop: () => set({ isOpen: false, activePopup: null }),
  openPopup: (id) =>
    set((state) => ({
      activePopup: id,
      canvaPanicked: id === "canva" ? false : state.canvaPanicked,
    })),
  closePopup: () => set({ activePopup: null, canvaPanicked: false }),
  triggerCanvaPanic: () => set({ canvaPanicked: true }),
}));

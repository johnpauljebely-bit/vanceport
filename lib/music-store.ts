import { create } from "zustand";

export interface Track {
  title: string;
  artist: string;
  src: string;
  cover: string;
  duration: number;
}

export const PLAYLIST: Track[] = [
  {
    title: "Billie Jean",
    artist: "Michael Jackson",
    src: "/music/michael-jackson-billie-jean.mp3",
    cover: "",
    duration: 294,
  },
  {
    title: "Monster",
    artist: "Kanye West (feat. Jay-Z, Nicki Minaj, Rick Ross, Bon Iver)",
    src: "/music/kanye-west-monster.mp3",
    cover: "",
    duration: 360,
  },
  {
    title: "Way Maker",
    artist: "Leeland",
    src: "/music/leeland-way-maker.mp3",
    cover: "",
    duration: 300,
  },
  {
    title: "Earrings",
    artist: "Malcolm Todd",
    src: "/music/malcolm-todd-earrings.mp3",
    cover: "",
    duration: 170,
  },
];

interface MusicState {
  currentIndex: number;
  isPlaying: boolean;
  currentTime: number;
  hasInteracted: boolean;
  setIsPlaying: (v: boolean) => void;
  setCurrentTime: (t: number) => void;
  next: () => void;
  prev: () => void;
  setIndex: (i: number) => void;
  markInteracted: () => void;
}

export const useMusicStore = create<MusicState>((set, get) => ({
  currentIndex: 0,
  isPlaying: true,
  currentTime: 0,
  hasInteracted: false,
  setIsPlaying: (v) => set({ isPlaying: v }),
  setCurrentTime: (t) => set({ currentTime: t }),
  next: () =>
    set({
      currentIndex: (get().currentIndex + 1) % PLAYLIST.length,
      currentTime: 0,
    }),
  prev: () =>
    set({
      currentIndex: (get().currentIndex - 1 + PLAYLIST.length) % PLAYLIST.length,
      currentTime: 0,
    }),
  setIndex: (i) => set({ currentIndex: i, currentTime: 0 }),
  markInteracted: () => set({ hasInteracted: true }),
}));

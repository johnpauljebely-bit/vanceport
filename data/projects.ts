export interface Project {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  coverImage: string;
  gallery: string[];
  video?: string;
  role: string;
  desktopPosition: { top: string; left: string };
  /** Renders gallery slides on a black backdrop (for transparent-background logo art). */
  galleryDark?: boolean;
  /** 0-based gallery indices to exempt from galleryDark (e.g. a slide with its own background already). */
  galleryLightIndices?: number[];
}

function range(n: number) {
  return Array.from({ length: n }, (_, i) => i + 1);
}

function gallery(slug: string, files: string[]) {
  return files.map((f) => `/work/${slug}/${f}`);
}

const uniformsFiles = range(16).map((n) => `${String(n).padStart(2, "0")}.png`);
const brandingFiles = [
  "01.jpg", "02.png", "03.png", "04.png", "05.png",
  "06.png", "07.png", "08.png", "09.jpg", "10.jpg", "11.jpg",
];
const embedBannersFiles = [
  "01.png", "02.png", "03.png", "04.png", "05.png",
  "06.png", "07.png", "08.png", "09.png", "10.png",
  "11.jpg", "12.jpg", "13.jpg", "14.jpg", "15.jpg",
];
const logosFiles = range(32).map((n) => `${String(n).padStart(2, "0")}.png`);
const postersFiles = ["01.png", "02.png", "03.png", "04.png", "05.jpg"];
const splashBannersFiles = ["01.png", "02.png", "03.png", "04.png"];

export const projects: Project[] = [
  {
    slug: "uniforms",
    title: "Uniforms",
    description:
      "Server uniforms and Roblox apparel — 2D clothing templates for staff ranks, ownership, and general crew, designed to read clearly at Roblox's catalog resolution.",
    tags: ["Apparel", "2D Clothing", "Roblox"],
    coverImage: gallery("uniforms", uniformsFiles)[13],
    gallery: gallery("uniforms", uniformsFiles),
    role: "Apparel Designer",
    desktopPosition: { top: "12%", left: "38%" },
  },
  {
    slug: "liveries",
    title: "Liveries",
    description:
      "In-game vehicle liveries for Roblox ERLC servers. A smaller showcase than the rest — here's a quick clip of one running in-game instead of a set of stills.",
    tags: ["ERLC", "Livery", "Roblox"],
    coverImage: "/work/liveries/poster.jpg",
    gallery: [],
    video: "/work/liveries/liveries-showcase.mp4",
    role: "Livery Designer",
    desktopPosition: { top: "10%", left: "60%" },
  },
  {
    slug: "branding",
    title: "Branding",
    description:
      "Full brand identities for Discord servers, ERLC servers, and companies — wordmarks, color systems, and identity marks built to hold up across a whole server, not just one banner.",
    tags: ["Branding", "Discord", "ERLC"],
    coverImage: gallery("branding", brandingFiles)[0],
    gallery: gallery("branding", brandingFiles),
    role: "Brand Designer",
    desktopPosition: { top: "32%", left: "78%" },
  },
  {
    slug: "embed-banners",
    title: "Embed Banners",
    description:
      "Discord embed banners — the wide graphics that show up when a server link or announcement gets shared, built to stay legible at Discord's compressed embed size.",
    tags: ["Discord", "Embeds", "Banners"],
    coverImage: gallery("embed-banners", embedBannersFiles)[2],
    gallery: gallery("embed-banners", embedBannersFiles),
    role: "Graphic Designer",
    desktopPosition: { top: "50%", left: "34%" },
  },
  {
    slug: "logos",
    title: "Logos",
    description:
      "Logos for ERLC servers, Discord servers, and companies — badge marks, wordmarks, and emblem-style logos across a wide range of styles and briefs.",
    tags: ["Logo Design", "Branding"],
    coverImage: gallery("logos", logosFiles)[8],
    gallery: gallery("logos", logosFiles),
    role: "Logo Designer",
    desktopPosition: { top: "48%", left: "60%" },
    galleryDark: true,
    galleryLightIndices: [logosFiles.length - 1],
  },
  {
    slug: "posters",
    title: "Posters",
    description: "Stuff made in free time, randomly — no brief, just posters made for fun.",
    tags: ["Posters", "Personal"],
    coverImage: gallery("posters", postersFiles)[0],
    gallery: gallery("posters", postersFiles),
    role: "Designer",
    desktopPosition: { top: "68%", left: "20%" },
  },
  {
    slug: "splash-banners",
    title: "Splash Banners",
    description:
      "Discord server invite splash banners — the first image people see on an invite link, designed to make a server worth clicking into.",
    tags: ["Discord", "Splash Banners"],
    coverImage: gallery("splash-banners", splashBannersFiles)[0],
    gallery: gallery("splash-banners", splashBannersFiles),
    role: "Graphic Designer",
    desktopPosition: { top: "70%", left: "70%" },
  },
];

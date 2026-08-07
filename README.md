Vance — portfolio site. Next.js (App Router) + TypeScript + Tailwind v4 + shadcn/ui (magicui + kokonutui registries).

## Run it

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Placeholders still to swap

- **Discord / socials / email** — search for `discord.com`, `instagram.com`, and `hello@vanceco.design` across `components/` and swap in the real links/address (footer, community section, command palette).
- **Fraunces** is used as a free approximation of Dia's serif — swap for the real licensed font in [app/layout.tsx](app/layout.tsx) if you get one.

## Projects

[data/projects.ts](data/projects.ts) is the single source of truth for the scattered desktop file icons, their case-study popups, and the Notes app entries — real work lives in `/public/work/<slug>/`. Edit the array and drop matching images into a new `/public/work/<slug>/` folder to add a category.

### Image assets

All in place:

- `/public/wallpaper/desktop-bg.jpg` — tennis motion-blur photo (hero preview frame + fullscreen desktop background).
- `/public/icons/canva.png`, `photoshop.png`, `figma.png`, `claude.png`, `pintrist.png` (dock icons, note the filename typo — matches what's on disk).
- `/public/icons/games.png`, `notes.png`, `canvas.png` (desktop icons).

These render at native aspect ratio via `object-contain` (no cropping), so square icons should be square PNGs and circular ones should be circular PNGs with transparent corners.

### Music

Real tracks in `/public/music/`, listed in the `PLAYLIST` array in [lib/music-store.ts](lib/music-store.ts). To add more, the files must go directly in `/public/music/` — anything outside `/public` isn't served by Next.js and won't be reachable by the `<audio>` element, so a top-level `/songs` folder won't work.

## Structure

- `app/` — routes: `/`, `/about`, `/order`, `/faq`.
- `components/sections/` — home page sections (hero, positioning, capabilities, community).
- `components/desktop/` — the fullscreen "Work" desktop overlay: menu bar, dock, scattered icons, popups.
- `components/desktop/popups/` — Canva, Photoshop, Figma, Claude, Pinterest, Notes, Games, Canvas app, and the project case-study popup.
- `components/games/` — Snake, Tetris, Flappy, Pong, Breakout.
- `components/canvas-app/` — the layered paint editor (tools, layers panel, history).
- `lib/desktop-store.ts` / `lib/music-store.ts` — zustand stores.

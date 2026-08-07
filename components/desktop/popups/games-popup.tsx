"use client";

import { useCallback, useState } from "react";
import PopupShell from "@/components/desktop/popup-shell";
import GameShell from "@/components/games/game-shell";
import SnakeGame from "@/components/games/snake-game";
import TetrisGame from "@/components/games/tetris-game";
import FlappyGame from "@/components/games/flappy-game";
import PongGame from "@/components/games/pong-game";
import BreakoutGame from "@/components/games/breakout-game";
import { cn } from "@/lib/utils";

const GAMES = [
  { id: "snake", label: "Snake", hint: "Arrow keys to move", Component: SnakeGame },
  { id: "tetris", label: "Tetris", hint: "Arrows to move/rotate, Space to drop", Component: TetrisGame },
  { id: "flappy", label: "Flappy", hint: "Space / tap to flap", Component: FlappyGame },
  { id: "pong", label: "Pong", hint: "↑ / ↓ to move your paddle", Component: PongGame },
  { id: "breakout", label: "Breakout", hint: "← / → to move the paddle", Component: BreakoutGame },
] as const;

export default function GamesPopup({ onClose }: { onClose: () => void }) {
  const [activeId, setActiveId] = useState<(typeof GAMES)[number]["id"]>("snake");
  const [score, setScore] = useState(0);

  const active = GAMES.find((g) => g.id === activeId)!;

  const handleScore = useCallback((n: number) => setScore(n), []);

  return (
    <PopupShell title="Games" onClose={onClose} className="w-[360px]" bodyClassName="p-4">
      <div className="mb-3.5 flex flex-wrap gap-1.5">
        {GAMES.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => {
              setActiveId(g.id);
              setScore(0);
            }}
            className={cn(
              "rounded-md px-2.5 py-1.5 text-[11px] font-medium transition-colors",
              activeId === g.id
                ? "bg-neutral-900 text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            )}
          >
            {g.label}
          </button>
        ))}
      </div>

      <GameShell score={score} hint={active.hint}>
        <active.Component key={activeId} onScore={handleScore} />
      </GameShell>
    </PopupShell>
  );
}

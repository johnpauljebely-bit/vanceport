"use client";

import { useEffect, useRef } from "react";

const SIZE = 300;
const CELL = 15;
const GRID = SIZE / CELL;

type Point = { x: number; y: number };

export default function SnakeGame({ onScore }: { onScore: (n: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    snake: [{ x: 10, y: 10 }] as Point[],
    dir: { x: 1, y: 0 },
    nextDir: { x: 1, y: 0 },
    food: { x: 5, y: 5 },
    score: 0,
    gameOver: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    function randomFood(snake: Point[]): Point {
      let p: Point;
      do {
        p = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
      } while (snake.some((s) => s.x === p.x && s.y === p.y));
      return p;
    }

    function reset() {
      stateRef.current = {
        snake: [{ x: 10, y: 10 }],
        dir: { x: 1, y: 0 },
        nextDir: { x: 1, y: 0 },
        food: randomFood([{ x: 10, y: 10 }]),
        score: 0,
        gameOver: false,
      };
      onScore(0);
    }
    reset();

    function onKeyDown(e: KeyboardEvent) {
      const s = stateRef.current;
      if (s.gameOver && e.key === "Enter") {
        reset();
        return;
      }
      const map: Record<string, Point> = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
      };
      const next = map[e.key];
      if (!next) return;
      e.preventDefault();
      if (next.x === -s.dir.x && next.y === -s.dir.y) return;
      s.nextDir = next;
    }
    window.addEventListener("keydown", onKeyDown);

    function draw() {
      const s = stateRef.current;
      ctx.fillStyle = "#0c0c0e";
      ctx.fillRect(0, 0, SIZE, SIZE);

      ctx.fillStyle = "#ff5f57";
      ctx.fillRect(s.food.x * CELL + 1, s.food.y * CELL + 1, CELL - 2, CELL - 2);

      s.snake.forEach((seg, i) => {
        ctx.fillStyle = i === 0 ? "#7dffb0" : "#3ecf8e";
        ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2);
      });

      if (s.gameOver) {
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(0, 0, SIZE, SIZE);
        ctx.fillStyle = "#fff";
        ctx.font = "14px monospace";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", SIZE / 2, SIZE / 2 - 8);
        ctx.font = "10px monospace";
        ctx.fillText("Press Enter to restart", SIZE / 2, SIZE / 2 + 12);
      }
    }

    function tick() {
      const s = stateRef.current;
      if (s.gameOver) return;
      s.dir = s.nextDir;
      const head = s.snake[0];
      const newHead = { x: head.x + s.dir.x, y: head.y + s.dir.y };

      if (
        newHead.x < 0 ||
        newHead.x >= GRID ||
        newHead.y < 0 ||
        newHead.y >= GRID ||
        s.snake.some((seg) => seg.x === newHead.x && seg.y === newHead.y)
      ) {
        s.gameOver = true;
        return;
      }

      s.snake.unshift(newHead);
      if (newHead.x === s.food.x && newHead.y === s.food.y) {
        s.score += 10;
        onScore(s.score);
        s.food = randomFood(s.snake);
      } else {
        s.snake.pop();
      }
    }

    const tickId = setInterval(tick, 110);
    const drawId = setInterval(draw, 1000 / 30);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      clearInterval(tickId);
      clearInterval(drawId);
    };
  }, [onScore]);

  return <canvas ref={canvasRef} width={SIZE} height={SIZE} className="block" />;
}

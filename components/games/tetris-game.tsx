"use client";

import { useEffect, useRef } from "react";

const COLS = 10;
const ROWS = 20;
const CELL = 14;
const CANVAS_W = 300;
const CANVAS_H = 300;
const OFFSET_X = (CANVAS_W - COLS * CELL) / 2;
const OFFSET_Y = (CANVAS_H - ROWS * CELL) / 2;

type Cell = [number, number];

const PIECES: { shape: Cell[]; color: string }[] = [
  { shape: [[0, 1], [1, 1], [2, 1], [3, 1]], color: "#4fd8ff" }, // I
  { shape: [[1, 0], [2, 0], [1, 1], [2, 1]], color: "#ffd400" }, // O
  { shape: [[1, 0], [0, 1], [1, 1], [2, 1]], color: "#a259ff" }, // T
  { shape: [[1, 1], [2, 1], [0, 2], [1, 2]], color: "#3ecf8e" }, // S
  { shape: [[0, 1], [1, 1], [1, 2], [2, 2]], color: "#ff5f57" }, // Z
  { shape: [[0, 1], [0, 2], [1, 2], [2, 2]], color: "#5b8def" }, // J
  { shape: [[2, 1], [0, 2], [1, 2], [2, 2]], color: "#ff9a56" }, // L
];

function rotate(shape: Cell[]): Cell[] {
  // rotate within a 4x4 bounding box, clockwise
  return shape.map(([x, y]) => [3 - y, x] as Cell);
}

function randomPiece() {
  const p = PIECES[Math.floor(Math.random() * PIECES.length)];
  return { shape: p.shape.map((c) => [...c] as Cell), color: p.color, x: 3, y: -1 };
}

export default function TetrisGame({ onScore }: { onScore: (n: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    board: Array.from({ length: ROWS }, () => Array<string | null>(COLS).fill(null)),
    current: randomPiece(),
    score: 0,
    gameOver: false,
    dropCounter: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    function reset() {
      stateRef.current = {
        board: Array.from({ length: ROWS }, () => Array<string | null>(COLS).fill(null)),
        current: randomPiece(),
        score: 0,
        gameOver: false,
        dropCounter: 0,
      };
      onScore(0);
    }
    reset();

    function collides(shape: Cell[], px: number, py: number, board: (string | null)[][]) {
      return shape.some(([x, y]) => {
        const bx = px + x;
        const by = py + y;
        if (bx < 0 || bx >= COLS || by >= ROWS) return true;
        if (by < 0) return false;
        return !!board[by][bx];
      });
    }

    function lockPiece() {
      const s = stateRef.current;
      const { shape, x, y, color } = s.current;
      shape.forEach(([sx, sy]) => {
        const by = y + sy;
        const bx = x + sx;
        if (by >= 0) s.board[by][bx] = color;
      });

      let cleared = 0;
      for (let r = ROWS - 1; r >= 0; r--) {
        if (s.board[r].every((cell) => cell)) {
          s.board.splice(r, 1);
          s.board.unshift(Array<string | null>(COLS).fill(null));
          cleared++;
          r++;
        }
      }
      if (cleared > 0) {
        s.score += [0, 100, 300, 500, 800][cleared] ?? cleared * 200;
        onScore(s.score);
      }

      s.current = randomPiece();
      if (collides(s.current.shape, s.current.x, s.current.y, s.board)) {
        s.gameOver = true;
      }
    }

    function onKeyDown(e: KeyboardEvent) {
      const s = stateRef.current;
      if (s.gameOver) {
        if (e.key === "Enter") reset();
        return;
      }
      if (["ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp", " "].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === "ArrowLeft" && !collides(s.current.shape, s.current.x - 1, s.current.y, s.board)) {
        s.current.x -= 1;
      } else if (
        e.key === "ArrowRight" &&
        !collides(s.current.shape, s.current.x + 1, s.current.y, s.board)
      ) {
        s.current.x += 1;
      } else if (e.key === "ArrowDown") {
        if (!collides(s.current.shape, s.current.x, s.current.y + 1, s.board)) {
          s.current.y += 1;
        } else {
          lockPiece();
        }
      } else if (e.key === "ArrowUp") {
        const rotated = rotate(s.current.shape);
        if (!collides(rotated, s.current.x, s.current.y, s.board)) {
          s.current.shape = rotated;
        }
      } else if (e.key === " ") {
        while (!collides(s.current.shape, s.current.x, s.current.y + 1, s.board)) {
          s.current.y += 1;
        }
        lockPiece();
      }
    }
    window.addEventListener("keydown", onKeyDown);

    function draw() {
      const s = stateRef.current;
      ctx.fillStyle = "#0c0c0e";
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.strokeRect(OFFSET_X, OFFSET_Y, COLS * CELL, ROWS * CELL);

      s.board.forEach((row, ry) =>
        row.forEach((color, rx) => {
          if (color) {
            ctx.fillStyle = color;
            ctx.fillRect(OFFSET_X + rx * CELL + 1, OFFSET_Y + ry * CELL + 1, CELL - 2, CELL - 2);
          }
        })
      );

      ctx.fillStyle = s.current.color;
      s.current.shape.forEach(([x, y]) => {
        const by = s.current.y + y;
        if (by < 0) return;
        ctx.fillRect(
          OFFSET_X + (s.current.x + x) * CELL + 1,
          OFFSET_Y + by * CELL + 1,
          CELL - 2,
          CELL - 2
        );
      });

      if (s.gameOver) {
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        ctx.fillStyle = "#fff";
        ctx.font = "14px monospace";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", CANVAS_W / 2, CANVAS_H / 2 - 8);
        ctx.font = "10px monospace";
        ctx.fillText("Press Enter to restart", CANVAS_W / 2, CANVAS_H / 2 + 12);
      }
    }

    function tick() {
      const s = stateRef.current;
      if (s.gameOver) return;
      if (!collides(s.current.shape, s.current.x, s.current.y + 1, s.board)) {
        s.current.y += 1;
      } else {
        lockPiece();
      }
    }

    const tickId = setInterval(tick, 550);
    const drawId = setInterval(draw, 1000 / 30);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      clearInterval(tickId);
      clearInterval(drawId);
    };
  }, [onScore]);

  return <canvas ref={canvasRef} width={CANVAS_W} height={CANVAS_H} className="block" />;
}

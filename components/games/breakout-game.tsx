"use client";

import { useEffect, useRef } from "react";

const W = 300;
const H = 300;
const PADDLE_W = 56;
const PADDLE_H = 8;
const BALL_R = 4;
const ROWS = 4;
const COLS = 8;
const BRICK_W = W / COLS;
const BRICK_H = 12;
const BRICK_TOP = 30;
const COLORS = ["#ff5f57", "#febc2e", "#3ecf8e", "#5b8def"];

export default function BreakoutGame({ onScore }: { onScore: (n: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    paddleX: W / 2 - PADDLE_W / 2,
    keys: { left: false, right: false },
    ball: { x: W / 2, y: H - 40, vx: 2.4, vy: -2.8 },
    bricks: [] as { x: number; y: number; alive: boolean; color: string }[],
    score: 0,
    gameOver: false,
    win: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    function buildBricks() {
      const bricks: { x: number; y: number; alive: boolean; color: string }[] = [];
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          bricks.push({ x: c * BRICK_W, y: BRICK_TOP + r * BRICK_H, alive: true, color: COLORS[r % COLORS.length] });
        }
      }
      return bricks;
    }

    function reset() {
      stateRef.current = {
        paddleX: W / 2 - PADDLE_W / 2,
        keys: { left: false, right: false },
        ball: { x: W / 2, y: H - 40, vx: 2.4, vy: -2.8 },
        bricks: buildBricks(),
        score: 0,
        gameOver: false,
        win: false,
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
      if (e.key === "ArrowLeft") {
        s.keys.left = true;
        e.preventDefault();
      }
      if (e.key === "ArrowRight") {
        s.keys.right = true;
        e.preventDefault();
      }
    }
    function onKeyUp(e: KeyboardEvent) {
      const s = stateRef.current;
      if (e.key === "ArrowLeft") s.keys.left = false;
      if (e.key === "ArrowRight") s.keys.right = false;
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    function update() {
      const s = stateRef.current;
      if (s.gameOver) return;

      if (s.keys.left) s.paddleX -= 4.2;
      if (s.keys.right) s.paddleX += 4.2;
      s.paddleX = Math.max(0, Math.min(W - PADDLE_W, s.paddleX));

      s.ball.x += s.ball.vx;
      s.ball.y += s.ball.vy;

      if (s.ball.x <= BALL_R || s.ball.x >= W - BALL_R) s.ball.vx *= -1;
      if (s.ball.y <= BALL_R) s.ball.vy *= -1;

      const paddleY = H - 16;
      if (
        s.ball.y >= paddleY - BALL_R &&
        s.ball.y <= paddleY + PADDLE_H &&
        s.ball.x >= s.paddleX &&
        s.ball.x <= s.paddleX + PADDLE_W &&
        s.ball.vy > 0
      ) {
        s.ball.vy *= -1;
        s.ball.vx += (s.ball.x - (s.paddleX + PADDLE_W / 2)) * 0.04;
      }

      if (s.ball.y > H + 10) {
        s.gameOver = true;
        return;
      }

      for (const brick of s.bricks) {
        if (!brick.alive) continue;
        if (
          s.ball.x >= brick.x &&
          s.ball.x <= brick.x + BRICK_W &&
          s.ball.y >= brick.y &&
          s.ball.y <= brick.y + BRICK_H
        ) {
          brick.alive = false;
          s.ball.vy *= -1;
          s.score += 10;
          onScore(s.score);
          break;
        }
      }

      if (s.bricks.every((b) => !b.alive)) {
        s.win = true;
        s.gameOver = true;
      }
    }

    function draw() {
      const s = stateRef.current;
      ctx.fillStyle = "#0c0c0e";
      ctx.fillRect(0, 0, W, H);

      s.bricks.forEach((b) => {
        if (!b.alive) return;
        ctx.fillStyle = b.color;
        ctx.fillRect(b.x + 1, b.y + 1, BRICK_W - 2, BRICK_H - 2);
      });

      ctx.fillStyle = "#7dffb0";
      ctx.fillRect(s.paddleX, H - 16, PADDLE_W, PADDLE_H);

      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(s.ball.x, s.ball.y, BALL_R, 0, Math.PI * 2);
      ctx.fill();

      if (s.gameOver) {
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#fff";
        ctx.font = "14px monospace";
        ctx.textAlign = "center";
        ctx.fillText(s.win ? "YOU CLEARED IT" : "GAME OVER", W / 2, H / 2 - 8);
        ctx.font = "10px monospace";
        ctx.fillText("Press Enter to restart", W / 2, H / 2 + 12);
      }
    }

    const id = setInterval(() => {
      update();
      draw();
    }, 1000 / 60);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      clearInterval(id);
    };
  }, [onScore]);

  return <canvas ref={canvasRef} width={W} height={H} className="block" />;
}

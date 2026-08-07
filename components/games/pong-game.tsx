"use client";

import { useEffect, useRef } from "react";

const W = 300;
const H = 220;
const PADDLE_H = 46;
const PADDLE_W = 8;

export default function PongGame({ onScore }: { onScore: (n: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    playerY: H / 2 - PADDLE_H / 2,
    aiY: H / 2 - PADDLE_H / 2,
    ball: { x: W / 2, y: H / 2, vx: 2.6, vy: 1.6 },
    keys: { up: false, down: false },
    playerScore: 0,
    aiScore: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    onScore(0);

    function onKeyDown(e: KeyboardEvent) {
      const s = stateRef.current;
      if (e.key === "ArrowUp" || e.key === "w") {
        s.keys.up = true;
        e.preventDefault();
      }
      if (e.key === "ArrowDown" || e.key === "s") {
        s.keys.down = true;
        e.preventDefault();
      }
    }
    function onKeyUp(e: KeyboardEvent) {
      const s = stateRef.current;
      if (e.key === "ArrowUp" || e.key === "w") s.keys.up = false;
      if (e.key === "ArrowDown" || e.key === "s") s.keys.down = false;
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    function resetBall(dir: number) {
      const s = stateRef.current;
      s.ball = { x: W / 2, y: H / 2, vx: 2.6 * dir, vy: (Math.random() - 0.5) * 3 };
    }

    function update() {
      const s = stateRef.current;
      if (s.keys.up) s.playerY -= 4;
      if (s.keys.down) s.playerY += 4;
      s.playerY = Math.max(0, Math.min(H - PADDLE_H, s.playerY));

      const aiCenter = s.aiY + PADDLE_H / 2;
      if (aiCenter < s.ball.y - 8) s.aiY += 2.6;
      else if (aiCenter > s.ball.y + 8) s.aiY -= 2.6;
      s.aiY = Math.max(0, Math.min(H - PADDLE_H, s.aiY));

      s.ball.x += s.ball.vx;
      s.ball.y += s.ball.vy;

      if (s.ball.y <= 4 || s.ball.y >= H - 4) s.ball.vy *= -1;

      if (s.ball.x <= PADDLE_W + 4 && s.ball.y > s.playerY && s.ball.y < s.playerY + PADDLE_H) {
        s.ball.vx = Math.abs(s.ball.vx) * 1.03;
        s.ball.vy += (s.ball.y - (s.playerY + PADDLE_H / 2)) * 0.05;
      }
      if (
        s.ball.x >= W - PADDLE_W - 4 &&
        s.ball.y > s.aiY &&
        s.ball.y < s.aiY + PADDLE_H
      ) {
        s.ball.vx = -Math.abs(s.ball.vx) * 1.03;
      }

      if (s.ball.x < 0) {
        s.aiScore += 1;
        resetBall(1);
      } else if (s.ball.x > W) {
        s.playerScore += 1;
        onScore(s.playerScore);
        resetBall(-1);
      }
    }

    function draw() {
      const s = stateRef.current;
      ctx.fillStyle = "#0c0c0e";
      ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.moveTo(W / 2, 0);
      ctx.lineTo(W / 2, H);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "#7dffb0";
      ctx.fillRect(4, s.playerY, PADDLE_W, PADDLE_H);
      ctx.fillStyle = "#ff9a56";
      ctx.fillRect(W - PADDLE_W - 4, s.aiY, PADDLE_W, PADDLE_H);

      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(s.ball.x, s.ball.y, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = "16px monospace";
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.textAlign = "center";
      ctx.fillText(`${s.playerScore}`, W / 2 - 30, 24);
      ctx.fillText(`${s.aiScore}`, W / 2 + 30, 24);
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

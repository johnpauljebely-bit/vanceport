"use client";

import { useEffect, useRef } from "react";

const W = 280;
const H = 360;
const BIRD_X = 70;
const BIRD_R = 10;
const GRAVITY = 0.45;
const FLAP_VELOCITY = -7.2;
const PIPE_W = 46;
const PIPE_GAP = 118;
const PIPE_SPEED = 2.4;
const PIPE_INTERVAL = 105; // frames between spawns

interface Pipe {
  x: number;
  gapY: number;
  passed: boolean;
}

export default function FlappyGame({ onScore }: { onScore: (n: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    birdY: H / 2,
    velocity: 0,
    pipes: [] as Pipe[],
    frame: 0,
    score: 0,
    gameOver: false,
    started: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    function reset() {
      stateRef.current = {
        birdY: H / 2,
        velocity: 0,
        pipes: [],
        frame: 0,
        score: 0,
        gameOver: false,
        started: false,
      };
      onScore(0);
    }
    reset();

    function flap() {
      const s = stateRef.current;
      if (s.gameOver) {
        reset();
        return;
      }
      s.started = true;
      s.velocity = FLAP_VELOCITY;
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === " " || e.key === "ArrowUp" || e.key === "Enter") {
        e.preventDefault();
        flap();
      }
    }
    function onPointerDown() {
      flap();
    }
    window.addEventListener("keydown", onKeyDown);
    canvas.addEventListener("pointerdown", onPointerDown);

    function update() {
      const s = stateRef.current;
      if (!s.started || s.gameOver) return;

      s.velocity += GRAVITY;
      s.birdY += s.velocity;

      if (s.birdY - BIRD_R < 0) {
        s.birdY = BIRD_R;
        s.velocity = 0;
      }
      if (s.birdY + BIRD_R > H) {
        s.gameOver = true;
        return;
      }

      s.frame++;
      if (s.frame % PIPE_INTERVAL === 0) {
        const gapY = 60 + Math.random() * (H - 120 - PIPE_GAP);
        s.pipes.push({ x: W, gapY, passed: false });
      }

      s.pipes.forEach((p) => {
        p.x -= PIPE_SPEED;

        if (
          !p.passed &&
          p.x + PIPE_W < BIRD_X - BIRD_R
        ) {
          p.passed = true;
          s.score += 1;
          onScore(s.score);
        }

        const birdInPipeX = BIRD_X + BIRD_R > p.x && BIRD_X - BIRD_R < p.x + PIPE_W;
        const birdInGap = s.birdY - BIRD_R > p.gapY && s.birdY + BIRD_R < p.gapY + PIPE_GAP;
        if (birdInPipeX && !birdInGap) {
          s.gameOver = true;
        }
      });

      s.pipes = s.pipes.filter((p) => p.x + PIPE_W > -10);
    }

    function draw() {
      const s = stateRef.current;

      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, "#0c0c0e");
      grad.addColorStop(1, "#16181c");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = "#3ecf8e";
      s.pipes.forEach((p) => {
        ctx.fillRect(p.x, 0, PIPE_W, p.gapY);
        ctx.fillRect(p.x, p.gapY + PIPE_GAP, PIPE_W, H - (p.gapY + PIPE_GAP));
        ctx.fillStyle = "#7dffb0";
        ctx.fillRect(p.x - 3, p.gapY - 10, PIPE_W + 6, 10);
        ctx.fillRect(p.x - 3, p.gapY + PIPE_GAP, PIPE_W + 6, 10);
        ctx.fillStyle = "#3ecf8e";
      });

      ctx.save();
      ctx.translate(BIRD_X, s.birdY);
      ctx.rotate(Math.max(-0.5, Math.min(0.9, s.velocity * 0.08)));
      ctx.fillStyle = "#ffd400";
      ctx.beginPath();
      ctx.arc(0, 0, BIRD_R, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#16181c";
      ctx.beginPath();
      ctx.arc(4, -3, 1.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      if (!s.started) {
        ctx.fillStyle = "rgba(255,255,255,0.85)";
        ctx.font = "11px monospace";
        ctx.textAlign = "center";
        ctx.fillText("Space / tap to flap", W / 2, H / 2 + 40);
      }

      if (s.gameOver) {
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#fff";
        ctx.font = "14px monospace";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", W / 2, H / 2 - 8);
        ctx.font = "10px monospace";
        ctx.fillText("Press Space to restart", W / 2, H / 2 + 12);
      }
    }

    const id = setInterval(() => {
      update();
      draw();
    }, 1000 / 60);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      canvas.removeEventListener("pointerdown", onPointerDown);
      clearInterval(id);
    };
  }, [onScore]);

  return <canvas ref={canvasRef} width={W} height={H} className="block" />;
}

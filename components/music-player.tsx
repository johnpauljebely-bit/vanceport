"use client";

import { useEffect, useRef, useState } from "react";
import { SkipBack, SkipForward, Play, Pause } from "lucide-react";
import { PLAYLIST, useMusicStore } from "@/lib/music-store";
import { cn } from "@/lib/utils";

function formatTime(t: number) {
  if (!Number.isFinite(t) || t < 0) return "0:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const seekRef = useRef<HTMLDivElement>(null);
  const currentIndex = useMusicStore((s) => s.currentIndex);
  const isPlaying = useMusicStore((s) => s.isPlaying);
  const currentTime = useMusicStore((s) => s.currentTime);
  const setIsPlaying = useMusicStore((s) => s.setIsPlaying);
  const setCurrentTime = useMusicStore((s) => s.setCurrentTime);
  const next = useMusicStore((s) => s.next);
  const prev = useMusicStore((s) => s.prev);
  const track = PLAYLIST[currentIndex];
  const [duration, setDuration] = useState(track.duration);
  const [dragging, setDragging] = useState(false);

  // load new track source when index changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = track.src;
    audio.load();
    if (isPlaying) {
      audio.play().catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  // sync play/pause state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // try to autoplay immediately; browsers that block it will reject silently,
  // so retry on the first real user gesture anywhere on the page
  useEffect(() => {
    audioRef.current?.play().catch(() => {});

    let started = false;
    function startOnce() {
      if (started) return;
      started = true;
      setIsPlaying(true);
      audioRef.current?.play().catch(() => {});
      window.removeEventListener("pointerdown", startOnce);
      window.removeEventListener("wheel", startOnce);
      window.removeEventListener("keydown", startOnce);
    }
    window.addEventListener("pointerdown", startOnce, { once: true });
    window.addEventListener("wheel", startOnce, { once: true });
    window.addEventListener("keydown", startOnce, { once: true });
    return () => {
      window.removeEventListener("pointerdown", startOnce);
      window.removeEventListener("wheel", startOnce);
      window.removeEventListener("keydown", startOnce);
    };
  }, [setIsPlaying]);

  function handleTimeUpdate() {
    if (!dragging && audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  }

  function handleLoadedMetadata() {
    if (audioRef.current && Number.isFinite(audioRef.current.duration)) {
      setDuration(audioRef.current.duration);
    }
  }

  function seekTo(clientX: number) {
    const rect = seekRef.current?.getBoundingClientRect();
    if (!rect || !audioRef.current) return;
    const fraction = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const time = fraction * duration;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  }

  const progress = duration ? Math.min(1, currentTime / duration) : 0;

  return (
    <div className="fixed bottom-5 right-5 z-[900] w-[230px] rounded-3xl bg-[#151316] p-3.5 text-white shadow-2xl dark:bg-white dark:text-black">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={next}
        preload="metadata"
      />
      <div className="flex items-start gap-3">
        <div className="h-14 w-14 shrink-0 rounded-xl bg-gradient-to-br from-neutral-500 to-neutral-800" />
        <div className="min-w-0">
          <div className="mb-1 text-[10px] font-bold tracking-[0.08em] text-white/90 dark:text-black/70">
            NOW PLAYING
          </div>
          <div className="truncate text-sm font-semibold">{track.title}</div>
          <div className="truncate text-xs text-neutral-400 dark:text-neutral-500">{track.artist}</div>
        </div>
      </div>

      <div
        ref={seekRef}
        className="relative my-3 h-[3px] cursor-pointer rounded bg-neutral-700 dark:bg-neutral-200"
        onPointerDown={(e) => {
          setDragging(true);
          seekTo(e.clientX);
        }}
        onPointerMove={(e) => {
          if (dragging) seekTo(e.clientX);
        }}
        onPointerUp={() => setDragging(false)}
        onPointerLeave={() => dragging && setDragging(false)}
      >
        <div
          className="absolute left-0 top-0 h-full rounded bg-white dark:bg-black"
          style={{ width: `${progress * 100}%` }}
        />
        <div
          className="absolute h-2.5 w-2.5 rounded-full bg-white shadow dark:bg-black"
          style={{ left: `${progress * 100}%`, top: "50%", transform: "translate(-50%,-50%)" }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-neutral-400 dark:text-neutral-500">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      <div className="mt-3 flex items-center justify-center gap-6">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous track"
          className="text-white/80 transition-colors hover:text-white dark:text-black/70 dark:hover:text-black"
        >
          <SkipBack size={16} />
        </button>
        <button
          type="button"
          onClick={() => setIsPlaying(!isPlaying)}
          aria-label={isPlaying ? "Pause" : "Play"}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full text-white transition-colors dark:text-black",
            isPlaying && "bg-white/15 dark:bg-black/10"
          )}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="Next track"
          className="text-white/80 transition-colors hover:text-white dark:text-black/70 dark:hover:text-black"
        >
          <SkipForward size={16} />
        </button>
      </div>
    </div>
  );
}

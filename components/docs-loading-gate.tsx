"use client";

import { useEffect, useState, type ReactNode } from "react";

const LOADER_MS = 3000;
const TRANSITION_MS = 600;

/** Blank splash for the first 3s on this page, fading out while the real content blurs into focus. */
export default function DocsLoadingGate({ children }: { children: ReactNode }) {
  const [revealing, setRevealing] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    const revealTimer = window.setTimeout(() => setRevealing(true), LOADER_MS);
    const removeTimer = window.setTimeout(() => setShowOverlay(false), LOADER_MS + TRANSITION_MS);
    return () => {
      window.clearTimeout(revealTimer);
      window.clearTimeout(removeTimer);
    };
  }, []);

  return (
    <>
      <div
        style={{
          filter: revealing ? "blur(0px)" : "blur(24px)",
          transition: `filter ${TRANSITION_MS}ms ease-out`,
        }}
      >
        {children}
      </div>

      {showOverlay && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-body-bg"
          style={{
            opacity: revealing ? 0 : 1,
            transition: `opacity ${TRANSITION_MS}ms ease-out`,
            pointerEvents: revealing ? "none" : "auto",
          }}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="font-mono text-xs font-semibold tracking-[0.14em] text-body-muted">
              DOCS
            </div>
            <div className="h-[2px] w-40 overflow-hidden rounded-full bg-body-fg/10">
              <div
                className="h-full bg-body-fg"
                style={{
                  animation: `docs-loading-bar ${LOADER_MS}ms ease-in-out forwards`,
                }}
              />
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes docs-loading-bar {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </>
  );
}

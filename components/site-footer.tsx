"use client";

import { useState } from "react";
import Link from "next/link";
import SocialButton from "@/components/kokonutui/social-button";
import FooterGradientSvg from "@/components/footer-gradient-svg";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { useDesktopStore } from "@/lib/desktop-store";

export default function SiteFooter() {
  const [copied, setCopied] = useState(false);
  const openDesktop = useDesktopStore((s) => s.openDesktop);

  return (
    <footer className="body-surface relative flex min-h-[60vh] flex-col justify-start overflow-hidden pt-24">
      <div className="relative z-10 mx-auto flex flex-col items-center px-6 text-center">
        <div className="mb-5">
          <SocialButton
            label="Share"
            className="!h-auto !min-w-0 gap-1.5 !px-3.5 !py-1.5 !text-[11px] [&_svg]:h-3 [&_svg]:w-3"
            onShare={(_, item) => {
              const url = window.location.href;
              if (item.label === "Copy link") {
                navigator.clipboard?.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              } else if (item.label === "Share on Twitter") {
                window.open(
                  `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent("Design work by Vance")}`,
                  "_blank"
                );
              } else if (item.label === "Share on LinkedIn") {
                window.open(
                  `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
                  "_blank"
                );
              } else if (item.label === "Share on Instagram") {
                window.open("https://instagram.com", "_blank");
              }
            }}
          />
        </div>

        <h2 className="font-serif text-[clamp(28px,4vw,46px)] font-semibold tracking-[-0.01em]">
          Ready to start a project?
        </h2>
        <div
          className="mt-5"
          style={
            {
              "--background": "var(--text-body)",
              "--foreground": "var(--body-bg)",
              "--primary": "var(--body-bg)",
              "--primary-foreground": "var(--text-body)",
            } as React.CSSProperties
          }
        >
          <InteractiveHoverButton className="border-0 px-7 py-3 text-sm">
            Get in touch
          </InteractiveHoverButton>
        </div>

        <div className="mt-10 pb-2 font-mono text-xs text-body-fg">
          {copied ? "Link copied" : "Currently taking on select commissions"}
        </div>

        <div className="mt-20 grid w-full max-w-[1100px] grid-cols-2 gap-5 border-t border-[#e5e2da] pt-10 text-left text-xs dark:border-white/10 sm:grid-cols-5">
          <div>
            <h5 className="mb-2.5 font-mono text-[10px] tracking-[0.08em] text-body-fg">SITE</h5>
            <Link href="/" className="block py-1 text-body-fg">Home</Link>
            <button className="block py-1 text-left text-body-fg" onClick={openDesktop}>
              Work
            </button>
          </div>
          <div>
            <h5 className="mb-2.5 font-mono text-[10px] tracking-[0.08em] text-body-fg">INFO</h5>
            <Link href="/about" className="block py-1 text-body-fg">About</Link>
            <Link href="/order" className="block py-1 text-body-fg">Order</Link>
          </div>
          <div>
            <h5 className="mb-2.5 font-mono text-[10px] tracking-[0.08em] text-body-fg">SUPPORT</h5>
            <Link href="/faq" className="block py-1 text-body-fg">FAQ</Link>
          </div>
          <div>
            <h5 className="mb-2.5 font-mono text-[10px] tracking-[0.08em] text-body-fg">CONNECT</h5>
            <a href="https://discord.com" target="_blank" rel="noreferrer" className="block py-1 text-body-fg">Discord</a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="block py-1 text-body-fg">Instagram</a>
          </div>
          <div className="font-mono text-[10px] text-body-fg">VANCE</div>
        </div>

        <div className="mt-6 flex w-full max-w-[1100px] justify-between pb-6 font-mono text-[11px] text-body-fg">
          <span>designed &amp; built by Vance</span>
          <span>© 2026</span>
        </div>
      </div>

      <div className="relative mt-auto h-[230px] overflow-hidden">
        <div className="absolute bottom-0 left-0 h-[230px] w-full pointer-events-none">
          <FooterGradientSvg />
        </div>
      </div>
    </footer>
  );
}

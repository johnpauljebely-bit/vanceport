"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import PopupShell from "@/components/desktop/popup-shell";
import { SiAnthropic } from "react-icons/si";

interface Message {
  role: "user" | "bot";
  text: string;
}

const LIMIT_REPLY =
  "You've reached your usage limit. Upgrade to Pro or wait for your limit to reset.";

export default function ClaudePopup({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [value, setValue] = useState("");

  function send() {
    const text = value.trim();
    if (!text) return;
    setMessages((m) => [...m, { role: "user", text }, { role: "bot", text: LIMIT_REPLY }]);
    setValue("");
  }

  return (
    <PopupShell
      title="Claude"
      onClose={onClose}
      className="w-[460px]"
      bodyClassName="flex min-h-[280px] flex-col bg-[#faf9f5] p-5.5"
    >
      <div className="mb-4 flex items-center gap-2 font-serif text-xl font-semibold text-[#3d3929]">
        <SiAnthropic className="h-5 w-5 text-[#d97757]" />
        Welcome back, Vance
      </div>
      <div className="mb-3.5 flex flex-1 flex-col gap-2.5 overflow-y-auto">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-[10px] px-3.5 py-2.5 text-[13px] ${
              m.role === "user"
                ? "self-end bg-[#16181c] text-white"
                : "self-start bg-[#eee] text-neutral-700"
            }`}
          >
            {m.text}
          </div>
        ))}
        {messages.length === 0 && (
          <div className="self-start text-[12px] text-neutral-400">
            Ask about a project, or just say hi.
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Message Claude…"
          className="flex-1 rounded-lg border border-neutral-300 px-3 py-2.5 text-[13px] outline-none"
        />
        <button
          type="button"
          onClick={send}
          className="flex items-center gap-1.5 rounded-lg bg-[#d97757] px-4 text-[13px] font-medium text-white"
        >
          <Send size={13} /> Send
        </button>
      </div>
    </PopupShell>
  );
}

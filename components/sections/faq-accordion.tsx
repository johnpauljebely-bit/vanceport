"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  { q: "How long does a project take?", a: "Depends on scope — usually 1–3 weeks." },
  { q: "Do you take rush orders?", a: "Sometimes, for an added fee." },
  {
    q: "What's included in the price?",
    a: "Final files plus one round of revisions unless stated otherwise.",
  },
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div>
      {FAQS.map((item, i) => {
        const open = openIndex === i;
        return (
          <div key={item.q} className="border-b border-[#e5e2da] dark:border-white/10">
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : i)}
              className="flex w-full items-center justify-between py-4.5 text-left text-[15px] font-semibold"
            >
              {item.q}
              <Plus
                size={18}
                className={cn(
                  "shrink-0 text-body-fg transition-transform duration-200",
                  open && "rotate-45"
                )}
              />
            </button>
            <div
              className={cn(
                "overflow-hidden transition-[max-height] duration-300",
                open ? "max-h-40" : "max-h-0"
              )}
            >
              <p className="pb-4.5 text-[13px] leading-relaxed text-body-muted">{item.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Home,
  LayoutTemplate,
  User,
  ClipboardList,
  HelpCircle,
  Mail,
  MessageCircle,
  Moon,
} from "lucide-react";
import ActionSearchBar from "@/components/kokonutui/action-search-bar";
import { useDesktopStore } from "@/lib/desktop-store";
import { usePaletteStore } from "@/lib/palette-store";

const USER_EMAIL = "hello@vanceco.design";

export default function CommandPalette() {
  const open = usePaletteStore((s) => s.isOpen);
  const close = usePaletteStore((s) => s.close);
  const toggle = usePaletteStore((s) => s.toggle);
  const router = useRouter();
  const openDesktop = useDesktopStore((s) => s.openDesktop);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        toggle();
      }
      if (e.key === "Escape") {
        close();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggle, close]);

  const actions = [
    {
      id: "home",
      label: "Go to Home",
      icon: <Home className="h-4 w-4" />,
      description: "Page",
      end: "Navigate",
      run: () => router.push("/"),
    },
    {
      id: "work",
      label: "Open Work desktop",
      icon: <LayoutTemplate className="h-4 w-4" />,
      description: "Interactive",
      end: "Open",
      run: () => {
        router.push("/");
        openDesktop();
      },
    },
    {
      id: "about",
      label: "Go to About",
      icon: <User className="h-4 w-4" />,
      description: "Page",
      end: "Navigate",
      run: () => router.push("/about"),
    },
    {
      id: "order",
      label: "Go to Order",
      icon: <ClipboardList className="h-4 w-4" />,
      description: "Commissions",
      end: "Navigate",
      run: () => router.push("/order"),
    },
    {
      id: "faq",
      label: "Go to FAQ",
      icon: <HelpCircle className="h-4 w-4" />,
      description: "Page",
      end: "Navigate",
      run: () => router.push("/faq"),
    },
    {
      id: "email",
      label: "Copy email address",
      icon: <Mail className="h-4 w-4" />,
      description: USER_EMAIL,
      end: "Copy",
      run: () => navigator.clipboard?.writeText(USER_EMAIL),
    },
    {
      id: "discord",
      label: "Open Discord",
      icon: <MessageCircle className="h-4 w-4" />,
      description: "Community",
      end: "External",
      run: () => window.open("https://discord.com", "_blank"),
    },
    {
      id: "theme",
      label: "Toggle theme",
      icon: <Moon className="h-4 w-4" />,
      description: "Dark / Light",
      end: "Toggle",
      run: () => {
        const nowDark = !document.documentElement.classList.contains("dark");
        document.documentElement.classList.toggle("dark");
        localStorage.setItem("theme", nowDark ? "dark" : "light");
      },
    },
  ];

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[4000] flex items-start justify-center bg-black/50 pt-[18vh]"
      onClick={close}
    >
      <div
        className="w-full max-w-xl rounded-2xl bg-white p-2 shadow-2xl dark:bg-black"
        onClick={(e) => e.stopPropagation()}
      >
        <ActionSearchBar
          actions={actions.map((a) => ({
            id: a.id,
            label: a.label,
            icon: a.icon,
            description: a.description,
            end: a.end,
          }))}
          defaultOpen
          placeholder="Jump to a section, copy the email, open Discord…"
          onActionSelect={(action) => {
            const match = actions.find((a) => a.id === action.id);
            match?.run();
            close();
          }}
        />
      </div>
    </div>
  );
}

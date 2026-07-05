"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Brain,
  LayoutDashboard,
  Share2,
  LogOut,
  PanelLeftClose,
  Plus,
  Sun,
  Moon,
} from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";

interface DashboardSidebarProps {
  open: boolean;
  onToggle: () => void;
  onAddContent: () => void;
}

export function DashboardSidebar({ open, onToggle, onAddContent }: DashboardSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [shareHash, setShareHash] = useState<string | null>(null);
  const [shareError, setShareError] = useState("");
  const [username, setUsername] = useState<string | null>(null);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setUsername(localStorage.getItem("username")); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark")); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    router.push("/");
  };

  const handleShare = async () => {
    setShareError("");
    try {
      const res = await api.createShare(true);
      if (res.hash) {
        setShareHash(res.hash);
        const url = `${window.location.origin}/share/${res.hash}`;
        await navigator.clipboard.writeText(url);
      }
    } catch (err: unknown) {
      setShareError(err instanceof Error ? err.message : "Failed to create share link");
    }
  };

  const stopSharing = async () => {
    try {
      await api.createShare(false);
      setShareHash(null);
    } catch (err: unknown) {
      setShareError(err instanceof Error ? err.message : "Failed to stop sharing");
    }
  };

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-30 bg-canvas border-r border-hairline flex flex-col transition-all duration-200 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-hairline shrink-0">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-ink" />
            <span className="text-sm font-semibold text-ink">Recall</span>
          </Link>
          <button
            onClick={onToggle}
            className="w-7 h-7 rounded-full flex items-center justify-center text-mute hover:text-ink hover:bg-canvas-soft transition-colors"
            title="Close sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          <Link
            href="/dashboard"
            className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
              pathname === "/dashboard"
                ? "bg-canvas-soft text-ink font-medium"
                : "text-body hover:text-ink hover:bg-canvas-soft"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>

          <button
            onClick={onAddContent}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-body hover:text-ink hover:bg-canvas-soft rounded-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Memory
          </button>

          <div className="pt-4 mt-4 border-t border-hairline">
            <p className="px-3 text-xs font-mono uppercase tracking-wider text-mute mb-2">Share</p>
            <button
              onClick={handleShare}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-body hover:text-ink hover:bg-canvas-soft rounded-md transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share Brain
            </button>
            {shareHash && (
              <div className="px-3 mt-2">
                <p className="text-xs text-success mb-1">Link copied!</p>
                <button
                  onClick={stopSharing}
                  className="text-xs text-error hover:text-error-deep transition-colors"
                >
                  Stop sharing
                </button>
              </div>
            )}
            {shareError && <p className="px-3 mt-2 text-xs text-error">{shareError}</p>}
          </div>

          <div className="pt-4 mt-4 border-t border-hairline">
            <p className="px-3 text-xs font-mono uppercase tracking-wider text-mute mb-2">Account</p>
            {username && (
              <p className="px-3 text-xs text-body mb-2 truncate">@{username}</p>
            )}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-body hover:text-error hover:bg-error-soft rounded-md transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Log out
            </button>
          </div>
        </nav>

        <div className="p-3 border-t border-hairline">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-body hover:text-ink hover:bg-canvas-soft rounded-md transition-colors"
          >
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {dark ? "Light mode" : "Dark mode"}
          </button>
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/20"
          onClick={onToggle}
        />
      )}
    </>
  );
}

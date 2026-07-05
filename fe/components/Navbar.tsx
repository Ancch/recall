"use client";

import Link from "next/link";
import { Menu, X, Brain } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-canvas border-b border-hairline">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Brain className="w-6 h-6 text-ink" />
            <span className="text-lg font-semibold tracking-tight text-ink">Recall</span>
          </Link>

          <nav className="hidden sm:flex items-center gap-1">
            <ThemeToggle />
            <Link href="/login" className="inline-flex items-center px-3 py-1.5 text-sm text-body hover:text-ink rounded-full transition-colors">
              Log In
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-on-primary bg-ink hover:bg-ink/90 rounded-sm transition-colors"
            >
              Sign Up
            </Link>
          </nav>

          <div className="flex items-center gap-2 sm:hidden">
            <ThemeToggle />
            <button
              onClick={() => setOpen(!open)}
              className="inline-flex items-center justify-center w-9 h-9 rounded-full text-body hover:text-ink hover:bg-canvas-soft transition-colors"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="sm:hidden border-t border-hairline bg-canvas">
          <div className="px-4 py-3 space-y-2">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="block px-3 py-2 text-sm text-body hover:text-ink rounded-md hover:bg-canvas-soft transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              onClick={() => setOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-on-primary bg-ink hover:bg-ink/90 rounded-md transition-colors text-center"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

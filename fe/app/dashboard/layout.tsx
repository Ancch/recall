"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PanelLeft, PanelRight, Plus } from "lucide-react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { AddContentModal } from "@/components/AddContentModal";
import { ThemeToggle } from "@/components/ThemeToggle";
import { api } from "@/lib/api";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    const stored = localStorage.getItem("username") || "";
    if (stored !== username) {
      setUsername(stored); // eslint-disable-line react-hooks/set-state-in-effect
    }
  }, [username]);

  const handleAddContent = async (data: { link?: string; title?: string; content?: string }) => {
    await api.addContent(data);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-canvas-soft">
      <DashboardSidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onAddContent={() => setAddModalOpen(true)}
      />

      <div className={`transition-all duration-200 ${sidebarOpen ? "sm:ml-56" : ""}`}>
        <header className="sticky top-0 z-10 bg-canvas border-b border-hairline h-16 flex items-center px-4 gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-body hover:text-ink hover:bg-canvas-soft transition-colors"
            title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {sidebarOpen ? <PanelLeft className="w-4 h-4" /> : <PanelRight className="w-4 h-4" />}
          </button>

          <div className="flex-1" />

          <ThemeToggle />

          {username && (
            <span className="text-sm text-body hidden sm:block">
              @{username}
            </span>
          )}

          <button
            onClick={() => setAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-on-primary bg-ink hover:bg-ink/90 rounded-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Memory</span>
          </button>
        </header>

        <main>{children}</main>
      </div>

      <AddContentModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSubmit={handleAddContent}
      />
    </div>
  );
}

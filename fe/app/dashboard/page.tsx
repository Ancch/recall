"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Search, Brain, Plus, Hash } from "lucide-react";
import { api } from "@/lib/api";
import type { ContentItem } from "@/lib/types";
import { ContentCard } from "@/components/ContentCard";
import { AddContentModal } from "@/components/AddContentModal";

function detectTag(link?: string | null): string {
  if (!link) return "note";
  if (/youtube\.com|youtu\.be/i.test(link)) return "youtube";
  if (/twitter\.com|x\.com/i.test(link)) return "twitter";
  if (/github\.com/i.test(link)) return "github";
  return "website";
}

const tags = [
  { id: "all", label: "All" },
  { id: "youtube", label: "YouTube" },
  { id: "twitter", label: "X / Twitter" },
  { id: "github", label: "GitHub" },
  { id: "website", label: "Website" },
  { id: "note", label: "Notes" },
];

export default function DashboardPage() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ContentItem[] | null>(null);
  const [searchAnswer, setSearchAnswer] = useState("");
  const [searching, setSearching] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [activeTag, setActiveTag] = useState("all");

  const fetchContent = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.getContent();
      setContent(res.content);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load content");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent(); // eslint-disable-line react-hooks/set-state-in-effect
  }, [fetchContent]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    setSearchAnswer("");
    setSearchResults(null);
    try {
      const res = await api.search(searchQuery);
      setSearchResults(res.relevantContent);
      setSearchAnswer(res.answer);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setSearching(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteContent(id);
      setContent((prev) => prev.filter((c) => c._id !== id));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  const handleAddContent = async (data: { link?: string; title?: string; content?: string }) => {
    await api.addContent(data);
    fetchContent();
  };

  const filteredContent = useMemo(() => {
    if (searchResults !== null) return searchResults;
    if (activeTag === "all") return content;
    return content.filter((item) => detectTag(item.link) === activeTag);
  }, [content, activeTag, searchResults]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">Dashboard</h1>
          <p className="text-sm text-body mt-1">Your saved memories and notes.</p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mute" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (!e.target.value) {
              setSearchResults(null);
              setSearchAnswer("");
            }
          }}
          placeholder="Search your brain with AI..."
          className="w-full h-10 pl-10 pr-4 text-sm text-ink bg-canvas border border-hairline rounded-lg placeholder:text-mute focus:outline-none focus:border-ink transition-colors"
        />
      </form>

      {/* Tag filters */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1 scrollbar-none">
        <Hash className="w-4 h-4 text-mute shrink-0" />
        {tags.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTag(t.id)}
            className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
              activeTag === t.id
                ? "bg-ink text-on-primary"
                : "bg-canvas text-body border border-hairline hover:border-hairline-strong hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {searching && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2 text-sm text-body">
            <div className="w-4 h-4 border-2 border-hairline-strong border-t-ink rounded-full animate-spin" />
            Searching your brain...
          </div>
        </div>
      )}

      {searchAnswer && (
        <div className="bg-canvas border border-hairline rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-4 h-4 text-link" />
            <span className="text-xs font-mono uppercase tracking-wider text-mute">AI Answer</span>
          </div>
          <p className="text-sm text-ink leading-relaxed">{searchAnswer}</p>
        </div>
      )}

      {error && (
        <div className="bg-error-soft border border-error/20 rounded-lg p-3 mb-6">
          <p className="text-sm text-error-deep">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="break-inside-avoid">
              <div className="bg-canvas rounded-lg border border-hairline p-4 animate-pulse">
                <div className="h-4 bg-canvas-soft rounded w-2/3 mb-3" />
                <div className="h-4 bg-canvas-soft rounded w-full mb-2" />
                <div className="h-4 bg-canvas-soft rounded w-5/6" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredContent.length === 0 ? (
        <div className="text-center py-16">
          <Brain className="w-12 h-12 text-mute mx-auto mb-4" />
          <h3 className="text-lg font-medium text-ink mb-2">
            {activeTag !== "all" ? "No memories with this tag" : "Your brain is empty"}
          </h3>
          <p className="text-sm text-body mb-6">
            {activeTag !== "all"
              ? "Try a different filter or add new content."
              : "Start adding memories — URLs, notes, or anything you want to remember."}
          </p>
          <button
            onClick={() => setAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-on-primary bg-ink hover:bg-ink/90 rounded-full transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Your First Memory
          </button>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {filteredContent.map((item) => (
            <div key={item._id} className="break-inside-avoid">
              <ContentCard
                _id={item._id}
                type={item.type}
                title={item.title}
                content={item.content}
                link={item.link}
                imageUrl={item.imageUrl}
                createdAt={item.createdAt}
                onDelete={handleDelete}
              />
            </div>
          ))}
        </div>
      )}

      <AddContentModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSubmit={handleAddContent}
      />
    </div>
  );
}

"use client";

import { useState } from "react";
import { X, Link2, FileText } from "lucide-react";

interface AddContentModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { link?: string; title?: string; content?: string }) => Promise<void>;
}

type Tab = "link" | "note";

export function AddContentModal({ open, onClose, onSubmit }: AddContentModalProps) {
  const [tab, setTab] = useState<Tab>("link");
  const [link, setLink] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (tab === "link") {
        if (!link.trim()) {
          setError("Please enter a URL");
          setLoading(false);
          return;
        }
        await onSubmit({ link: link.trim() });
      } else {
        if (!title.trim() && !content.trim()) {
          setError("Please enter a title or content");
          setLoading(false);
          return;
        }
        await onSubmit({ title: title.trim(), content: content.trim() });
      }
      setLink("");
      setTitle("");
      setContent("");
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to add content");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-canvas rounded-xl w-full max-w-lg shadow-[0px_1px_1px_#00000005,0px_8px_16px_-4px_#0000000a,0px_24px_32px_-8px_#0000000f] border border-hairline">
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="text-lg font-semibold text-ink">Add Memory</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-mute hover:text-ink hover:bg-canvas-soft transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6">
          <div className="flex gap-1 p-1 bg-canvas-soft rounded-lg mb-4">
            <button
              onClick={() => setTab("link")}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-md transition-all ${
                tab === "link" ? "bg-canvas text-ink shadow-sm" : "text-body hover:text-ink"
              }`}
            >
              <Link2 className="w-4 h-4" />
              URL
            </button>
            <button
              onClick={() => setTab("note")}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-md transition-all ${
                tab === "note" ? "bg-canvas text-ink shadow-sm" : "text-body hover:text-ink"
              }`}
            >
              <FileText className="w-4 h-4" />
              Note
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          {tab === "link" ? (
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">URL</label>
              <input
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://example.com/article"
                className="w-full h-10 px-3 text-sm text-ink bg-canvas border border-hairline rounded-sm placeholder:text-mute focus:outline-none focus:border-ink transition-colors"
              />
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="My note title"
                  className="w-full h-10 px-3 text-sm text-ink bg-canvas border border-hairline rounded-sm placeholder:text-mute focus:outline-none focus:border-ink transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your thoughts..."
                  rows={4}
                  className="w-full px-3 py-2 text-sm text-ink bg-canvas border border-hairline rounded-sm placeholder:text-mute focus:outline-none focus:border-ink transition-colors resize-none"
                />
              </div>
            </>
          )}

          {error && <p className="text-sm text-error">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 text-sm font-medium text-on-primary bg-ink hover:bg-ink/90 rounded-sm transition-colors disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Memory"}
          </button>
        </form>
      </div>
    </div>
  );
}

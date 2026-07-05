"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Brain, FileText, AlertCircle } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import { ContentCard } from "@/components/ContentCard";

interface ContentItem {
  _id: string;
  type: string;
  title: string;
  content: string;
  link?: string | null;
  imageUrl?: string | null;
  createdAt?: string;
}

export default function SharedBrainPage() {
  const params = useParams<{ shareLink: string }>();
  const [username, setUsername] = useState("");
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchShared = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.getSharedBrain(params.shareLink);
        setUsername(res.username);
        setContent(res.content);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load shared brain");
      } finally {
        setLoading(false);
      }
    };
    fetchShared();
  }, [params.shareLink]);

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas-soft flex items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-body">
          <div className="w-4 h-4 border-2 border-hairline-strong border-t-ink rounded-full animate-spin" />
          Loading shared brain...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-canvas-soft flex items-center justify-center">
        <div className="text-center max-w-sm">
          <AlertCircle className="w-12 h-12 text-mute mx-auto mb-4" />
          <h1 className="text-lg font-semibold text-ink mb-2">Brain not found</h1>
          <p className="text-sm text-body mb-4">{error}</p>
          <Link href="/" className="text-sm text-link hover:text-link-deep transition-colors">
            Go home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas-soft flex flex-col">
      <div className="bg-gradient-to-br from-ink to-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Brain className="w-6 h-6 text-cyan" />
            <span className="text-lg font-semibold text-on-primary">Recall</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-on-primary text-center">
            {username}&apos;s Brain
          </h1>
          <p className="text-gray-400 text-center mt-3 text-sm">
            Shared knowledge and memories
          </p>
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs text-gray-300 font-mono">
              <FileText className="w-3 h-3" />
              {content.length} {content.length === 1 ? "memory" : "memories"}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {content.length === 0 ? (
          <div className="text-center py-16">
            <Brain className="w-12 h-12 text-mute mx-auto mb-4" />
            <p className="text-sm text-body">No memories shared yet.</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {content.map((item) => (
              <div key={item._id} className="break-inside-avoid">
                <ContentCard
                  _id={item._id}
                  type={item.type}
                  title={item.title}
                  content={item.content}
                  link={item.link}
                  imageUrl={item.imageUrl}
                  createdAt={item.createdAt}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="border-t border-hairline bg-canvas">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 text-sm text-body hover:text-ink transition-colors">
            <Brain className="w-4 h-4" />
            Recall
          </Link>
          <p className="text-xs text-mute">Powered by Recall &mdash; Your Second Brain</p>
        </div>
      </footer>
    </div>
  );
}

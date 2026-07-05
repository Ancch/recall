"use client";

import { useState } from "react";
import Image from "next/image";
import { Trash2, ExternalLink, Play, FileText } from "lucide-react";
import { VideoPlayerModal } from "./VideoPlayerModal";

interface ContentCardProps {
  _id: string;
  type: string;
  title: string;
  content: string;
  link?: string | null;
  imageUrl?: string | null;
  createdAt?: string;
  onDelete?: (id: string) => void;
}

type TagType = "youtube" | "twitter" | "github" | "website" | "note";

function detectTag(link?: string | null): TagType {
  if (!link) return "note";
  if (/youtube\.com|youtu\.be/i.test(link)) return "youtube";
  if (/twitter\.com|x\.com/i.test(link)) return "twitter";
  if (/github\.com/i.test(link)) return "github";
  return "website";
}

const tagConfig: Record<TagType, { label: string; color: string; bg: string }> = {
  youtube: { label: "YouTube", color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/20" },
  twitter: { label: "X / Twitter", color: "text-sky-600 dark:text-sky-400", bg: "bg-sky-50 dark:bg-sky-900/20" },
  github: { label: "GitHub", color: "text-gray-800 dark:text-gray-200", bg: "bg-gray-100 dark:bg-gray-800" },
  website: { label: "Website", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20" },
  note: { label: "Note", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20" },
};

function getYouTubeVideoId(link: string): string | null {
  const match = link.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?#]+)/);
  return match?.[1] || null;
}

function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

function formatDate(dateStr?: string) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const accentColors: Record<TagType, string> = {
  youtube: "border-l-red-500",
  twitter: "border-l-sky-500",
  github: "border-l-gray-500",
  website: "border-l-blue-500",
  note: "border-l-amber-500",
};

export function ContentCard(props: ContentCardProps) {
  const tag = detectTag(props.link);
  const config = tagConfig[tag];
  const [playing, setPlaying] = useState(false);
  const videoId = props.link ? getYouTubeVideoId(props.link) : null;

  return (
    <div className={`bg-canvas rounded-lg border border-hairline border-l-4 ${accentColors[tag]} hover:shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] transition-shadow group`}>
      {/* YouTube: thumbnail with play overlay */}
      {tag === "youtube" && videoId && (
        <div className="relative aspect-video bg-ink/5 cursor-pointer" onClick={() => setPlaying(true)}>
          <Image
            src={getYouTubeThumbnail(videoId)}
            alt={props.title || ""}
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors">
              <Play className="w-5 h-5 text-white ml-0.5" />
            </div>
          </div>
          <VideoPlayerModal open={playing} videoId={videoId} onClose={() => setPlaying(false)} />
        </div>
      )}

      {/* Website: thumbnail */}
      {tag === "website" && props.imageUrl && (
        <div className="relative h-36 bg-canvas-soft">
          <Image src={props.imageUrl} alt={props.title || ""} fill className="object-cover" unoptimized />
        </div>
      )}

      {/* Twitter: header with icon */}
      {tag === "twitter" && (
        <div className="flex items-center gap-2 px-4 pt-3 pb-1">
          <svg className="w-4 h-4 text-sky-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span className="text-xs font-medium text-sky-600 dark:text-sky-400">X / Twitter</span>
        </div>
      )}

      {/* GitHub: header with icon */}
      {tag === "github" && (
        <div className="flex items-center gap-2 px-4 pt-3 pb-1">
          <svg className="w-4 h-4 text-gray-700 dark:text-gray-300" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">GitHub</span>
        </div>
      )}

      <div className="p-4">
        {/* Header: title + delete */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-sm font-semibold text-ink leading-snug line-clamp-2">
            {props.title || (tag === "note" ? "Untitled Note" : `Untitled ${config.label}`)}
          </h3>
          {props.onDelete && (
            <button
              onClick={() => props.onDelete!(props._id)}
              className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-mute hover:text-error hover:bg-error-soft transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Content */}
        <p className="text-sm text-body leading-relaxed line-clamp-4 whitespace-pre-wrap">
          {props.content || "No content"}
        </p>

        {/* Link domain */}
        {props.link && tag !== "youtube" && (
          <a
            href={props.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-xs text-link hover:text-link-deep transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            {props.link.replace(/^https?:\/\//, "").replace(/\/$/, "")}
          </a>
        )}

        {/* YouTube: play button */}
        {tag === "youtube" && videoId && (
          <button
            onClick={() => setPlaying(true)}
            className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-on-primary bg-ink hover:bg-ink/90 rounded-sm transition-colors"
          >
            <Play className="w-3 h-3" />
            Play Video
          </button>
        )}

        {/* Footer: tag + date */}
        <div className="mt-3 flex items-center gap-2 flex-wrap pt-2 border-t border-hairline">
          <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${config.bg} ${config.color}`}>
            {tag === "note" && <FileText className="w-3 h-3 mr-1" />}
            {config.label}
          </span>
          {props.createdAt && (
            <span className="text-xs text-mute">{formatDate(props.createdAt)}</span>
          )}
        </div>
      </div>
    </div>
  );
}

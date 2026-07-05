import type { ContentItem } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3030/api/v1";

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(err.message || "Request failed");
  }

  return res.json();
}

export const api = {
  signup: (username: string, password: string) =>
    request<{ message: string }>("/signup", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),

  signin: (username: string, password: string) =>
    request<{ message: string; token: string; username: string }>("/signin", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),

  getContent: () =>
    request<{ content: ContentItem[] }>("/content", { method: "GET" }),

  addContent: (data: { link?: string; title?: string; content?: string }) =>
    request<{ message: string; contentId: string; imageUrl?: string }>("/content", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  deleteContent: (contentId: string) =>
    request<{ message: string }>(`/content/${contentId}`, { method: "DELETE" }),

  search: (query: string) =>
    request<{ message: string; relevantContent: ContentItem[]; answer: string }>("/search", {
      method: "POST",
      body: JSON.stringify({ query }),
    }),

  createShare: (share: boolean) =>
    request<{ hash?: string; message?: string }>("/share", {
      method: "POST",
      body: JSON.stringify({ share }),
    }),

  getSharedBrain: (shareLink: string) =>
    request<{ username: string; content: ContentItem[] }>(`/share/${shareLink}`, { method: "GET" }),
};

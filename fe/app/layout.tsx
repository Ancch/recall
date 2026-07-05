import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Recall - AI Second Brain for Personal Knowledge Management",
  description:
    "Save links, notes, and ideas. Recall is your AI-powered second brain for personal knowledge management, semantic search, and smart bookmarks. Remember everything with AI search.",
  keywords: [
    "AI second brain",
    "Personal knowledge management",
    "AI note taking",
    "Bookmark manager",
    "AI search",
    "Search your notes",
    "Search bookmarks",
    "Semantic search",
    "AI knowledge base",
    "Digital memory",
    "Smart bookmarks",
    "Save links",
    "Organize notes",
    "AI productivity app",
    "Remember everything",
  ],
  openGraph: {
    title: "Recall - Your AI Second Brain",
    description:
      "Save, organize, and retrieve your digital memories with AI-powered semantic search. Your second brain, always available.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

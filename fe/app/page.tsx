import Link from "next/link";
import { Brain, Search, Share2, Link2, FileText, Sparkles } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function LandingPage() {
  return (
    <>
      <Navbar />

      <main>
        <section className="relative overflow-hidden bg-canvas">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,_#007cf0_0%,_#7928ca_30%,_#ff0080_55%,_#ff4d4d_75%,_#f9cb28_100%)] opacity-10" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-canvas-soft rounded-full text-xs text-body font-mono uppercase tracking-wider mb-6 border border-hairline">
                <Sparkles className="w-3 h-3" />
                AI-Powered Memory Layer
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-ink leading-tight">
                Your digital brain, reimagined.
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-body leading-relaxed max-w-xl mx-auto">
                Save links, notes, and ideas. Recall anything instantly with AI-powered semantic search. Your second brain, always available.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/signup"
                  className="inline-flex items-center px-6 py-3 text-base font-medium text-on-primary bg-ink hover:bg-ink/90 rounded-full transition-colors"
                >
                  Get Started Free
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center px-6 py-3 text-base font-medium text-ink bg-canvas border border-hairline hover:border-hairline-strong rounded-full transition-colors"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-canvas-soft border-t border-hairline">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center mb-16">
              <p className="text-xs font-mono uppercase tracking-wider text-mute mb-3">Features</p>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
                Everything you need to remember.
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-canvas rounded-lg border border-hairline p-6 hover:shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-canvas-soft flex items-center justify-center mb-4">
                  <Link2 className="w-5 h-5 text-ink" />
                </div>
                <h3 className="text-lg font-semibold text-ink mb-2">Save Anything</h3>
                <p className="text-sm text-body leading-relaxed">
                  Capture web pages, YouTube videos, tweets, or write your own notes. Everything in one place.
                </p>
              </div>

              <div className="bg-canvas rounded-lg border border-hairline p-6 hover:shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-canvas-soft flex items-center justify-center mb-4">
                  <Search className="w-5 h-5 text-ink" />
                </div>
                <h3 className="text-lg font-semibold text-ink mb-2">AI Search</h3>
                <p className="text-sm text-body leading-relaxed">
                  Search your brain with natural language. Our AI understands context and finds what you need.
                </p>
              </div>

              <div className="bg-canvas rounded-lg border border-hairline p-6 hover:shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-canvas-soft flex items-center justify-center mb-4">
                  <Share2 className="w-5 h-5 text-ink" />
                </div>
                <h3 className="text-lg font-semibold text-ink mb-2">Share Your Brain</h3>
                <p className="text-sm text-body leading-relaxed">
                  Create a shareable link to your curated knowledge. Perfect for research, learning, and collaboration.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-ink">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-cyan mb-3">How It Works</p>
                <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-on-primary">
                  Save. Search. Recall.
                </h2>
                <p className="mt-4 text-base text-gray-400 leading-relaxed">
                  From anywhere on the web, save what matters. Your Recall brain automatically indexes everything with AI embeddings for instant, semantic retrieval.
                </p>
                <ul className="mt-8 space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-cyan/20 flex items-center justify-center shrink-0 mt-0.5">
                      <FileText className="w-3 h-3 text-cyan" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-on-primary">Smart Capture</p>
                      <p className="text-sm text-gray-400">Save URLs or write notes. Our extractors handle YouTube, Twitter, and any website.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-cyan/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Brain className="w-3 h-3 text-cyan" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-on-primary">AI Indexing</p>
                      <p className="text-sm text-gray-400">Content is embedded and indexed in a vector database for semantic understanding.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-cyan/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Search className="w-3 h-3 text-cyan" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-on-primary">Instant Retrieval</p>
                      <p className="text-sm text-gray-400">Ask questions in natural language and get answers from your saved knowledge.</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-ink border border-gray-800 rounded-lg p-6 font-mono text-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-error" />
                  <div className="w-3 h-3 rounded-full bg-warning" />
                  <div className="w-3 h-3 rounded-full bg-cyan" />
                  <span className="text-gray-500 ml-2">recall</span>
                </div>
                <div className="space-y-2 text-gray-300">
                <p><span className="text-cyan">$</span> recall add https://example.com/article</p>
              <p className="text-gray-500">{`// Saved to your brain`}</p>
              <p><span className="text-cyan">$</span> recall search &quot;how does AI work&quot;</p>
              <p className="text-gray-500">{`// Searching your knowledge base...`}</p>
              <p><span className="text-green-400">→</span> Found 3 relevant results</p>
              <p><span className="text-green-400">→</span> AI works through neural networks...</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-canvas-soft border-t border-hairline">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
              Ready to build your second brain?
            </h2>
            <p className="mt-4 text-lg text-body max-w-lg mx-auto">
              Join today and start saving your digital memories. It&apos;s free to get started.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/signup"
                className="inline-flex items-center px-6 py-3 text-base font-medium text-on-primary bg-ink hover:bg-ink/90 rounded-full transition-colors"
              >
                Get Started Free
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center px-6 py-3 text-base font-medium text-ink bg-canvas border border-hairline hover:border-hairline-strong rounded-full transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

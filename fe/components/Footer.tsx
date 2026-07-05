import Link from "next/link";
import { Brain } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-canvas border-t border-hairline">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-ink" />
              <span className="font-semibold text-ink">Recall</span>
            </div>
            <p className="text-sm text-body leading-relaxed">
              Your AI-powered second brain. Save, organize, and recall your digital memories.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-mute mb-3">Product</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-body hover:text-ink transition-colors">Home</Link></li>
              <li><Link href="/login" className="text-sm text-body hover:text-ink transition-colors">Dashboard</Link></li>
              <li><Link href="/signup" className="text-sm text-body hover:text-ink transition-colors">Get Started</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-mute mb-3">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="/login" className="text-sm text-body hover:text-ink transition-colors">Documentation</Link></li>
              <li><Link href="/signup" className="text-sm text-body hover:text-ink transition-colors">API</Link></li>
              <li><span className="text-sm text-mute">Status</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-mute mb-3">Company</h4>
            <ul className="space-y-2">
              <li><span className="text-sm text-mute">GitHub</span></li>
              <li><span className="text-sm text-mute">Twitter</span></li>
              <li><span className="text-sm text-mute">Contact</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-mute">&copy; {new Date().getFullYear()} Recall. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs text-mute">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

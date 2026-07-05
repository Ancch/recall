"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Brain, ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.signup(username, password);
      const signinRes = await api.signin(username, password);
      localStorage.setItem("token", signinRes.token);
      localStorage.setItem("username", signinRes.username);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas-soft flex flex-col">
      <div className="p-4">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-body hover:text-ink transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Brain className="w-8 h-8 text-ink" />
              <span className="text-xl font-semibold text-ink">Recall</span>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-ink">Create your account</h1>
            <p className="mt-2 text-sm text-body">Start building your second brain.</p>
          </div>

          <div className="bg-canvas rounded-xl border border-hairline p-6 shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a]">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-ink mb-1.5">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="your-username"
                  required
                  className="w-full h-10 px-3 text-sm text-ink bg-canvas border border-hairline rounded-sm placeholder:text-mute focus:outline-none focus:border-ink transition-colors"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-ink mb-1.5">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full h-10 px-3 text-sm text-ink bg-canvas border border-hairline rounded-sm placeholder:text-mute focus:outline-none focus:border-ink transition-colors"
                />
              </div>

              {error && <p className="text-sm text-error">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-10 text-sm font-medium text-on-primary bg-ink hover:bg-ink/90 rounded-sm transition-colors disabled:opacity-50"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-body">
              Already have an account?{" "}
              <Link href="/login" className="text-link hover:text-link-deep transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

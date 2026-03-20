"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 items-center px-6 py-16">
      <div className="grid w-full gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone">
            Welcome back
          </p>
          <h1 className="mt-4 text-4xl font-semibold text-ink sm:text-5xl font-[var(--font-display)]">
            Log in to keep generosity moving.
          </h1>
          <p className="mt-4 text-lg text-stone">
            Access your giving dashboard, receipts, and impact updates in one
            place.
          </p>
        </div>
        <div className="rounded-3xl border border-ink/10 bg-white p-8 shadow-xl">
          <h2 className="text-xl font-semibold text-ink">Log in</h2>
          <p className="mt-2 text-sm text-stone">
            Use the email you signed up with.
          </p>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-semibold text-ink">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-ink/10 bg-ivory px-4 py-3 text-sm text-ink outline-none transition focus:border-rose"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-ink">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-ink/10 bg-ivory px-4 py-3 text-sm text-ink outline-none transition focus:border-rose"
                placeholder="••••••••"
              />
            </div>
            {error ? (
              <p className="rounded-2xl bg-rose/10 px-4 py-3 text-sm text-rose">
                {error}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-ink/90 disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>
          <p className="mt-6 text-sm text-stone">
            New here?{" "}
            <Link href="/signup" className="font-semibold text-ink">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

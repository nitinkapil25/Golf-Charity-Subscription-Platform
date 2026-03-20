"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setLoading(false);
      setError("Email and password are required.");
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: trimmedEmail,
      password: trimmedPassword,
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    if (data.session) {
      router.push("/dashboard");
      return;
    }

    setMessage("Check your email to confirm your account, then log in.");
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 items-center px-6 py-16">
      <div className="grid w-full gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone">
            Start giving
          </p>
          <h1 className="mt-4 text-4xl font-semibold text-ink sm:text-5xl font-[var(--font-display)]">
            Create your account and join the movement.
          </h1>
          <p className="mt-4 text-lg text-stone">
            Your monthly plan unlocks continuous care, transparent receipts, and
            real-time impact updates.
          </p>
        </div>
        <div className="rounded-3xl border border-ink/10 bg-white p-8 shadow-xl">
          <h2 className="text-xl font-semibold text-ink">Sign up</h2>
          <p className="mt-2 text-sm text-stone">
            Use an email address you check regularly.
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
                placeholder="Create a secure password"
              />
            </div>
            {error ? (
              <p className="rounded-2xl bg-rose/10 px-4 py-3 text-sm text-rose">
                {error}
              </p>
            ) : null}
            {message ? (
              <p className="rounded-2xl bg-sage/10 px-4 py-3 text-sm text-sage">
                {message}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-rose px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-deep disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
          <p className="mt-6 text-sm text-stone">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-ink">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

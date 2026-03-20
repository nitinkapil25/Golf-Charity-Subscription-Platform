"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type ScoreFormProps = {
  onCreated?: () => void;
};

export default function ScoreForm({ onCreated }: ScoreFormProps) {
  const router = useRouter();
  const [score, setScore] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    setDate(today);
  }, []);

  const parsedScore = useMemo(() => {
    const value = Number(score);
    return Number.isFinite(value) ? value : NaN;
  }, [score]);

  const isValidScore = parsedScore >= 1 && parsedScore <= 45;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!isValidScore) {
      setError("Score must be between 1 and 45.");
      return;
    }

    if (!date) {
      setError("Please select a date.");
      return;
    }

    setLoading(true);

    const { data: userData, error: userError } =
      await supabase.auth.getUser();

    if (userError || !userData.user) {
      setLoading(false);
      setError("Please log in to submit a score.");
      router.push("/login");
      return;
    }

    const userId = userData.user.id;

    // Ensure a profile row exists for the authenticated user.
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .maybeSingle();

    if (profileError) {
      setLoading(false);
      setError(profileError.message);
      return;
    }

    if (!profile) {
      const { error: createProfileError } = await supabase
        .from("profiles")
        .insert({ id: userId, email: userData.user.email ?? null });

      if (createProfileError) {
        setLoading(false);
        setError(createProfileError.message);
        return;
      }
    }

    const { error: insertError } = await supabase.from("scores").insert({
      user_id: userId,
      score: parsedScore,
      played_at: date,
    });

    setLoading(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setScore("");
    onCreated?.();
  };

  return (
    <div className="rounded-3xl border border-ink/10 bg-white/90 p-8 shadow-xl transition hover:shadow-2xl">
      <h2 className="text-xl font-semibold text-ink">Add a new score</h2>
      <p className="mt-2 text-sm text-stone">
        Log your most recent round. We&apos;ll keep your latest five scores.
      </p>
      <form className="mt-6 grid gap-4 sm:grid-cols-[1fr_1fr_auto]" onSubmit={handleSubmit}>
        <div>
          <label className="text-sm font-semibold text-ink">Score</label>
          <input
            type="number"
            min={1}
            max={45}
            value={score}
            onChange={(event) => setScore(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-ink/10 bg-ivory px-4 py-3 text-sm text-ink outline-none transition focus:border-rose focus:ring-2 focus:ring-rose/20"
            placeholder="1 - 45"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-ink">Date</label>
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-ink/10 bg-ivory px-4 py-3 text-sm text-ink outline-none transition focus:border-rose focus:ring-2 focus:ring-rose/20"
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-rose px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-rose-deep disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save score"}
          </button>
        </div>
      </form>
      {error ? (
        <p className="mt-4 rounded-2xl bg-rose/10 px-4 py-3 text-sm text-rose">
          {error}
        </p>
      ) : null}
    </div>
  );
}

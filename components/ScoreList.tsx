"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export type ScoreItem = {
  id: string;
  score: number;
  played_at: string;
  created_at: string;
};

type ScoreListProps = {
  refreshKey?: number;
};

export default function ScoreList({ refreshKey }: ScoreListProps) {
  const [scores, setScores] = useState<ScoreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScores = async () => {
      setLoading(true);
      setError(null);

      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userData.user) {
        setLoading(false);
        setError("Please log in to view scores.");
        return;
      }

      const { data, error: fetchError } = await supabase
        .from("scores")
        .select("id, score, played_at, created_at")
        .eq("user_id", userData.user.id)
        .order("created_at", { ascending: false })
        .limit(5);

      if (fetchError) {
        setLoading(false);
        setError(fetchError.message);
        return;
      }

      setScores(data ?? []);
      setLoading(false);
    };

    fetchScores();
  }, [refreshKey]);

  return (
    <div className="rounded-3xl border border-ink/10 bg-white/90 p-8 shadow-xl transition hover:shadow-2xl">
      <h2 className="text-xl font-semibold text-ink">Your latest scores</h2>
      <p className="mt-2 text-sm text-stone">
        The most recent five rounds you&apos;ve logged.
      </p>
      {loading ? (
        <p className="mt-6 text-sm text-stone">Loading scores...</p>
      ) : null}
      {error ? (
        <p className="mt-6 rounded-2xl bg-rose/10 px-4 py-3 text-sm text-rose">
          {error}
        </p>
      ) : null}
      {!loading && !error && scores.length === 0 ? (
        <p className="mt-6 text-sm text-stone">
          No scores yet. Add your first round above.
        </p>
      ) : null}
      {!loading && !error && scores.length > 0 ? (
        <div className="mt-6 space-y-3">
          {scores.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-2 rounded-2xl border border-ink/10 bg-ivory px-4 py-3 transition hover:border-ink/20 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-semibold text-ink">
                  Score {item.score}
                </p>
                <p className="text-xs text-stone">
                  {new Date(item.played_at).toLocaleDateString()}
                </p>
              </div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone">
                Latest
              </span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

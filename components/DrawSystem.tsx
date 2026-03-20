"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type DrawRecord = {
  id: string;
  numbers: number[];
  created_at: string;
  match_count?: number | null;
};

function generateNumbers() {
  const set = new Set<number>();
  while (set.size < 5) {
    const value = Math.floor(Math.random() * 45) + 1;
    set.add(value);
  }
  return Array.from(set).sort((a, b) => a - b);
}

export default function DrawSystem() {
  const [draw, setDraw] = useState<DrawRecord | null>(null);
  const [matches, setMatches] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resultMessage = (() => {
    if (matches === null) {
      return null;
    }
    if (matches === 5) {
      return "Jackpot Winner";
    }
    if (matches === 4) {
      return "Great! You won second tier prize";
    }
    if (matches === 3) {
      return "Nice! You won third tier prize";
    }
    return "No win this time";
  })();

  const resultTone =
    matches !== null && matches >= 3 ? "text-sage" : "text-rose";

  useEffect(() => {
    const loadLatestDraw = async () => {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userData.user) {
        setError("Please log in to run a draw.");
        return;
      }

      const { data, error: fetchError } = await supabase
        .from("draws")
        .select("id, numbers, created_at")
        .eq("user_id", userData.user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      if (data) {
        setDraw(data as DrawRecord);
      }
    };

    loadLatestDraw();
  }, []);

  const handleRunDraw = async () => {
    setError(null);
    setLoading(true);

    const { data: userData, error: userError } =
      await supabase.auth.getUser();

    if (userError || !userData.user) {
      setLoading(false);
      setError("Please log in to run a draw.");
      return;
    }

    const { data: scoreData, error: scoreError } = await supabase
      .from("scores")
      .select("score")
      .eq("user_id", userData.user.id);

    if (scoreError) {
      setLoading(false);
      setError(scoreError.message);
      return;
    }

    const numbers = generateNumbers();
    const userScores = (scoreData ?? []).map((row) => row.score);
    const matchCount = numbers.filter((num) => userScores.includes(num)).length;

    const { data: insertData, error: insertError } = await supabase
      .from("draws")
      .insert({
        user_id: userData.user.id,
        numbers,
        match_count: matchCount,
      })
      .select("id, numbers, created_at, match_count")
      .single();

    if (insertError) {
      setLoading(false);
      setError(insertError.message);
      return;
    }

    setDraw(insertData as DrawRecord);
    setMatches(matchCount);
    setLoading(false);
  };

  return (
    <div className="rounded-3xl border border-ink/10 bg-white/90 p-8 shadow-xl transition hover:shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-ink">Monthly draw</h2>
          <p className="mt-2 text-sm text-stone">
            Run a quick draw to see how your latest scores match up.
          </p>
        </div>
        <button
          type="button"
          onClick={handleRunDraw}
          disabled={loading}
          className="rounded-full bg-ink px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-ink/90 disabled:opacity-60"
        >
          {loading ? "Running..." : "Run Draw"}
        </button>
      </div>

      {error ? (
        <p className="mt-4 rounded-2xl bg-rose/10 px-4 py-3 text-sm text-rose">
          {error}
        </p>
      ) : null}

      {draw ? (
        <div className="mt-6 rounded-2xl border border-ink/10 bg-ivory px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone">
            Draw numbers
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {draw.numbers.map((num) => (
              <span
                key={num}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-white to-glow text-sm font-semibold text-ink shadow-md ring-1 ring-rose/10"
              >
                {num}
              </span>
            ))}
          </div>
          <p className="mt-4 text-sm font-semibold text-ink">
            {matches === null
              ? "Run the draw to see your matches."
              : `You matched ${matches} numbers.`}
          </p>
          {resultMessage ? (
            <p className={`mt-2 text-sm font-semibold ${resultTone}`}>
              {resultMessage}
            </p>
          ) : null}
        </div>
      ) : (
        <p className="mt-6 text-sm text-stone">
          No draw yet. Click “Run Draw” to generate your numbers.
        </p>
      )}
    </div>
  );
}

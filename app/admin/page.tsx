"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const ADMIN_EMAIL =
  process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "admin@example.com";

type ProfileRow = {
  id: string;
  email: string | null;
  created_at: string;
  charity_id?: string | null;
};

type ScoreRow = {
  id: string;
  user_id: string;
  score: number;
  played_at: string;
  created_at: string;
};

type DrawRow = {
  id: string;
  user_id: string;
  numbers: number[];
  created_at: string;
  match_count?: number | null;
};

type WinnerRow = {
  id: string;
  match_count: number;
  numbers: number[];
  profiles: { email: string | null }[];
};

export default function AdminPage() {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [scores, setScores] = useState<ScoreRow[]>([]);
  const [draws, setDraws] = useState<DrawRow[]>([]);
  const [winners, setWinners] = useState<WinnerRow[]>([]);

  useEffect(() => {
    const loadAdminData = async () => {
      setLoading(true);
      setError(null);

      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userData.user) {
        setAuthorized(false);
        setLoading(false);
        return;
      }

      if (userData.user.email !== ADMIN_EMAIL) {
        setAuthorized(false);
        setLoading(false);
        return;
      }

      setAuthorized(true);

      const [profilesResult, scoresResult, drawsResult, winnersResult] =
        await Promise.all([
        supabase
          .from("profiles")
          .select("id, email, created_at, charity_id")
          .order("created_at", { ascending: false }),
        supabase
          .from("scores")
          .select("id, user_id, score, played_at, created_at")
          .order("created_at", { ascending: false }),
        supabase
          .from("draws")
          .select("id, user_id, numbers, created_at, match_count")
          .order("created_at", { ascending: false }),
        supabase
          .from("draws")
          .select("id, match_count, numbers, profiles(email)")
          .gte("match_count", 3)
          .order("match_count", { ascending: false }),
      ]);

      if (
        profilesResult.error ||
        scoresResult.error ||
        drawsResult.error ||
        winnersResult.error
      ) {
        setError(
          profilesResult.error?.message ||
            scoresResult.error?.message ||
            drawsResult.error?.message ||
            winnersResult.error?.message ||
            "Failed to load admin data."
        );
        setLoading(false);
        return;
      }

      setProfiles((profilesResult.data as ProfileRow[]) ?? []);
      setScores((scoresResult.data as ScoreRow[]) ?? []);
      setDraws((drawsResult.data as DrawRow[]) ?? []);
      setWinners((winnersResult.data as WinnerRow[]) ?? []);
      setLoading(false);
    };

    loadAdminData();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-1 items-center px-6 py-16">
        <p className="text-sm text-stone">Loading admin panel...</p>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-1 items-center px-6 py-16">
        <div className="rounded-3xl border border-rose/20 bg-rose/10 p-8 text-rose">
          <p className="text-xs font-semibold uppercase tracking-[0.2em]">
            Access Denied
          </p>
          <p className="mt-3 text-sm">
            You do not have permission to view this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-6 py-16">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone">
          Admin
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-ink sm:text-4xl font-[var(--font-display)]">
          Platform overview
        </h1>
        <p className="mt-3 text-sm text-stone">
          Review users, scores, and draws from across the platform.
        </p>
      </div>

      {error ? (
        <p className="rounded-2xl bg-rose/10 px-4 py-3 text-sm text-rose">
          {error}
        </p>
      ) : null}

      <section className="rounded-3xl border border-ink/10 bg-white p-8 shadow-xl">
        <h2 className="text-xl font-semibold text-ink">Winners (3+ matches)</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.2em] text-stone">
              <tr>
                <th className="pb-3">User Email</th>
                <th className="pb-3">Match Count</th>
                <th className="pb-3">Numbers</th>
              </tr>
            </thead>
            <tbody className="text-ink">
              {winners.length === 0 ? (
                <tr>
                  <td className="py-3 text-sm text-stone" colSpan={3}>
                    No winners yet.
                  </td>
                </tr>
              ) : (
                winners.map((winner) => (
                  <tr key={winner.id} className="border-t border-ink/5">
                    <td className="py-3 pr-4">
                      {winner.profiles?.[0]?.email ?? "—"}
                    </td>
                    <td className="py-3 pr-4 font-semibold text-ink">
                      {winner.match_count}
                    </td>
                    <td className="py-3 pr-4 text-xs text-stone">
                      {(winner.numbers ?? []).join(", ")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-3xl border border-ink/10 bg-white p-8 shadow-xl">
        <h2 className="text-xl font-semibold text-ink">Users</h2>
        <div className="mt-4 max-h-[400px] overflow-x-auto overflow-y-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="sticky top-0 bg-white text-xs uppercase tracking-[0.2em] text-stone">
              <tr>
                <th className="pb-3">ID</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">Charity</th>
                <th className="pb-3">Created</th>
              </tr>
            </thead>
            <tbody className="text-ink">
              {profiles.map((profile) => (
                <tr key={profile.id} className="border-t border-ink/5">
                  <td className="py-3 pr-4 text-xs text-stone">{profile.id}</td>
                  <td className="py-3 pr-4">{profile.email ?? "—"}</td>
                  <td className="py-3 pr-4 text-xs text-stone">
                    {profile.charity_id ?? "—"}
                  </td>
                  <td className="py-3 text-xs text-stone">
                    {new Date(profile.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-3xl border border-ink/10 bg-white p-8 shadow-xl">
        <h2 className="text-xl font-semibold text-ink">Scores</h2>
        <div className="mt-4 max-h-[400px] overflow-x-auto overflow-y-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="sticky top-0 bg-white text-xs uppercase tracking-[0.2em] text-stone">
              <tr>
                <th className="pb-3">User</th>
                <th className="pb-3">Score</th>
                <th className="pb-3">Played</th>
                <th className="pb-3">Created</th>
              </tr>
            </thead>
            <tbody className="text-ink">
              {scores.map((score) => (
                <tr key={score.id} className="border-t border-ink/5">
                  <td className="py-3 pr-4 text-xs text-stone">
                    {score.user_id}
                  </td>
                  <td className="py-3 pr-4 font-semibold text-ink">
                    {score.score}
                  </td>
                  <td className="py-3 pr-4 text-xs text-stone">
                    {new Date(score.played_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 text-xs text-stone">
                    {new Date(score.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-3xl border border-ink/10 bg-white p-8 shadow-xl">
        <h2 className="text-xl font-semibold text-ink">Draws</h2>
        <div className="mt-4 max-h-[400px] overflow-x-auto overflow-y-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="sticky top-0 bg-white text-xs uppercase tracking-[0.2em] text-stone">
              <tr>
                <th className="pb-3">User</th>
                <th className="pb-3">Numbers</th>
                <th className="pb-3">Created</th>
              </tr>
            </thead>
            <tbody className="text-ink">
              {draws.map((draw) => (
                <tr key={draw.id} className="border-t border-ink/5">
                  <td className="py-3 pr-4 text-xs text-stone">
                    {draw.user_id}
                  </td>
                  <td className="py-3 pr-4">
                    {(draw.numbers ?? []).join(", ")}
                  </td>
                  <td className="py-3 text-xs text-stone">
                    {new Date(draw.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

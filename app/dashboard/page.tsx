"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ScoreForm from "@/components/ScoreForm";
import ScoreList from "@/components/ScoreList";
import CharitySelector from "@/components/CharitySelector";
import DrawSystem from "@/components/DrawSystem";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedCharity, setSelectedCharity] = useState<{
    id: string;
    name: string;
    description: string | null;
  } | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace("/login");
        return;
      }
      setEmail(data.session.user.email ?? null);
      setLoading(false);
    };

    checkSession();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-1 items-center px-6 py-16">
        <p className="text-sm text-stone">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-6 py-12 sm:py-16">
      <div className="rounded-3xl border border-ink/10 bg-white/90 p-8 shadow-xl backdrop-blur transition hover:shadow-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone">
          Dashboard
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-ink sm:text-4xl font-[var(--font-display)]">
          Welcome back{email ? `, ${email}` : ""}.
        </h1>
        <p className="mt-4 text-sm text-stone">
          Your subscription keeps support steady every month. We&apos;ll show your
          upcoming impact updates here soon.
        </p>
        <p className="mt-4 text-sm text-stone">
          Selected charity:{" "}
          <span className="font-semibold text-ink">
            {selectedCharity?.name ?? "Select a charity"}
          </span>
        </p>
      </div>
      <CharitySelector onSelected={setSelectedCharity} />
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <ScoreForm onCreated={() => setRefreshKey((prev) => prev + 1)} />
        <ScoreList refreshKey={refreshKey} />
      </div>
      <DrawSystem />
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-ink/10 bg-white/90 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
          <p className="text-sm font-semibold text-stone">Current plan</p>
          <p className="mt-3 text-2xl font-semibold text-ink">$25 / month</p>
          <p className="mt-2 text-sm text-stone">Next charge: in 12 days</p>
        </div>
        <div className="rounded-2xl border border-ink/10 bg-white/90 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
          <p className="text-sm font-semibold text-stone">Impact reports</p>
          <p className="mt-3 text-2xl font-semibold text-ink">3 delivered</p>
          <p className="mt-2 text-sm text-stone">Latest: March 2026</p>
        </div>
        <div className="rounded-2xl border border-ink/10 bg-white/90 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
          <p className="text-sm font-semibold text-stone">Support inbox</p>
          <p className="mt-3 text-2xl font-semibold text-ink">2 new notes</p>
          <p className="mt-2 text-sm text-stone">From partner teams</p>
        </div>
      </div>
      <div className="flex">
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-full border border-ink/10 px-5 py-2 text-sm font-semibold text-ink transition hover:border-ink/20 hover:bg-white"
        >
          Log out
        </button>
      </div>
    </div>
  );
}

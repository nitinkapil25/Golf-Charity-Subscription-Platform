"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Charity = {
  id: string;
  name: string;
  description: string | null;
};

type CharitySelectorProps = {
  onSelected?: (charity: Charity | null) => void;
};

export default function CharitySelector({ onSelected }: CharitySelectorProps) {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCharities = async () => {
      setLoading(true);
      setError(null);

      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userData.user) {
        setLoading(false);
        setError("Please log in to choose a charity.");
        return;
      }

      const [charityResult, profileResult] = await Promise.all([
        supabase
          .from("charities")
          .select("id, name, description")
          .order("created_at", { ascending: false }),
        supabase
          .from("profiles")
          .select("charity_id")
          .eq("id", userData.user.id)
          .single(),
      ]);

      if (charityResult.error) {
        setLoading(false);
        setError(charityResult.error.message);
        return;
      }

      if (profileResult.error && profileResult.error.code !== "PGRST116") {
        setLoading(false);
        setError(profileResult.error.message);
        return;
      }

      const currentId = profileResult.data?.charity_id ?? null;
      setCharities(charityResult.data ?? []);
      setSelectedId(currentId);

      const current = charityResult.data?.find((item) => item.id === currentId) ?? null;
      onSelected?.(current);

      setLoading(false);
    };

    loadCharities();
  }, [onSelected]);

  const handleSelect = async (charity: Charity) => {
    setError(null);
    setSaving(true);

    const { data: userData, error: userError } =
      await supabase.auth.getUser();

    if (userError || !userData.user) {
      setSaving(false);
      setError("Please log in to choose a charity.");
      return;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ charity_id: charity.id })
      .eq("id", userData.user.id);

    setSaving(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSelectedId(charity.id);
    onSelected?.(charity);
  };

  if (loading) {
    return (
      <div className="rounded-3xl border border-ink/10 bg-white/90 p-8 shadow-xl">
        <p className="text-sm text-stone">Loading charities...</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-ink/10 bg-white/90 p-8 shadow-xl transition hover:shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-ink">Choose a charity</h2>
          <p className="mt-2 text-sm text-stone">
            Select the partner organization you want to support each month.
          </p>
        </div>
        {saving ? (
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone">
            Saving...
          </span>
        ) : null}
      </div>

      {error ? (
        <p className="mt-4 rounded-2xl bg-rose/10 px-4 py-3 text-sm text-rose">
          {error}
        </p>
      ) : null}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {charities.map((charity) => {
          const isSelected = selectedId === charity.id;
          return (
            <button
              key={charity.id}
              type="button"
              onClick={() => handleSelect(charity)}
              className={`text-left rounded-2xl border px-5 py-4 transition hover:-translate-y-0.5 ${
                isSelected
                  ? "border-rose bg-rose/10 shadow-sm"
                  : "border-ink/10 bg-ivory hover:border-ink/20"
              }`}
            >
              <p className="text-sm font-semibold text-ink">{charity.name}</p>
              <p className="mt-2 text-xs text-stone">
                {charity.description ?? "Community-led support and care."}
              </p>
              {isSelected ? (
                <span className="mt-3 inline-flex text-xs font-semibold uppercase tracking-[0.2em] text-rose">
                  Selected
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

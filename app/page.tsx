import Link from "next/link";
import { impactHighlights, impactStats, steps } from "@/lib/content";

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(216,104,106,0.15),_transparent_55%)]" />
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-16 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <span className="inline-flex items-center rounded-full bg-rose/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-rose">
              Giving that stays
            </span>
            <h1 className="mt-6 text-4xl font-semibold leading-tight text-ink sm:text-5xl md:text-6xl md:leading-tight font-[var(--font-display)]">
              Small subscriptions, steady hope for families who need it most.
            </h1>
            <p className="mt-5 text-lg leading-8 text-stone">
              Heartline Giving turns monthly generosity into daily meals, safe
              shelter, and compassionate care. Your support becomes a promise
              that doesn&apos;t expire.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full bg-rose px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-rose/20 transition hover:bg-rose-deep"
              >
                Subscribe Now
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-full border border-ink/15 bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:border-ink/25"
              >
                See How It Works
              </Link>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {impactStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/60 bg-white/70 p-4 text-center shadow-sm"
                >
                  <p className="text-2xl font-semibold text-ink">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-stone">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-white/60 bg-white/80 p-8 shadow-xl">
            <div className="rounded-2xl bg-[linear-gradient(135deg,_rgba(245,215,200,0.6),_rgba(255,248,244,0.9))] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone">
                Monthly plan
              </p>
              <p className="mt-3 text-3xl font-semibold text-ink">$25 / month</p>
              <p className="mt-3 text-sm leading-6 text-stone">
                Covers warm meals, hygiene kits, and a day of community care
                every week.
              </p>
            </div>
            <div className="mt-6 space-y-4 text-sm text-stone">
              <div className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-sage" />
                <p>Instant receipts and quarterly impact reports.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-sage" />
                <p>Pause or change your plan anytime.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-sage" />
                <p>Direct support to trusted local partners.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="flex flex-col gap-4">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone">
            How it works
          </span>
          <h2 className="text-3xl font-semibold text-ink sm:text-4xl font-[var(--font-display)]">
            A simple path from your generosity to their relief.
          </h2>
          <p className="max-w-2xl text-lg text-stone">
            We remove the guesswork so you can focus on giving. Every step is
            designed to keep support flowing without delay.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="rounded-2xl border border-ink/10 bg-white p-6 shadow-sm"
            >
              <div className="text-sm font-semibold uppercase tracking-[0.25em] text-rose">
                0{index + 1}
              </div>
              <h3 className="mt-4 text-xl font-semibold text-ink">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-stone">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="impact"
        className="mx-auto w-full max-w-6xl px-6 py-16"
      >
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="rounded-3xl bg-ink p-8 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
              Charity impact
            </p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl font-[var(--font-display)]">
              Give with confidence. See the difference you make.
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/75">
              Your subscription fuels rapid response grants, mental health
              resources, and long-term housing partnerships. We focus on
              sustaining programs beyond the first moment of need.
            </p>
            <div className="mt-6 rounded-2xl bg-white/10 p-4 text-sm">
              <p className="font-semibold">Latest impact story</p>
              <p className="mt-2 text-white/80">
                "With consistent monthly support, we expanded our night shelter
                and kept families together through the winter." — City Haven
                Collective
              </p>
            </div>
          </div>
          <div className="grid gap-6">
            {impactHighlights.map((highlight) => (
              <div
                key={highlight.title}
                className="rounded-2xl border border-ink/10 bg-white p-6"
              >
                <h3 className="text-xl font-semibold text-ink">
                  {highlight.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-stone">
                  {highlight.description}
                </p>
              </div>
            ))}
            <div className="rounded-2xl border border-ink/10 bg-white p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone">
                Transparency promise
              </p>
              <p className="mt-3 text-lg font-semibold text-ink">
                Every contribution is tracked, every report delivered.
              </p>
              <p className="mt-2 text-sm text-stone">
                We share program receipts, partner highlights, and next-quarter
                goals so you always know what&apos;s possible.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

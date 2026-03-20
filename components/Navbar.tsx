import Link from "next/link";

export default function Navbar() {
  return (
    <header className="w-full">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <Link
          href="/"
          className="flex items-center gap-3 text-xl font-semibold text-ink"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-rose text-sm font-bold uppercase tracking-[0.2em] text-white">
            Hg
          </span>
          <span className="font-[var(--font-display)]">Heartline Giving</span>
        </Link>
        <div className="flex items-center gap-3 text-sm font-semibold">
          <Link
            href="/login"
            className="rounded-full border border-ink/10 px-4 py-2 text-ink transition hover:-translate-y-0.5 hover:border-ink/20 hover:bg-white"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-ink px-4 py-2 text-white transition hover:-translate-y-0.5 hover:bg-ink/90"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-ink/10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10 text-sm text-stone md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold text-ink">Heartline Giving</p>
          <p className="mt-1 max-w-md">
            Consistent, transparent giving for communities that need steady care.
          </p>
        </div>
        <div className="flex flex-wrap gap-6">
          <span className="text-ink">Privacy</span>
          <span className="text-ink">Terms</span>
          <span className="text-ink">Support</span>
        </div>
      </div>
    </footer>
  );
}

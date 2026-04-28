export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-lg focus:bg-[var(--color-primary-green)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-[0_8px_24px_-12px_rgba(16,185,129,0.55)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-deep-green)] focus-visible:ring-offset-2"
    >
      Skip to main content
    </a>
  );
}

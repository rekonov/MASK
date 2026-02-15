"use client";

import IdentityCard from "@/components/IdentityCard";
import ThemeToggle from "@/components/ThemeToggle";

export default function HomePage() {
  return (
    <main className="mask-shell">
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-lg relative z-10">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold uppercase tracking-[0.28em] text-[var(--text-primary)]">
            M A S K
          </h1>
          <p className="mt-3 text-[11px] uppercase tracking-[0.28em] text-[var(--text-secondary)]">
            Disposable identities
          </p>
        </div>

        {/* Identity card */}
        <IdentityCard />

        {/* Footer */}
        <p className="text-center mt-6 text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
          Everything is generated locally. Nothing leaves your device.
        </p>
      </div>
    </main>
  );
}

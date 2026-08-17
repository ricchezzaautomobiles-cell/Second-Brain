import React from 'react';

export const TermsView: React.FC = () => {
  return (
    <div className="pt-24 pb-28 max-w-4xl mx-auto px-6 space-y-12 text-white font-sans selection:bg-white selection:text-black">
      <header className="border-b border-white/10 pb-8 space-y-3">
        <span className="text-xs font-mono tracking-[0.3em] uppercase text-zinc-500 block">
          LEGAL &amp; POLICIES
        </span>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tighter uppercase font-sans text-white">
          TERMS OF SERVICE.
        </h1>
        <p className="text-xs text-zinc-400 font-mono uppercase">
          Last Updated: August 2026
        </p>
      </header>

      <div className="space-y-10 divide-y divide-zinc-800">
        <section className="pt-6 space-y-3">
          <h2 className="text-xl font-bold uppercase tracking-tight text-white">1. Acceptance of Terms</h2>
          <p className="text-sm text-zinc-300 font-light leading-relaxed">
            By accessing or using UNSENT ("the Platform"), you agree to be bound by these Terms of Service. UNSENT provides a private vault and anonymous writing space for personal expression.
          </p>
        </section>

        <section className="pt-6 space-y-3">
          <h2 className="text-xl font-bold uppercase tracking-tight text-white">2. User Content &amp; Ownership</h2>
          <p className="text-sm text-zinc-300 font-light leading-relaxed">
            You retain full ownership of all thoughts, letters, and text you compose on UNSENT. You decide whether your entries remain strictly private in your personal vault or are released anonymously to the community.
          </p>
        </section>

        <section className="pt-6 space-y-3">
          <h2 className="text-xl font-bold uppercase tracking-tight text-white">3. Anonymous Publishing &amp; Community Safety</h2>
          <p className="text-sm text-zinc-300 font-light leading-relaxed">
            When publishing content anonymously, you agree not to post content that constitutes severe harassment, doxxing, explicit personal contact information of third parties, or illegal material. UNSENT reserves the right to remove flagged content that violates community safety standards.
          </p>
        </section>

        <section className="pt-6 space-y-3">
          <h2 className="text-xl font-bold uppercase tracking-tight text-white">4. Privacy &amp; Data Security</h2>
          <p className="text-sm text-zinc-300 font-light leading-relaxed">
            UNSENT employs row-level security and database isolation. Private messages remain isolated to your authenticated account and are never indexed by search engines. Anonymous posts strip all user metadata.
          </p>
        </section>

        <section className="pt-6 space-y-3">
          <h2 className="text-xl font-bold uppercase tracking-tight text-white">5. Account Deletion &amp; Hard Purging</h2>
          <p className="text-sm text-zinc-300 font-light leading-relaxed">
            You can delete your account or private entries at any time. Deletion permanently purges corresponding database records from our servers.
          </p>
        </section>
      </div>
    </div>
  );
};

import React from 'react';
import { ActiveTab } from '../../types';

interface AboutViewProps {
  onNavigate: (tab: ActiveTab) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate }) => {
  return (
    <div className="pt-24 pb-28 max-w-4xl mx-auto px-6 space-y-16 text-white font-sans selection:bg-white selection:text-black">
      {/* Header */}
      <header className="border-b border-white/10 pb-8 space-y-4">
        <span className="text-xs font-mono tracking-[0.3em] uppercase text-zinc-500 block">
          ABOUT THE PLATFORM
        </span>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tighter uppercase font-sans text-white">
          THE THINGS YOU NEVER SENT.
        </h1>
        <p className="text-base sm:text-lg font-serif italic text-zinc-400 max-w-2xl leading-relaxed">
          Some words don't need a recipient. They just need somewhere to exist.
        </p>
      </header>

      {/* Main Content Sections */}
      <div className="space-y-12 divide-y divide-zinc-800">
        {/* Section 1: What is UNSENT */}
        <section className="pt-8 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
            What is UNSENT?
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans font-light">
            UNSENT is a dedicated, privacy-focused digital sanctuary designed for the unspoken letters, private memories, unsaid confessions, and raw feelings that were never sent. Whether it is an unsent letter to an ex, an unsaid apology to a friend, or a quiet note to yourself, UNSENT provides a quiet, intentional space to release your thoughts.
          </p>
        </section>

        {/* Section 2: Why UNSENT Exists */}
        <section className="pt-8 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
            Why UNSENT Exists
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans font-light">
            In a hyper-connected world, we often hold back our most genuine thoughts because sending them might reopen old wounds, complicate relationships, or disrupt lives. Holding onto unexpressed emotions can weigh heavily on the mind. UNSENT bridges that gap—offering a place where your words are honored without the pressure, noise, or consequences of direct transmission.
          </p>
        </section>

        {/* Section 3: Private vs Anonymous Writing */}
        <section className="pt-8 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
            Private Vault vs. Anonymous Expression
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-zinc-800 p-6 space-y-3 bg-zinc-950">
              <span className="text-xs font-mono tracking-widest text-zinc-500 uppercase block">
                01 / PRIVATE VAULT
              </span>
              <h3 className="text-xl font-bold text-white uppercase">Visible Only to You</h3>
              <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
                When saved as <strong>Private</strong>, your writings are locked inside your personal vault. No other user, crawler, or search engine can access or index your private thoughts.
              </p>
            </div>

            <div className="border border-zinc-800 p-6 space-y-3 bg-zinc-950">
              <span className="text-xs font-mono tracking-widest text-zinc-500 uppercase block">
                02 / ANONYMOUS RELEASES
              </span>
              <h3 className="text-xl font-bold text-white uppercase">Shared Without Identity</h3>
              <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
                When published as <strong>Anonymous</strong>, your thought is shared with the community. All author names, emails, and identifiers are completely stripped, preserving total privacy.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Time Capsules */}
        <section className="pt-8 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
            Time Capsules &amp; Digital Memories
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans font-light">
            UNSENT Time Capsules allow you to seal letters and thoughts for the future. You set a unlock date—6 months, 1 year, or 5 years into the future. Sealed capsules remain hidden until the chosen date arrives, offering a powerful tool for reflection and emotional growth.
          </p>
        </section>

        {/* Section 5: Community & Moderation */}
        <section className="pt-8 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
            Empathetic Community &amp; Safety
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans font-light">
            The UNSENT Discover community is built around silent, respectful resonance. Users can offer subtle reactions—such as "Felt This" or "Not Alone"—without toxic comments or performative metrics. Strict community moderation ensures a safe, non-judgmental environment for everyone.
          </p>
        </section>
      </div>

      {/* CTA Footer */}
      <div className="pt-8 border-t border-zinc-800 text-center space-y-4">
        <h3 className="text-xl font-bold uppercase font-sans text-white">Ready to express what you held back?</h3>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => onNavigate('write')}
            className="text-xs font-mono tracking-widest uppercase border border-white px-6 py-3 hover:bg-white hover:text-black transition-colors"
          >
            WRITE NOW →
          </button>
          <button
            onClick={() => onNavigate('discover')}
            className="text-xs font-mono tracking-widest uppercase border border-zinc-800 px-6 py-3 text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors"
          >
            DISCOVER ANONYMOUS WORDS →
          </button>
        </div>
      </div>
    </div>
  );
};

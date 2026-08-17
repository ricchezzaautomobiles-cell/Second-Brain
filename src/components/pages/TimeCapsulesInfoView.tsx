import React from 'react';
import { ActiveTab } from '../../types';

interface ViewProps {
  onNavigate: (tab: ActiveTab) => void;
}

export const TimeCapsulesInfoView: React.FC<ViewProps> = ({ onNavigate }) => {
  const handleNav = (e: React.MouseEvent, tab: ActiveTab) => {
    e.preventDefault();
    onNavigate(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <article className="pt-24 pb-28 max-w-4xl mx-auto px-6 space-y-16 text-white font-sans selection:bg-white selection:text-black">
      {/* Header */}
      <header className="border-b border-white/10 pb-8 space-y-4">
        <span className="text-xs font-mono tracking-[0.3em] uppercase text-zinc-500 block">
          MEMORIES &amp; FUTURE REFLECTION
        </span>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter uppercase font-sans text-white leading-tight">
          Digital Time Capsules &amp; Memories
        </h1>
        <p className="text-base sm:text-lg font-serif italic text-zinc-400 max-w-2xl leading-relaxed">
          Lock away thoughts, goals, and reflections for the future. Unseal them when the time is right.
        </p>
      </header>

      <div className="space-y-12 divide-y divide-zinc-800">
        {/* Section 1: Definition */}
        <section className="pt-8 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
            What is an UNSENT Digital Time Capsule?
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans font-light">
            A <strong>digital time capsule</strong> on UNSENT is a sealed memory vault scheduled to unlock on a specific date in the future. Whether you want to write a letter to your future self, document a pivotal moment in your life, or store <strong>digital memories</strong> that you aren't ready to revisit yet, an <strong>online time capsule</strong> acts as your personal temporal archive.
          </p>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans font-light">
            Until the chosen unlock date arrives, the capsule remains sealed in your vault, preserving your exact mindset and words without modification.
          </p>
        </section>

        {/* Section 2: How It Works */}
        <section className="pt-8 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
            How Digital Time Capsules Work
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-zinc-800 p-6 bg-zinc-950 space-y-2">
              <span className="text-xs font-mono text-zinc-500 uppercase block">STEP 01</span>
              <h3 className="text-lg font-bold text-white uppercase">Compose</h3>
              <p className="text-xs text-zinc-400 font-light leading-relaxed">
                Write your reflection, goals, predictions, or intimate thoughts in the <a href="/write" onClick={(e) => handleNav(e, 'write')} className="text-white underline underline-offset-2">UNSENT editor</a>.
              </p>
            </div>

            <div className="border border-zinc-800 p-6 bg-zinc-950 space-y-2">
              <span className="text-xs font-mono text-zinc-500 uppercase block">STEP 02</span>
              <h3 className="text-lg font-bold text-white uppercase">Seal Date</h3>
              <p className="text-xs text-zinc-400 font-light leading-relaxed">
                Choose an unlock date—6 months, 1 year, 3 years, or 5 years into the future.
              </p>
            </div>

            <div className="border border-zinc-800 p-6 bg-zinc-950 space-y-2">
              <span className="text-xs font-mono text-zinc-500 uppercase block">STEP 03</span>
              <h3 className="text-lg font-bold text-white uppercase">Unseal</h3>
              <p className="text-xs text-zinc-400 font-light leading-relaxed">
                When the target date arrives, your capsule unseals, revealing your past words and perspective.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Value of a Memory Journal */}
        <section className="pt-8 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
            The Psychology and Perspective of a Memory Journal
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans font-light">
            Human memory is naturally malleable—we tend to forget the intensity of how we felt during significant transitions, heartbreaks, or breakthroughs. Maintaining a <strong>memory journal</strong> through time capsules allows you to measure real emotional growth, celebrate resilience, and see how far you have come.
          </p>
        </section>

        {/* Section 4: Connected Features */}
        <section className="pt-8 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
            Complementary Ways to Express Yourself on UNSENT
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans font-light">
            Explore other intentional tools available across the platform:
          </p>
          <ul className="space-y-3 text-sm text-zinc-300 font-light list-disc list-inside">
            <li>
              <a href="/private-journal" onClick={(e) => handleNav(e, 'private-journal')} className="text-white font-medium underline underline-offset-4 hover:text-zinc-300">Private Online Journal</a>: A daily unindexed vault for immediate personal thoughts.
            </li>
            <li>
              <a href="/unsent-messages" onClick={(e) => handleNav(e, 'unsent-messages')} className="text-white font-medium underline underline-offset-4 hover:text-zinc-300">Unsent Messages</a>: Letters and notes written to specific people without sending them.
            </li>
            <li>
              <a href="/anonymous-writing" onClick={(e) => handleNav(e, 'anonymous-writing')} className="text-white font-medium underline underline-offset-4 hover:text-zinc-300">Anonymous Writing</a>: Release selected words to the world with stripped identity.
            </li>
            <li>
              <a href="/anonymous-community" onClick={(e) => handleNav(e, 'anonymous-community')} className="text-white font-medium underline underline-offset-4 hover:text-zinc-300">Anonymous Community</a>: Read what others around the world have quietly felt and expressed.
            </li>
          </ul>
        </section>
      </div>

      {/* Footer CTA */}
      <div className="pt-8 border-t border-zinc-800 text-center space-y-4">
        <h3 className="text-xl font-bold uppercase font-sans text-white">Create a time capsule for your future self</h3>
        <p className="text-xs sm:text-sm text-zinc-400 font-serif italic max-w-md mx-auto">
          Capture what matters today. Revisit it when you are ready.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <a
            href="/capsules"
            onClick={(e) => handleNav(e, 'capsules')}
            className="text-xs font-mono tracking-widest uppercase border border-white px-8 py-3.5 hover:bg-white hover:text-black transition-colors"
          >
            OPEN TIME CAPSULES →
          </a>
          <a
            href="/write"
            onClick={(e) => handleNav(e, 'write')}
            className="text-xs font-mono tracking-widest uppercase border border-zinc-800 px-8 py-3.5 text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors"
          >
            WRITE A NEW ENTRY →
          </a>
        </div>
      </div>
    </article>
  );
};

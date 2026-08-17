import React from 'react';
import { ActiveTab } from '../../types';

interface ViewProps {
  onNavigate: (tab: ActiveTab) => void;
}

export const PrivateJournalView: React.FC<ViewProps> = ({ onNavigate }) => {
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
          PRIVATE ONLINE JOURNAL &amp; SECURITY VAULT
        </span>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter uppercase font-sans text-white leading-tight">
          Private Online Journal &amp; Thought Vault
        </h1>
        <p className="text-base sm:text-lg font-serif italic text-zinc-400 max-w-2xl leading-relaxed">
          Your thoughts belong to you alone. A distraction-free, unindexed digital sanctuary for deep personal reflection.
        </p>
      </header>

      <div className="space-y-12 divide-y divide-zinc-800">
        {/* Section 1: The Vault */}
        <section className="pt-8 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
            What is the UNSENT Private Online Journal?
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans font-light">
            The UNSENT <strong>private online journal</strong> is a distraction-free digital space created specifically for your unsaid words, intimate memories, gratitude notes, and emotional reflections. Unlike traditional blog platforms or public social apps, entries in your <a href="/write" onClick={(e) => handleNav(e, 'write')} className="text-white underline underline-offset-4 hover:text-zinc-300 transition-colors">private journal</a> are sealed inside your personal vault.
          </p>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans font-light">
            Whether you want to draft <a href="/unsent-messages" onClick={(e) => handleNav(e, 'unsent-messages')} className="text-white underline underline-offset-4 hover:text-zinc-300 transition-colors">unsent messages</a> that are never intended for other eyes or keep a quiet daily record of your inner life, your vault remains strictly confidential.
          </p>
        </section>

        {/* Section 2: Complete Search Engine Isolation */}
        <section className="pt-8 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
            Complete Search Engine Isolation &amp; Privacy
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans font-light">
            Privacy is our foremost architecture principle. Your <strong>private thoughts</strong> and journal entries are safeguarded by strict authentication layers:
          </p>
          <ul className="space-y-3 text-sm text-zinc-300 font-light list-disc list-inside">
            <li><strong>Zero Search Engine Crawling:</strong> Personal vault routes enforce <code>noindex, nofollow</code> robot directives, preventing Google, Bing, and web indexers from discovering your entries.</li>
            <li><strong>No Public URL Generation:</strong> Private notes do not generate shareable links or public web endpoints.</li>
            <li><strong>Account Isolation:</strong> Only you can view your vault contents when authenticated via secure Google Sign-In or email credentials.</li>
          </ul>
          <p className="text-sm text-zinc-400 font-light pt-1">
            Read more in our comprehensive <a href="/privacy" onClick={(e) => handleNav(e, 'privacy')} className="text-white underline underline-offset-4 hover:text-zinc-300 transition-colors">Privacy Policy</a>.
          </p>
        </section>

        {/* Section 3: Therapeutic Value */}
        <section className="pt-8 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
            Therapeutic Benefits of a Digital Journal for Unspoken Thoughts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-zinc-800 p-6 space-y-3 bg-zinc-950">
              <h3 className="text-lg font-bold text-white uppercase">Emotional Catharsis</h3>
              <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
                Writing down heavy unspoken thoughts transfers internal pressure onto screen or paper, clearing cognitive overload and granting mental calm.
              </p>
            </div>

            <div className="border border-zinc-800 p-6 space-y-3 bg-zinc-950">
              <h3 className="text-lg font-bold text-white uppercase">Unfiltered Authenticity</h3>
              <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
                Without an audience to impress, likes to tally, or judgment to fear, your writing reveals honest feelings and accelerates self-discovery.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Vault vs Optional Anonymous Release */}
        <section className="pt-8 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
            Connected Ways to Express Yourself on UNSENT
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans font-light">
            You always decide the lifecycle of your writing. In addition to keeping a <strong>digital journal</strong> in your vault, you can:
          </p>
          <ul className="space-y-3 text-sm text-zinc-300 font-light list-disc list-inside">
            <li>
              Try <a href="/anonymous-writing" onClick={(e) => handleNav(e, 'anonymous-writing')} className="text-white font-medium underline underline-offset-4 hover:text-zinc-300">anonymous writing</a> to release selected thoughts to the public without ever exposing your identity.
            </li>
            <li>
              Explore the <a href="/anonymous-community" onClick={(e) => handleNav(e, 'anonymous-community')} className="text-white font-medium underline underline-offset-4 hover:text-zinc-300">anonymous community</a> to read how others process similar unspoken experiences.
            </li>
            <li>
              Lock memories into <a href="/time-capsules" onClick={(e) => handleNav(e, 'time-capsules')} className="text-white font-medium underline underline-offset-4 hover:text-zinc-300">digital time capsules</a> to be unsealed in the months or years ahead.
            </li>
          </ul>
        </section>
      </div>

      {/* Footer CTA */}
      <div className="pt-8 border-t border-zinc-800 text-center space-y-4">
        <h3 className="text-xl font-bold uppercase font-sans text-white">Start your private thought vault today</h3>
        <p className="text-xs sm:text-sm text-zinc-400 font-serif italic max-w-md mx-auto">
          Create an entry for yourself. No ads, no social metrics, no distractions.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <a
            href="/write"
            onClick={(e) => handleNav(e, 'write')}
            className="text-xs font-mono tracking-widest uppercase border border-white px-8 py-3.5 hover:bg-white hover:text-black transition-colors"
          >
            OPEN PRIVATE JOURNAL &amp; WRITE →
          </a>
          <a
            href="/privacy"
            onClick={(e) => handleNav(e, 'privacy')}
            className="text-xs font-mono tracking-widest uppercase border border-zinc-800 px-8 py-3.5 text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors"
          >
            PRIVACY &amp; SECURITY POLICY →
          </a>
        </div>
      </div>
    </article>
  );
};

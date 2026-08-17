import React from 'react';
import { ActiveTab } from '../../types';

interface ViewProps {
  onNavigate: (tab: ActiveTab) => void;
}

export const UnsentMessagesView: React.FC<ViewProps> = ({ onNavigate }) => {
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
          EXPRESSION, CLOSURE &amp; ESSAY
        </span>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter uppercase font-sans text-white leading-tight">
          Unsent Messages — Write What You Never Sent
        </h1>
        <p className="text-base sm:text-lg font-serif italic text-zinc-400 max-w-2xl leading-relaxed">
          The unsent letters, unspoken confessions, unsaid apologies, and quiet goodbyes we carry inside our minds.
        </p>
      </header>

      <div className="space-y-12 divide-y divide-zinc-800">
        {/* Section 1: Definition */}
        <section className="pt-8 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
            What are Unsent Messages?
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans font-light">
            <strong>Unsent messages</strong> are letters, drafts, and reflections written to someone in your life that you choose never to deliver directly. These are the <em>messages you never sent</em>—an unsaid goodbye to an ex, an unacknowledged thank-you, a secret confession to someone you love, or an apology to a friend from years ago.
          </p>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans font-light">
            Whether composed in a moment of intense heartache or during quiet reflection, <em>things I never sent</em> capture genuine emotional snapshots that direct conversations rarely allow.
          </p>
        </section>

        {/* Section 2: Therapeutic Power of Things I Never Said */}
        <section className="pt-8 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
            The Psychology of Writing Without Sending
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans font-light">
            Psychologists and expressive writing therapists have long recognized the immense emotional relief that comes from externalizing <em>things I never said</em>. Composing an unsent letter allows you to process intense feelings honestly without having to worry about how the other person will react, defend themselves, or judge you.
          </p>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans font-light">
            This act gives you genuine closure on your own terms. It untangles unresolved grief, eases anxiety, and frees your mind from repetitive cognitive loops.
          </p>
        </section>

        {/* Section 3: Common Categories */}
        <section className="pt-8 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
            Common Recipients of Unsent Words
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans font-light">
            On UNSENT, people categorize their unsent letters by recipient, helping others across the <a href="/anonymous-community" onClick={(e) => handleNav(e, 'anonymous-community')} className="text-white underline underline-offset-4 hover:text-zinc-300 transition-colors">anonymous community</a> find relatable experiences:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="border border-zinc-800 p-5 bg-zinc-950 space-y-2">
              <span className="text-xs font-mono text-zinc-500 uppercase block">01 / AN EX</span>
              <h3 className="text-sm font-bold text-white uppercase">Words Left Unsaid</h3>
              <p className="text-xs text-zinc-400 font-light leading-relaxed">Processing broken relationships, unsaid apologies, and reaching peace without reopening contact.</p>
            </div>

            <div className="border border-zinc-800 p-5 bg-zinc-950 space-y-2">
              <span className="text-xs font-mono text-zinc-500 uppercase block">02 / SOMEONE YOU LOVE</span>
              <h3 className="text-sm font-bold text-white uppercase">Quiet Confessions</h3>
              <p className="text-xs text-zinc-400 font-light leading-relaxed">Expressing delicate, vulnerable feelings that feel too frightening to speak aloud.</p>
            </div>

            <div className="border border-zinc-800 p-5 bg-zinc-950 space-y-2">
              <span className="text-xs font-mono text-zinc-500 uppercase block">03 / YOURSELF</span>
              <h3 className="text-sm font-bold text-white uppercase">Past or Future Selves</h3>
              <p className="text-xs text-zinc-400 font-light leading-relaxed">Forgiving past mistakes or sealing wisdom in <a href="/time-capsules" onClick={(e) => handleNav(e, 'time-capsules')} className="text-white underline underline-offset-2">digital time capsules</a>.</p>
            </div>
          </div>
        </section>

        {/* Section 4: Vault vs Stream */}
        <section className="pt-8 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
            Keep It Private or Share It Anonymously
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans font-light">
            When you compose an unsent letter on UNSENT, you have total control over where it lives:
          </p>
          <ul className="space-y-3 text-sm text-zinc-300 font-light list-disc list-inside">
            <li>
              <strong>Private Thought Vault:</strong> Store the letter in your <a href="/private-journal" onClick={(e) => handleNav(e, 'private-journal')} className="text-white font-medium underline underline-offset-4 hover:text-zinc-300">private online journal</a>. It remains encrypted, unindexed by search engines, and visible only to your login.
            </li>
            <li>
              <strong>Anonymous Stream:</strong> Publish the letter through our <a href="/anonymous-writing" onClick={(e) => handleNav(e, 'anonymous-writing')} className="text-white font-medium underline underline-offset-4 hover:text-zinc-300">anonymous writing platform</a>. All personal identity is stripped, allowing your words to resonate with readers on the public <a href="/discover" onClick={(e) => handleNav(e, 'discover')} className="text-white font-medium underline underline-offset-4 hover:text-zinc-300">Discover feed</a>.
            </li>
          </ul>
        </section>

        {/* Section 5: Safety & Respect */}
        <section className="pt-8 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
            A Safe Space for Vulnerable Expression
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans font-light">
            Every unsent thought deserves respect. To preserve the sanctuary of the platform, we maintain strict <a href="/community-guidelines" onClick={(e) => handleNav(e, 'community-guidelines')} className="text-white underline underline-offset-4 hover:text-zinc-300 transition-colors">Community Guidelines</a> that ban personal phone numbers, full names, addresses, or targeted harassment. Learn how we handle your security in our <a href="/privacy" onClick={(e) => handleNav(e, 'privacy')} className="text-white underline underline-offset-4 hover:text-zinc-300 transition-colors">Privacy Policy</a>.
          </p>
        </section>
      </div>

      {/* Footer CTA */}
      <div className="pt-8 border-t border-zinc-800 text-center space-y-4">
        <h3 className="text-xl font-bold uppercase font-sans text-white">What letter have you held back?</h3>
        <p className="text-xs sm:text-sm text-zinc-400 font-serif italic max-w-md mx-auto">
          Take five minutes to write down the message you never sent. Feel the lightness of letting it out.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <a
            href="/write"
            onClick={(e) => handleNav(e, 'write')}
            className="text-xs font-mono tracking-widest uppercase border border-white px-8 py-3.5 hover:bg-white hover:text-black transition-colors"
          >
            WRITE YOUR UNSENT MESSAGE →
          </a>
          <a
            href="/discover"
            onClick={(e) => handleNav(e, 'discover')}
            className="text-xs font-mono tracking-widest uppercase border border-zinc-800 px-8 py-3.5 text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors"
          >
            DISCOVER UNSENT LETTERS →
          </a>
        </div>
      </div>
    </article>
  );
};

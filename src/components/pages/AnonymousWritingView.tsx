import React from 'react';
import { ActiveTab } from '../../types';

interface ViewProps {
  onNavigate: (tab: ActiveTab) => void;
}

export const AnonymousWritingView: React.FC<ViewProps> = ({ onNavigate }) => {
  const handleNav = (e: React.MouseEvent, tab: ActiveTab) => {
    e.preventDefault();
    onNavigate(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <article className="pt-24 pb-28 max-w-4xl mx-auto px-6 space-y-16 text-white font-sans selection:bg-white selection:text-black">
      {/* Page Header */}
      <header className="border-b border-white/10 pb-8 space-y-4">
        <span className="text-xs font-mono tracking-[0.3em] uppercase text-zinc-500 block">
          ANONYMOUS WRITING PLATFORM &amp; ESSAY
        </span>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter uppercase font-sans text-white leading-tight">
          Anonymous Writing — Say What You Never Sent
        </h1>
        <p className="text-base sm:text-lg font-serif italic text-zinc-400 max-w-2xl leading-relaxed">
          Express raw thoughts, unspoken feelings, and memories without the weight of identity, social curation, or fear of judgment.
        </p>
      </header>

      <div className="space-y-12 divide-y divide-zinc-800">
        {/* Section 1: Definition */}
        <section className="pt-8 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
            What is Anonymous Writing?
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans font-light">
            <strong>Anonymous writing</strong> is the practice of composing and sharing thoughts, letters, confessions, or reflections without attaching your name, social profile, or personal identifiers. On an <a href="/" onClick={(e) => handleNav(e, 'home')} className="text-white underline underline-offset-4 hover:text-zinc-300 transition-colors">anonymous writing platform</a> like UNSENT, you can <a href="/write" onClick={(e) => handleNav(e, 'write')} className="text-white underline underline-offset-4 hover:text-zinc-300 transition-colors">write anonymously</a> to articulate emotional truths that are difficult or impossible to share in standard social spaces.
          </p>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans font-light">
            When you release words anonymously, your message enters the world purely on its own merits. Readers connect with the raw human emotion of your writing rather than evaluating who wrote it.
          </p>
        </section>

        {/* Section 2: Why Write Anonymously */}
        <section className="pt-8 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
            Why People Choose Anonymous Expression
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans font-light">
            Modern social networks are built around vanity metrics, curated personal branding, and follower counts. This environment often creates friction when trying to discuss delicate experiences like grief, unrequited affection, unspoken apologies, or private dilemmas.
          </p>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans font-light">
            Engaging in <strong>anonymous expression</strong> removes the fear of social retribution or awkwardness. It provides psychological relief by externalizing intense emotional loops, helping writers find closure without reopening painful conversations.
          </p>
        </section>

        {/* Section 3: Anonymity vs Privacy */}
        <section className="pt-8 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
            Anonymity vs. Privacy: Understanding the Difference
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans font-light">
            A key distinction at UNSENT is the fundamental boundary between public anonymity and personal privacy. Both modes are built with deliberate security:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-zinc-800 p-6 space-y-3 bg-zinc-950">
              <span className="text-xs font-mono tracking-widest text-zinc-500 uppercase block">
                PUBLIC STREAM
              </span>
              <h3 className="text-xl font-bold text-white uppercase">Anonymous Posts</h3>
              <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
                <strong>Anonymous posts</strong> are shared to the public <a href="/discover" onClick={(e) => handleNav(e, 'discover')} className="text-white underline underline-offset-4 hover:text-zinc-300 transition-colors">Discover feed</a>. Anyone can read and resonate with them, but all author identity is stripped so no one can trace the writing back to your account or email.
              </p>
            </div>

            <div className="border border-zinc-800 p-6 space-y-3 bg-zinc-950">
              <span className="text-xs font-mono tracking-widest text-zinc-500 uppercase block">
                CONFIDENTIAL VAULT
              </span>
              <h3 className="text-xl font-bold text-white uppercase">Private Journal</h3>
              <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
                Entries saved in your <a href="/private-journal" onClick={(e) => handleNav(e, 'private-journal')} className="text-white underline underline-offset-4 hover:text-zinc-300 transition-colors">private journal</a> remain strictly confidential to your authenticated vault. They are never published, never indexed by search engines, and visible only to you.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: How Identifiers Are Stripped */}
        <section className="pt-8 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
            How UNSENT Strips Author Identifiers
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans font-light">
            When you compose on the UNSENT <a href="/write" onClick={(e) => handleNav(e, 'write')} className="text-white underline underline-offset-4 hover:text-zinc-300 transition-colors">Write canvas</a> and choose to publish anonymously, the system decouples your account metadata. User tokens, email addresses, and author identities are removed before the message is stored in the public feed collection.
          </p>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans font-light">
            This architectural dissociation guarantees that public entries can never be reversed or attributed to an individual user profile.
          </p>
        </section>

        {/* Section 5: Diverse Formats on UNSENT */}
        <section className="pt-8 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
            Explore More Ways to Express Unspoken Words
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans font-light">
            UNSENT offers several focused formats for emotional expression and memory preservation:
          </p>
          <ul className="space-y-3 text-sm text-zinc-300 font-light list-disc list-inside">
            <li>
              <a href="/unsent-messages" onClick={(e) => handleNav(e, 'unsent-messages')} className="text-white font-medium underline underline-offset-4 hover:text-zinc-300">Unsent Messages</a>: Letters, notes, and unsaid confessions written for specific recipients without direct transmission.
            </li>
            <li>
              <a href="/anonymous-community" onClick={(e) => handleNav(e, 'anonymous-community')} className="text-white font-medium underline underline-offset-4 hover:text-zinc-300">Anonymous Community</a>: A calm, supportive feed with silent empathetic resonance reactions.
            </li>
            <li>
              <a href="/private-journal" onClick={(e) => handleNav(e, 'private-journal')} className="text-white font-medium underline underline-offset-4 hover:text-zinc-300">Private Online Journal</a>: A distraction-free personal thought vault protected from public visibility.
            </li>
            <li>
              <a href="/time-capsules" onClick={(e) => handleNav(e, 'time-capsules')} className="text-white font-medium underline underline-offset-4 hover:text-zinc-300">Digital Time Capsules</a>: Sealed letters and memories scheduled to unlock for your future self.
            </li>
          </ul>
        </section>

        {/* Section 6: Safety & Guidelines */}
        <section className="pt-8 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
            Safe Expression &amp; Community Standards
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans font-light">
            Anonymity requires responsibility. To maintain a safe harbor for everyone, all public posts must follow our <a href="/community-guidelines" onClick={(e) => handleNav(e, 'community-guidelines')} className="text-white underline underline-offset-4 hover:text-zinc-300 transition-colors">Community Guidelines</a>. Content involving harassment, personally identifiable information, doxxing, or threats of harm is prohibited and promptly removed. Read our <a href="/privacy" onClick={(e) => handleNav(e, 'privacy')} className="text-white underline underline-offset-4 hover:text-zinc-300 transition-colors">Privacy Policy</a> to learn more about how we safeguard data.
          </p>
        </section>
      </div>

      {/* Call to Action */}
      <div className="pt-8 border-t border-zinc-800 text-center space-y-4">
        <h3 className="text-xl font-bold uppercase font-sans text-white">Ready to express yourself anonymously?</h3>
        <p className="text-xs sm:text-sm text-zinc-400 font-serif italic max-w-md mx-auto">
          Write down the words you've been holding onto. Keep them in your vault or release them into the stream.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <a
            href="/write"
            onClick={(e) => handleNav(e, 'write')}
            className="text-xs font-mono tracking-widest uppercase border border-white px-6 py-3 hover:bg-white hover:text-black transition-colors"
          >
            WRITE ANONYMOUSLY →
          </a>
          <a
            href="/discover"
            onClick={(e) => handleNav(e, 'discover')}
            className="text-xs font-mono tracking-widest uppercase border border-zinc-800 px-6 py-3 text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors"
          >
            DISCOVER ANONYMOUS POSTS →
          </a>
        </div>
      </div>
    </article>
  );
};

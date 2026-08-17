import React from 'react';
import { ActiveTab } from '../../types';

interface ViewProps {
  onNavigate: (tab: ActiveTab) => void;
}

export const AnonymousCommunityView: React.FC<ViewProps> = ({ onNavigate }) => {
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
          COMMUNITY, RESONANCE &amp; DISCOVERY
        </span>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter uppercase font-sans text-white leading-tight">
          Anonymous Community for Unspoken Thoughts
        </h1>
        <p className="text-base sm:text-lg font-serif italic text-zinc-400 max-w-2xl leading-relaxed">
          Connecting through shared, unspoken human experiences without clout, profiles, or noise.
        </p>
      </header>

      <div className="space-y-12 divide-y divide-zinc-800">
        {/* Section 1: Discover Feed */}
        <section className="pt-8 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
            The UNSENT Discover Feed: Quiet Shared Experience
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans font-light">
            The <a href="/discover" onClick={(e) => handleNav(e, 'discover')} className="text-white underline underline-offset-4 hover:text-zinc-300 transition-colors">Discover feed</a> is the heart of the UNSENT <strong>anonymous community</strong>. Here, <strong>anonymous posts</strong> and <strong>anonymous thoughts</strong> shared by people worldwide come together into a quiet tapestry of human vulnerability, unsaid love, nostalgia, and unspoken feelings.
          </p>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans font-light">
            Without profile avatars, follower counts, or vanity metrics, every post stands on its emotional authenticity alone.
          </p>
        </section>

        {/* Section 2: Silent Resonance Reactions */}
        <section className="pt-8 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
            Silent Resonance Over Toxic Comments
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans font-light">
            Traditional social media comment sections often breed judgment, unsolicited advice, or arguments. UNSENT eliminates open comment threads entirely. Instead, readers interact through subtle, empathetic resonance reactions:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 border border-zinc-800 bg-zinc-950 text-center">
              <span className="text-xs font-mono text-zinc-300 uppercase block font-medium">"Felt This"</span>
              <span className="text-[10px] text-zinc-500 font-serif italic">Emotional alignment</span>
            </div>
            <div className="p-3 border border-zinc-800 bg-zinc-950 text-center">
              <span className="text-xs font-mono text-zinc-300 uppercase block font-medium">"Not Alone"</span>
              <span className="text-[10px] text-zinc-500 font-serif italic">Silent solidarity</span>
            </div>
            <div className="p-3 border border-zinc-800 bg-zinc-950 text-center">
              <span className="text-xs font-mono text-zinc-300 uppercase block font-medium">"Understand"</span>
              <span className="text-[10px] text-zinc-500 font-serif italic">Empathy &amp; clarity</span>
            </div>
            <div className="p-3 border border-zinc-800 bg-zinc-950 text-center">
              <span className="text-xs font-mono text-zinc-300 uppercase block font-medium">"Stayed With Me"</span>
              <span className="text-[10px] text-zinc-500 font-serif italic">Deep resonance</span>
            </div>
          </div>
        </section>

        {/* Section 3: Recipient Filtering */}
        <section className="pt-8 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
            Filter by Recipient Categories
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans font-light">
            Explore <strong>anonymous expression</strong> written for specific recipients: <em>Someone I Love</em>, <em>An Ex</em>, <em>Myself</em>, <em>Friend</em>, <em>Family</em>, <em>Someone Who Hurt Me</em>, or <em>Stranger</em>. Reading thoughts left unsaid to someone in a similar situation reveals that whatever you are carrying, you are never truly alone.
          </p>
        </section>

        {/* Section 4: Safe Harbor */}
        <section className="pt-8 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
            Moderation &amp; Safe Harbor
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans font-light">
            Every public entry is protected by strict <a href="/community-guidelines" onClick={(e) => handleNav(e, 'community-guidelines')} className="text-white underline underline-offset-4 hover:text-zinc-300 transition-colors">Community Guidelines</a>. Doxxing, personal phone numbers, harassment, and harmful content are filtered and removed to keep UNSENT a peaceful sanctuary. Read our <a href="/privacy" onClick={(e) => handleNav(e, 'privacy')} className="text-white underline underline-offset-4 hover:text-zinc-300 transition-colors">Privacy Policy</a> to understand how identity decoupling works.
          </p>
        </section>

        {/* Section 5: Explore More Features */}
        <section className="pt-8 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
            Explore More Ways to Engage with UNSENT
          </h2>
          <ul className="space-y-3 text-sm text-zinc-300 font-light list-disc list-inside">
            <li>
              <a href="/anonymous-writing" onClick={(e) => handleNav(e, 'anonymous-writing')} className="text-white font-medium underline underline-offset-4 hover:text-zinc-300">Anonymous Writing</a>: Understand how our platform strips identifiers before publishing.
            </li>
            <li>
              <a href="/unsent-messages" onClick={(e) => handleNav(e, 'unsent-messages')} className="text-white font-medium underline underline-offset-4 hover:text-zinc-300">Unsent Messages</a>: Discover letters written to past partners, loved ones, and friends.
            </li>
            <li>
              <a href="/private-journal" onClick={(e) => handleNav(e, 'private-journal')} className="text-white font-medium underline underline-offset-4 hover:text-zinc-300">Private Online Journal</a>: Keep your personal reflections in your secure, unindexed vault.
            </li>
            <li>
              <a href="/time-capsules" onClick={(e) => handleNav(e, 'time-capsules')} className="text-white font-medium underline underline-offset-4 hover:text-zinc-300">Digital Time Capsules</a>: Seal memories to be unsealed in future years.
            </li>
          </ul>
        </section>
      </div>

      {/* Footer CTA */}
      <div className="pt-8 border-t border-zinc-800 text-center space-y-4">
        <h3 className="text-xl font-bold uppercase font-sans text-white">Explore anonymous writings from around the world</h3>
        <p className="text-xs sm:text-sm text-zinc-400 font-serif italic max-w-md mx-auto">
          Read unspoken messages shared by others, or contribute your own anonymous reflection.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <a
            href="/discover"
            onClick={(e) => handleNav(e, 'discover')}
            className="text-xs font-mono tracking-widest uppercase border border-white px-8 py-3.5 hover:bg-white hover:text-black transition-colors"
          >
            ENTER DISCOVER FEED →
          </a>
          <a
            href="/write"
            onClick={(e) => handleNav(e, 'write')}
            className="text-xs font-mono tracking-widest uppercase border border-zinc-800 px-8 py-3.5 text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors"
          >
            WRITE ANONYMOUSLY →
          </a>
        </div>
      </div>
    </article>
  );
};

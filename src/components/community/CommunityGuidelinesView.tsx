import React from 'react';

export const CommunityGuidelinesView: React.FC = () => {
  return (
    <div className="pt-24 pb-28 max-w-4xl mx-auto px-6 space-y-12 text-white font-sans selection:bg-white selection:text-black">
      <header className="border-b border-white/10 pb-8 space-y-3">
        <span className="text-xs font-mono tracking-[0.3em] uppercase text-zinc-500 block">
          SAFE EXPRESSION &amp; RESPECT
        </span>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tighter uppercase font-sans text-white">
          COMMUNITY GUIDELINES.
        </h1>
        <p className="text-xs text-zinc-400 font-mono uppercase max-w-xl">
          Maintaining a quiet, respectful sanctuary for genuine human emotion.
        </p>
      </header>

      <div className="space-y-10 divide-y divide-zinc-800">
        <section className="pt-6 space-y-3">
          <h2 className="text-xl font-bold uppercase tracking-tight text-white">1. Respect &amp; Empathy</h2>
          <p className="text-sm text-zinc-300 font-light leading-relaxed">
            UNSENT is built for honest vulnerability. When reading anonymous posts from others, approach them with quiet empathy. Understand that behind every unsent letter is a genuine human experience.
          </p>
        </section>

        <section className="pt-6 space-y-3">
          <h2 className="text-xl font-bold uppercase tracking-tight text-white">2. No Doxxing or Personal Data Exposure</h2>
          <p className="text-sm text-zinc-300 font-light leading-relaxed">
            Do not include phone numbers, home addresses, full legal names of private individuals, or personal social media handles in public anonymous messages. Expression should focus on feelings, reflections, and thoughts—not targeted harassment.
          </p>
        </section>

        <section className="pt-6 space-y-3">
          <h2 className="text-xl font-bold uppercase tracking-tight text-white">3. Silent Resonance Over Toxic Noise</h2>
          <p className="text-sm text-zinc-300 font-light leading-relaxed">
            UNSENT replaces comment sections and flame wars with meaningful, silent reaction chips ("Felt This", "Not Alone", "Understand", "Stayed With Me"). This protects writers from unsolicited critique or judgment.
          </p>
        </section>

        <section className="pt-6 space-y-3">
          <h2 className="text-xl font-bold uppercase tracking-tight text-white">4. Reporting &amp; Content Moderation</h2>
          <p className="text-sm text-zinc-300 font-light leading-relaxed">
            If you encounter an anonymous post that contains dangerous, illegal, or abusive content, use the built-in Report feature on the card. Reported posts are immediately flagged for moderation review.
          </p>
        </section>
      </div>
    </div>
  );
};

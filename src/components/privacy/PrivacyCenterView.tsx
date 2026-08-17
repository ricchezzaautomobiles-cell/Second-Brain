import React from 'react';

export const PrivacyCenterView: React.FC = () => {
  return (
    <div className="pt-24 pb-28 max-w-4xl mx-auto px-6 space-y-12 text-white font-mono selection:bg-white selection:text-black">
      {/* Editorial Header */}
      <div className="border-b border-white/10 pb-8 space-y-3">
        <span className="text-xs tracking-[0.3em] uppercase text-zinc-500 block">
          TRANSPARENCY & DATA ARCHITECTURE
        </span>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tighter uppercase font-sans text-white">
          UNSENT PRIVACY VAULT.
        </h1>
        <p className="text-xs text-zinc-400 uppercase max-w-xl">
          Complete transparency on encryption, row-level security, and data isolation.
        </p>
      </div>

      {/* Pillars List */}
      <div className="space-y-12 divide-y divide-zinc-800">
        {/* Private Messages */}
        <div className="pt-8 space-y-3">
          <span className="text-xs text-zinc-500 uppercase tracking-widest block">01 / PRIVATE MESSAGES</span>
          <h3 className="text-2xl font-bold font-sans text-white uppercase tracking-tight">
            ROW LEVEL SECURITY ISOLATION
          </h3>
          <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed">
            Private messages are stored in PostgreSQL with strict Row Level Security (RLS) policies. Only your authenticated session can query or retrieve your records. No third party or admin interface exposes private vaults.
          </p>
        </div>

        {/* Anonymous Release */}
        <div className="pt-8 space-y-3">
          <span className="text-xs text-zinc-500 uppercase tracking-widest block">02 / ANONYMOUS RELEASES</span>
          <h3 className="text-2xl font-bold font-sans text-white uppercase tracking-tight">
            ZERO METADATA LEAKAGE
          </h3>
          <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed">
            When releasing thoughts anonymously, all user IDs, emails, avatar URLs, and personal identifiers are completely stripped. Community queries return pure text and reaction counts without user references.
          </p>
        </div>

        {/* Time Capsule Vault */}
        <div className="pt-8 space-y-3">
          <span className="text-xs text-zinc-500 uppercase tracking-widest block">03 / TIME CAPSULE VAULT</span>
          <h3 className="text-2xl font-bold font-sans text-white uppercase tracking-tight">
            ENCRYPTED UNTIL UNLOCK DATE
          </h3>
          <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed">
            Sealed time capsules are locked until the timestamp expires. Backend query filters mask capsule text prior to unlock date, preventing premature reading via network inspect tools or client manipulation.
          </p>
        </div>

        {/* AI Analysis */}
        <div className="pt-8 space-y-3">
          <span className="text-xs text-zinc-500 uppercase tracking-widest block">04 / SERVER-SIDE GEMINI AI</span>
          <h3 className="text-2xl font-bold font-sans text-white uppercase tracking-tight">
            TRANSIENT PROCESSING
          </h3>
          <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed">
            Emotional breakdown requests are processed transiently via secure server-side API routes powered by Gemini 3.6 Flash. API credentials never leak to the client browser.
          </p>
        </div>

        {/* Permanent Deletion */}
        <div className="pt-8 space-y-3">
          <span className="text-xs text-zinc-500 uppercase tracking-widest block">05 / PERMANENT DELETION</span>
          <h3 className="text-2xl font-bold font-sans text-white uppercase tracking-tight">
            CASCADE HARD DELETES
          </h3>
          <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed">
            When deleting a message or closing an account, database rows are permanently wiped from disk. We maintain zero hidden shadow archives.
          </p>
        </div>
      </div>
    </div>
  );
};

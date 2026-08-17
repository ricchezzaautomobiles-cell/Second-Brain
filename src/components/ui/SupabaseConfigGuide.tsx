import React, { useState } from 'react';
import { Database, Copy, Check, ExternalLink, ShieldAlert, Code2 } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

const SQL_MIGRATION = `-- UNSENT Complete Database Schema Migration
-- Run this in your Supabase SQL Editor (SQL Editor -> New Query)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view public profile info" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. UNSENT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.unsent_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    visibility TEXT NOT NULL CHECK (visibility IN ('private', 'anonymous', 'deleted')),
    recipient_category TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    released_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ
);
ALTER TABLE public.unsent_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read their own messages" ON public.unsent_messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Public can read anonymous released messages" ON public.unsent_messages FOR SELECT USING (visibility = 'anonymous');
CREATE POLICY "Users can insert their own messages" ON public.unsent_messages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own messages" ON public.unsent_messages FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own messages" ON public.unsent_messages FOR DELETE USING (auth.uid() = user_id);

-- 3. EMOTIONS & REACTION TABLES
CREATE TABLE IF NOT EXISTS public.emotions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL
);
ALTER TABLE public.emotions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view emotions" ON public.emotions FOR SELECT USING (true);

INSERT INTO public.emotions (name) VALUES
    ('Love'), ('Regret'), ('Anger'), ('Hope'), ('Fear'), ('Goodbye'), ('Gratitude'), ('Missing'), ('Forgiveness')
ON CONFLICT (name) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID REFERENCES public.unsent_messages(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    reaction_type TEXT NOT NULL CHECK (reaction_type IN ('felt_this', 'not_alone', 'understand', 'stayed_with_me')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (message_id, user_id, reaction_type)
);
ALTER TABLE public.reactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view reactions" ON public.reactions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can add reactions" ON public.reactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove their own reactions" ON public.reactions FOR DELETE USING (auth.uid() = user_id);

-- 4. TIME CAPSULES TABLE
CREATE TABLE IF NOT EXISTS public.time_capsules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    unlock_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    opened_at TIMESTAMPTZ,
    sealed BOOLEAN DEFAULT true NOT NULL,
    reflection TEXT,
    would_send TEXT,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.time_capsules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read their own time capsules" ON public.time_capsules FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own time capsules" ON public.time_capsules FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own time capsules" ON public.time_capsules FOR UPDATE USING (auth.uid() = user_id);

-- 5. AI ANALYSES & REPORTS
CREATE TABLE IF NOT EXISTS public.ai_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    message_id UUID REFERENCES public.unsent_messages(id) ON DELETE SET NULL,
    analysis_type TEXT NOT NULL,
    result JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.ai_analyses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read their own AI analyses" ON public.ai_analyses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own AI analyses" ON public.ai_analyses FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID REFERENCES public.unsent_messages(id) ON DELETE CASCADE NOT NULL,
    reporter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    reason TEXT NOT NULL,
    details TEXT,
    status TEXT DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can submit reports" ON public.reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);
`;

export const SupabaseConfigGuide: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopySql = () => {
    navigator.clipboard.writeText(SQL_MIGRATION);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      {/* Banner */}
      <div className="bg-zinc-950 border-b border-zinc-800 px-4 py-2.5 text-xs text-zinc-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 font-mono">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-white shrink-0" />
            <span>
              <strong className="font-semibold text-white">DATABASE CONFIGURATION:</strong> Set your Supabase credentials in <code className="bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded text-white">.env.example</code> to enable cloud persistence.
            </span>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="shrink-0 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white px-2.5 py-1 rounded font-medium transition-all flex items-center gap-1 uppercase text-[11px]"
          >
            <Database className="h-3.5 w-3.5" />
            Setup Guide
          </button>
        </div>
      </div>

      {/* Modal Guide */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="SUPABASE DATABASE CONFIGURATION" maxWidth="lg">
        <div className="space-y-4 font-mono text-xs text-zinc-300">
          <p className="text-zinc-300 leading-relaxed font-sans text-sm">
            UNSENT is a real production platform that requires a connected Supabase backend to securely store private messages, manage RLS policies, and enable anonymous releases.
          </p>

          <div className="rounded-xl border border-zinc-800 bg-black/40 p-3.5 space-y-2 text-xs">
            <div className="font-semibold text-white flex items-center gap-1.5 uppercase">
              <Code2 className="h-4 w-4" /> Environment Variables Required
            </div>
            <pre className="text-zinc-300 font-mono bg-zinc-950 p-2.5 rounded border border-zinc-800 overflow-x-auto">
{`VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key"`}
            </pre>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-white text-sm uppercase">Step-by-Step Setup:</h4>
            <ol className="list-decimal list-inside text-xs space-y-1.5 text-zinc-300">
              <li>Create a free project at <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-white underline inline-flex items-center gap-0.5">supabase.com <ExternalLink className="h-3 w-3" /></a></li>
              <li>Navigate to <strong>Project Settings → API</strong> and copy your Project URL & Anon Key.</li>
              <li>Open <strong>SQL Editor</strong> in Supabase, click <strong>New Query</strong>, paste the SQL below, and click <strong>Run</strong>.</li>
            </ol>
          </div>

          <div className="pt-2">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-zinc-300 uppercase">Database SQL Migration Script</span>
              <Button size="sm" variant="outline" onClick={handleCopySql} icon={copied ? <Check className="h-3.5 w-3.5 text-white" /> : <Copy className="h-3.5 w-3.5" />}>
                {copied ? 'Copied to Clipboard!' : 'Copy SQL Script'}
              </Button>
            </div>
            <textarea
              readOnly
              value={SQL_MIGRATION}
              className="w-full h-40 bg-black font-mono text-[11px] text-zinc-300 p-3 rounded border border-zinc-800 resize-none focus:outline-none"
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

-- UNSENT Database Schema & Row Level Security Policies
-- Migration: 20260811000000_unsent_schema.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-------------------------------------------------------
-- 1. PROFILES TABLE
-------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view public profile info"
    ON public.profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-------------------------------------------------------
-- 2. UNSENT MESSAGES TABLE
-------------------------------------------------------
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

-- Owner can read all their own messages (private, anonymous, or deleted)
CREATE POLICY "Users can read their own messages"
    ON public.unsent_messages FOR SELECT
    USING (auth.uid() = user_id);

-- Anyone (including anonymous community) can read released anonymous messages
CREATE POLICY "Public can read anonymous released messages"
    ON public.unsent_messages FOR SELECT
    USING (visibility = 'anonymous');

-- Users can create messages assigned to themselves
CREATE POLICY "Users can insert their own messages"
    ON public.unsent_messages FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own messages
CREATE POLICY "Users can update their own messages"
    ON public.unsent_messages FOR UPDATE
    USING (auth.uid() = user_id);

-- Users can delete their own messages
CREATE POLICY "Users can delete their own messages"
    ON public.unsent_messages FOR DELETE
    USING (auth.uid() = user_id);

-------------------------------------------------------
-- 3. EMOTIONS TABLE
-------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.emotions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL
);

ALTER TABLE public.emotions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view emotions"
    ON public.emotions FOR SELECT
    USING (true);

-- Seed emotions
INSERT INTO public.emotions (name) VALUES
    ('Love'),
    ('Regret'),
    ('Anger'),
    ('Hope'),
    ('Fear'),
    ('Goodbye'),
    ('Gratitude'),
    ('Missing'),
    ('Forgiveness')
ON CONFLICT (name) DO NOTHING;

-------------------------------------------------------
-- 4. MESSAGE EMOTIONS TABLE
-------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.message_emotions (
    message_id UUID REFERENCES public.unsent_messages(id) ON DELETE CASCADE,
    emotion_id UUID REFERENCES public.emotions(id) ON DELETE CASCADE,
    PRIMARY KEY (message_id, emotion_id)
);

ALTER TABLE public.message_emotions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view message emotions for visible messages"
    ON public.message_emotions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.unsent_messages
            WHERE id = message_emotions.message_id
            AND (user_id = auth.uid() OR visibility = 'anonymous')
        )
    );

CREATE POLICY "Owners can link emotions to their messages"
    ON public.message_emotions FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.unsent_messages
            WHERE id = message_emotions.message_id
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Owners can delete message emotions"
    ON public.message_emotions FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.unsent_messages
            WHERE id = message_emotions.message_id
            AND user_id = auth.uid()
        )
    );

-------------------------------------------------------
-- 5. REACTIONS TABLE
-------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID REFERENCES public.unsent_messages(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    reaction_type TEXT NOT NULL CHECK (reaction_type IN ('felt_this', 'not_alone', 'understand', 'stayed_with_me')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (message_id, user_id, reaction_type)
);

ALTER TABLE public.reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reactions"
    ON public.reactions FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can add reactions"
    ON public.reactions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own reactions"
    ON public.reactions FOR DELETE
    USING (auth.uid() = user_id);

-------------------------------------------------------
-- 6. TIME CAPSULES TABLE
-------------------------------------------------------
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

CREATE POLICY "Users can read their own time capsules"
    ON public.time_capsules FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own time capsules"
    ON public.time_capsules FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own time capsules"
    ON public.time_capsules FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own time capsules"
    ON public.time_capsules FOR DELETE
    USING (auth.uid() = user_id);

-------------------------------------------------------
-- 7. AI ANALYSES TABLE
-------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    message_id UUID REFERENCES public.unsent_messages(id) ON DELETE SET NULL,
    analysis_type TEXT NOT NULL,
    result JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.ai_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own AI analyses"
    ON public.ai_analyses FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own AI analyses"
    ON public.ai_analyses FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own AI analyses"
    ON public.ai_analyses FOR DELETE
    USING (auth.uid() = user_id);

-------------------------------------------------------
-- 8. REPORTS TABLE (For Moderation)
-------------------------------------------------------
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

CREATE POLICY "Users can submit reports"
    ON public.reports FOR INSERT
    WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can view their own reports"
    ON public.reports FOR SELECT
    USING (auth.uid() = reporter_id);

-------------------------------------------------------
-- 9. TRIGGER FOR AUTOMATIC PROFILE CREATION ON SIGNUP
-------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, display_name, avatar_url)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'display_name', 'Anonymous Writer'),
        new.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-------------------------------------------------------
-- 10. INDEXES FOR HIGH-PERFORMANCE DISCOVER FEED
-------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_unsent_messages_visibility_released
    ON public.unsent_messages (visibility, released_at DESC);

CREATE INDEX IF NOT EXISTS idx_reactions_message_id
    ON public.reactions (message_id);

CREATE INDEX IF NOT EXISTS idx_time_capsules_user_unlock
    ON public.time_capsules (user_id, unlock_at);

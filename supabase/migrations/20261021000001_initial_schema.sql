-- ==============================================================================
-- B'Day Made With Love - Supabase Database Schema Migration
-- Migration: 001_initial_schema.sql
-- ==============================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. PROFILES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, display_name, avatar_url)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
        new.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 2. BIRTHDAY EXPERIENCES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.birthday_experiences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    recipient_name TEXT NOT NULL,
    sender_name TEXT,
    slug TEXT UNIQUE,
    theme_id TEXT NOT NULL DEFAULT 'pink-scrapbook',
    theme_settings JSONB NOT NULL DEFAULT '{}'::jsonb,
    intro_settings JSONB NOT NULL DEFAULT '{"style": "gift-box", "recipient_name": "", "teaser_text": "A special surprise awaits you...", "greeting": "Happy Birthday!"}'::jsonb,
    sections JSONB NOT NULL DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_birthday_experiences_owner_id ON public.birthday_experiences(owner_id);
CREATE INDEX IF NOT EXISTS idx_birthday_experiences_slug ON public.birthday_experiences(slug);
CREATE INDEX IF NOT EXISTS idx_birthday_experiences_status ON public.birthday_experiences(status);

-- ------------------------------------------------------------------------------
-- 3. MEMORIES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.memories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    memory_type TEXT NOT NULL CHECK (memory_type IN ('photo', 'video', 'text', 'audio', 'joke', 'quote', 'date', 'milestone', 'letter', 'song')),
    title TEXT NOT NULL,
    description TEXT,
    media_asset_id UUID,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_memories_owner_id ON public.memories(owner_id);
CREATE INDEX IF NOT EXISTS idx_memories_type ON public.memories(memory_type);

-- ------------------------------------------------------------------------------
-- 4. MEDIA ASSETS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.media_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    public_path TEXT,
    media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video', 'audio', 'document')),
    file_name TEXT NOT NULL,
    file_size BIGINT NOT NULL DEFAULT 0,
    mime_type TEXT NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_media_assets_owner_id ON public.media_assets(owner_id);

-- Add foreign key constraint to memories after media_assets exists
ALTER TABLE public.memories 
    DROP CONSTRAINT IF EXISTS fk_memories_media_asset,
    ADD CONSTRAINT fk_memories_media_asset 
    FOREIGN KEY (media_asset_id) REFERENCES public.media_assets(id) ON DELETE SET NULL;

-- Also support memory_assets flat table as used in MemoriesPage CRUD
CREATE TABLE IF NOT EXISTS public.memory_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('photo', 'video', 'audio', 'text')),
    file_url TEXT,
    text_content TEXT,
    file_size BIGINT,
    mime_type TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_memory_assets_owner ON public.memory_assets(owner_id);
CREATE INDEX IF NOT EXISTS idx_memory_assets_type ON public.memory_assets(type);

-- ------------------------------------------------------------------------------
-- 5. EXPERIENCE MEMORIES JOIN TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.experience_memories (
    experience_id UUID NOT NULL REFERENCES public.birthday_experiences(id) ON DELETE CASCADE,
    memory_id UUID NOT NULL REFERENCES public.memories(id) ON DELETE CASCADE,
    section_id TEXT,
    display_order INT NOT NULL DEFAULT 0,
    caption_override TEXT,
    config_override JSONB,
    PRIMARY KEY (experience_id, memory_id)
);

CREATE INDEX IF NOT EXISTS idx_exp_memories_exp_id ON public.experience_memories(experience_id);
CREATE INDEX IF NOT EXISTS idx_exp_memories_mem_id ON public.experience_memories(memory_id);

-- ------------------------------------------------------------------------------
-- 6. TIMELINE ENTRIES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.timeline_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    experience_id UUID NOT NULL REFERENCES public.birthday_experiences(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    story TEXT,
    date TEXT,
    photo_url TEXT,
    location TEXT,
    icon TEXT,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_timeline_entries_exp_id ON public.timeline_entries(experience_id);

-- ------------------------------------------------------------------------------
-- 7. AUTO-UPDATE UPDATED_AT TRIGGER
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

CREATE TRIGGER tr_birthday_experiences_updated_at
    BEFORE UPDATE ON public.birthday_experiences
    FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

CREATE TRIGGER tr_memories_updated_at
    BEFORE UPDATE ON public.memories
    FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

CREATE TRIGGER tr_memory_assets_updated_at
    BEFORE UPDATE ON public.memory_assets
    FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

CREATE TRIGGER tr_timeline_entries_updated_at
    BEFORE UPDATE ON public.timeline_entries
    FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

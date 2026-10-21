-- ==============================================================================
-- B'Day Made With Love - Row Level Security (RLS) & Storage Migration
-- Migration: 002_rls_and_storage.sql
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. ENABLE ROW LEVEL SECURITY
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.birthday_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memory_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_entries ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 2. PROFILES POLICIES
-- ------------------------------------------------------------------------------
-- Anyone authenticated can view any profile (for recipient/creator tags)
CREATE POLICY "Public profiles are viewable by everyone" 
    ON public.profiles FOR SELECT 
    USING (true);

-- Users can only insert/update their own profile
CREATE POLICY "Users can insert their own profile" 
    ON public.profiles FOR INSERT 
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id) 
    WITH CHECK (auth.uid() = id);

-- ------------------------------------------------------------------------------
-- 3. BIRTHDAY EXPERIENCES POLICIES
-- ------------------------------------------------------------------------------
-- Owners can view all their own experiences (both draft and published)
CREATE POLICY "Owners can view their own experiences" 
    ON public.birthday_experiences FOR SELECT 
    USING (auth.uid() = owner_id);

-- Anyone can view published experiences with a slug (for public page /birthday/:slug)
CREATE POLICY "Public can view published experiences" 
    ON public.birthday_experiences FOR SELECT 
    USING (status = 'published' AND slug IS NOT NULL);

-- Owners can insert, update, and delete their own experiences
CREATE POLICY "Owners can create experiences" 
    ON public.birthday_experiences FOR INSERT 
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their own experiences" 
    ON public.birthday_experiences FOR UPDATE 
    USING (auth.uid() = owner_id) 
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their own experiences" 
    ON public.birthday_experiences FOR DELETE 
    USING (auth.uid() = owner_id);

-- ------------------------------------------------------------------------------
-- 4. MEMORIES & MEMORY ASSETS POLICIES
-- ------------------------------------------------------------------------------
-- Users have full CRUD over their own memories
CREATE POLICY "Users can view their own memories" 
    ON public.memories FOR SELECT 
    USING (auth.uid() = owner_id);

CREATE POLICY "Users can create their own memories" 
    ON public.memories FOR INSERT 
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own memories" 
    ON public.memories FOR UPDATE 
    USING (auth.uid() = owner_id) 
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own memories" 
    ON public.memories FOR DELETE 
    USING (auth.uid() = owner_id);

-- memory_assets flat table
CREATE POLICY "Users can view their own memory_assets" 
    ON public.memory_assets FOR SELECT 
    USING (auth.uid() = owner_id);

CREATE POLICY "Users can create their own memory_assets" 
    ON public.memory_assets FOR INSERT 
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own memory_assets" 
    ON public.memory_assets FOR UPDATE 
    USING (auth.uid() = owner_id) 
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own memory_assets" 
    ON public.memory_assets FOR DELETE 
    USING (auth.uid() = owner_id);

-- media_assets table
CREATE POLICY "Users can view their own media_assets" 
    ON public.media_assets FOR SELECT 
    USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert their own media_assets" 
    ON public.media_assets FOR INSERT 
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own media_assets" 
    ON public.media_assets FOR UPDATE 
    USING (auth.uid() = owner_id) 
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own media_assets" 
    ON public.media_assets FOR DELETE 
    USING (auth.uid() = owner_id);

-- ------------------------------------------------------------------------------
-- 5. EXPERIENCE MEMORIES JOIN & TIMELINE ENTRIES POLICIES
-- ------------------------------------------------------------------------------
-- Can view if owner of experience OR if the experience is published
CREATE POLICY "Access experience memories if owner or published" 
    ON public.experience_memories FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.birthday_experiences be 
            WHERE be.id = experience_id 
            AND (be.owner_id = auth.uid() OR (be.status = 'published' AND be.slug IS NOT NULL))
        )
    );

CREATE POLICY "Owners can manage experience memories" 
    ON public.experience_memories FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM public.birthday_experiences be 
            WHERE be.id = experience_id AND be.owner_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.birthday_experiences be 
            WHERE be.id = experience_id AND be.owner_id = auth.uid()
        )
    );

-- Timeline entries
CREATE POLICY "Access timeline entries if owner or published" 
    ON public.timeline_entries FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.birthday_experiences be 
            WHERE be.id = experience_id 
            AND (be.owner_id = auth.uid() OR (be.status = 'published' AND be.slug IS NOT NULL))
        )
    );

CREATE POLICY "Owners can manage timeline entries" 
    ON public.timeline_entries FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM public.birthday_experiences be 
            WHERE be.id = experience_id AND be.owner_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.birthday_experiences be 
            WHERE be.id = experience_id AND be.owner_id = auth.uid()
        )
    );

-- ------------------------------------------------------------------------------
-- 6. STORAGE BUCKETS SETUP & POLICIES
-- ------------------------------------------------------------------------------
-- Insert storage buckets if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('memories', 'memories', true),
    ('public-media', 'public-media', true),
    ('private-media', 'private-media', false)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

-- Storage Policies for 'memories' bucket
CREATE POLICY "Authenticated users can upload memories"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'memories' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update their uploaded memories"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'memories' AND auth.uid() = owner);

CREATE POLICY "Authenticated users can delete their uploaded memories"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'memories' AND auth.uid() = owner);

CREATE POLICY "Anyone can view public memories files"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'memories');

-- Storage Policies for 'public-media' bucket
CREATE POLICY "Authenticated users can upload to public-media"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'public-media' AND auth.role() = 'authenticated');

CREATE POLICY "Anyone can read public-media"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'public-media');

CREATE POLICY "Authenticated users can delete from public-media"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'public-media' AND auth.uid() = owner);

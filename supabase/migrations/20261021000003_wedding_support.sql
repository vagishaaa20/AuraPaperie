-- ==============================================================================
-- B'Day & Wedding Celebration Platform - Wedding Support & RSVP System
-- Migration: 20261021000003_wedding_support.sql
-- ==============================================================================

-- 1. Add project_type column to birthday_experiences (defaults to 'birthday')
ALTER TABLE public.birthday_experiences
    ADD COLUMN IF NOT EXISTS project_type TEXT NOT NULL DEFAULT 'birthday' CHECK (project_type IN ('birthday', 'wedding'));

CREATE INDEX IF NOT EXISTS idx_birthday_experiences_project_type ON public.birthday_experiences(project_type);

-- 2. CREATE WEDDING RSVPS TABLE
CREATE TABLE IF NOT EXISTS public.wedding_rsvps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    experience_id UUID NOT NULL REFERENCES public.birthday_experiences(id) ON DELETE CASCADE,
    guest_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    attendance TEXT NOT NULL CHECK (attendance IN ('attending', 'declined', 'tentative')),
    guest_count INT NOT NULL DEFAULT 1,
    attending_events TEXT[] DEFAULT '{}',
    meal_preference TEXT,
    dietary_notes TEXT,
    message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_wedding_rsvps_exp_id ON public.wedding_rsvps(experience_id);

-- 3. ROW LEVEL SECURITY (RLS) FOR WEDDING RSVPS
ALTER TABLE public.wedding_rsvps ENABLE ROW LEVEL SECURITY;

-- Project Owners can view all RSVP responses submitted for their invitations
CREATE POLICY "Owners can view RSVPs for their projects"
    ON public.wedding_rsvps FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.birthday_experiences be
            WHERE be.id = experience_id AND be.owner_id = auth.uid()
        )
    );

-- Project Owners can delete/manage RSVPs
CREATE POLICY "Owners can delete RSVPs for their projects"
    ON public.wedding_rsvps FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.birthday_experiences be
            WHERE be.id = experience_id AND be.owner_id = auth.uid()
        )
    );

-- Public / Guests can insert RSVPs for published wedding invitations without logging in
CREATE POLICY "Public guests can submit RSVPs to published invitations"
    ON public.wedding_rsvps FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.birthday_experiences be
            WHERE be.id = experience_id AND be.status = 'published' AND be.slug IS NOT NULL
        )
    );

-- Trigger to auto-update updated_at for wedding_rsvps
CREATE TRIGGER tr_wedding_rsvps_updated_at
    BEFORE UPDATE ON public.wedding_rsvps
    FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

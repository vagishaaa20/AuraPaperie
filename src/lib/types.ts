// ─── Supabase Database Types ───────────────────────────────────────────────

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: Profile
                Insert: Partial<Profile> & Record<string, any>
                Update: Partial<Profile> & Record<string, any>
            }
            birthday_experiences: {
                Row: BirthdayExperience
                Insert: Partial<BirthdayExperience> & Record<string, any>
                Update: Partial<BirthdayExperience> & Record<string, any>
            }
            memories: {
                Row: Memory
                Insert: Partial<Memory> & Record<string, any>
                Update: Partial<Memory> & Record<string, any>
            }
            media_assets: {
                Row: MediaAsset
                Insert: Partial<MediaAsset> & Record<string, any>
                Update: Partial<MediaAsset> & Record<string, any>
            }
            experience_memories: {
                Row: ExperienceMemory
                Insert: Partial<ExperienceMemory> & Record<string, any>
                Update: Partial<ExperienceMemory> & Record<string, any>
            }
            timeline_entries: {
                Row: TimelineEntry
                Insert: Partial<TimelineEntry> & Record<string, any>
                Update: Partial<TimelineEntry> & Record<string, any>
            }
            wedding_rsvps: {
                Row: WeddingRsvpSubmission
                Insert: Partial<WeddingRsvpSubmission> & Record<string, any>
                Update: Partial<WeddingRsvpSubmission> & Record<string, any>
            }
        }
        Views: Record<string, never>
        Functions: Record<string, never>
        Enums: Record<string, never>
    }
}

// ─── Profile ────────────────────────────────────────────────────────────────

export interface Profile {
    id: string
    display_name: string | null
    avatar_url: string | null
    created_at: string
    updated_at: string
}

// ─── Birthday Experience ─────────────────────────────────────────────────────

export type ExperienceStatus = 'draft' | 'published'

export type ThemeId =
    | 'pink-scrapbook'
    | 'lavender-dreams'
    | 'vintage-journal'
    | 'romantic-letterbook'
    | 'playful-bestie'
    | 'botanical-garden'
    | 'midnight-magic'
    | 'golden-hour'
    | 'starlit-cinema'
    | 'minimalist-elegance'

export type ProjectType = 'birthday' | 'wedding'

export type SectionType =
    | 'surprise-intro'
    | 'birthday-hero'
    | 'memory-scrapbook'
    | 'our-story'
    | 'things-i-love'
    | 'birthday-letter'
    | 'birthday-cake'
    | 'hidden-surprise'
    | 'music-player'
    | 'cinematic-reel'
    | 'final-message'
    // Wedding Sections
    | 'wedding-cover'
    | 'wedding-couple'
    | 'wedding-events'
    | 'wedding-message'
    | 'wedding-countdown'
    | 'wedding-venue'
    | 'wedding-rsvp'
    | 'wedding-info'
    | 'wedding-cta'
    | 'wedding-dress-code'
    | 'wedding-travel'
    | 'wedding-faq'

export type IntroStyle =
    | 'gift-box'
    | 'sealed-letter'
    | 'hidden-polaroid'
    | 'unwrap'
    | 'secret-door'
    | 'cinematic-reveal'
    | 'simple-intro'

export interface SectionConfig {
    id: string
    type: SectionType
    visible: boolean
    order: number
    config: any
}

export interface IntroSettings {
    style: IntroStyle
    recipient_name: string
    teaser_text: string
    greeting: string
    background_color?: string
    photo_url?: string
    animation_speed?: 'slow' | 'normal' | 'fast'
    enable_sound?: boolean
    skip_enabled?: boolean
}

export interface ThemeSettings {
    theme_id: ThemeId
    accent_color?: string
    heading_font?: string
    body_font?: string
    animation_intensity?: 'minimal' | 'normal' | 'full'
    photo_layout?: 'polaroid' | 'collage' | 'grid' | 'filmstrip'
    custom_decorations?: string[]
}

export interface BirthdayExperience {
    id: string
    owner_id: string
    project_type?: ProjectType
    title: string
    recipient_name: string
    sender_name: string | null
    slug: string | null
    theme_id: ThemeId
    theme_settings: ThemeSettings
    intro_settings: IntroSettings
    sections: SectionConfig[]
    status: ExperienceStatus
    published_at: string | null
    created_at: string
    updated_at: string
}

// ─── Memory ──────────────────────────────────────────────────────────────────

export type MemoryType =
    | 'photo'
    | 'video'
    | 'text'
    | 'audio'
    | 'joke'
    | 'quote'
    | 'date'
    | 'milestone'
    | 'letter'
    | 'song'

export interface MemoryMetadata {
    location?: string
    mood?: string
    tags?: string[]
    color?: string
    date?: string
    url?: string       // For external songs
    duration?: number  // For audio/video
    width?: number     // For photos
    height?: number    // For photos
}

export interface Memory {
    id: string
    owner_id: string
    project_type?: ProjectType
    memory_type: MemoryType
    title: string
    description: string | null
    media_asset_id: string | null
    metadata: MemoryMetadata
    created_at: string
    updated_at: string
}

export interface MemoryWithAsset extends Memory {
    media_asset?: MediaAsset | null
}

// ─── Media Asset ─────────────────────────────────────────────────────────────

export type MediaType = 'image' | 'video' | 'audio' | 'document'

export interface MediaAsset {
    id: string
    owner_id: string
    project_type?: ProjectType
    storage_path: string
    public_path: string | null  // path in the public bucket (after publishing)
    media_type: MediaType
    file_name: string
    file_size: number
    mime_type: string
    metadata: Json
    created_at: string
}

// ─── Experience Memory (join) ─────────────────────────────────────────────────

export interface ExperienceMemory {
    experience_id: string
    memory_id: string
    section_id: string | null
    display_order: number
    caption_override: string | null
    config_override: Json | null
}

// ─── Timeline Entry ───────────────────────────────────────────────────────────

export interface TimelineEntry {
    id: string
    experience_id: string
    title: string
    story: string | null
    date: string | null
    photo_url: string | null
    location: string | null
    icon: string | null
    display_order: number
    created_at: string
    updated_at: string
}

// ─── Theme System ─────────────────────────────────────────────────────────────

export interface ThemePalette {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
    textMuted: string
    border: string
    highlight: string
}

export interface ThemeTypography {
    headingFont: string
    bodyFont: string
    accentFont: string    // Handwriting / special font
    headingWeight: string
    letterSpacing?: string
    // Short-hand aliases used by public section components
    heading?: string
    body?: string
    accent?: string       // alias for accentFont
}

export interface ThemePhotoFrame {
    style: 'polaroid' | 'rounded' | 'shadow' | 'border' | 'filmstrip'
    borderColor?: string
    captionStyle?: string
    rotation?: boolean
}

export interface ThemeDecorations {
    pattern?: string
    particles?: string[]   // emoji / svg ids
    shapes?: string[]
    enableStickers?: boolean
    enableDoodles?: boolean
    enableConfetti?: boolean
}

export interface ThemeAnimationPreset {
    intro: 'fade' | 'slide' | 'scale' | 'cinematic'
    transitions: 'smooth' | 'snappy' | 'playful'
    intensity: 'minimal' | 'normal' | 'full'
    reducedMotionFallback: 'fade' | 'none'
}

export interface ThemeConfig {
    id: ThemeId
    name: string
    description: string
    style: 'scrapbook' | 'cinematic'
    palette: ThemePalette
    typography: ThemeTypography
    photoFrame: ThemePhotoFrame
    decorations: ThemeDecorations | string[]  // allow simple string[] for emoji
    animation: ThemeAnimationPreset
    previewGradient: string
    photoLayout?: 'polaroid' | 'collage' | 'grid' | 'filmstrip'
}

// ─── UI / Form Types ──────────────────────────────────────────────────────────

export interface AuthUser {
    id: string
    email: string | undefined
    profile?: Profile | null
}

export interface DashboardProject extends BirthdayExperience {
    thumbnail_url?: string | null
}

export interface UploadProgress {
    file: File
    progress: number
    status: 'pending' | 'uploading' | 'done' | 'error'
    error?: string
    asset?: MediaAsset
}

export interface PublishValidation {
    valid: boolean
    errors: string[]
}

// ─── Memory Asset (flat table used by Memory Library) ─────────────────────────
// This is the shape returned from the `memory_assets` Supabase table
export interface MemoryAsset {
    id: string
    owner_id: string
    project_type?: ProjectType
    title: string
    type: 'photo' | 'video' | 'audio' | 'text'
    file_url: string | null
    text_content: string | null
    file_size: number | null
    mime_type: string | null
    tags: string[]
    created_at: string
    updated_at?: string
}




// --- Wedding Specific Types ---------------------------------------------------
export interface WeddingEvent {
    id: string
    name: string
    date: string
    time?: string
    venue_name: string
    address?: string
    description?: string
    dress_code?: string
    photo_url?: string
    [key: string]: any
}

export interface WeddingRsvpSubmission {
    id: string
    experience_id: string
    guest_name: string
    email?: string
    phone?: string
    attendance: 'attending' | 'declined' | 'tentative'
    guest_count: number
    attending_events: string[]
    meal_preference?: string
    dietary_notes?: string
    message?: string
    created_at: string
}

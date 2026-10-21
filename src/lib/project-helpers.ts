import { supabase } from './supabase'
import type { BirthdayExperience, ProjectType, SectionConfig, ThemeId, WeddingRsvpSubmission } from './types'
import { generateId, generateSlug } from './utils'

/**
 * Determine the project type of an experience (fallback to examining sections or settings)
 */
export function getProjectType(exp: Partial<BirthdayExperience> | null | undefined): ProjectType {
    if (!exp) return 'birthday'
    if (exp.project_type) return exp.project_type
    const themeSettings = exp.theme_settings as Record<string, unknown> | undefined
    if (themeSettings?.project_type === 'wedding') return 'wedding'
    const introSettings = exp.intro_settings as Record<string, unknown> | undefined
    if (introSettings?.project_type === 'wedding') return 'wedding'
    if (exp.sections?.some(s => s.type?.startsWith('wedding-'))) return 'wedding'
    return 'birthday'
}

/**
 * Default starter sections for a customizable wedding invitation
 */
export function getDefaultWeddingSections(partner1 = 'Partner 1', partner2 = 'Partner 2'): SectionConfig[] {
    return [
        {
            id: generateId(),
            type: 'wedding-cover',
            visible: true,
            order: 0,
            config: {
                partner1_name: partner1,
                partner2_name: partner2,
                title: 'The Wedding Celebration Of',
                wedding_date: 'December 18, 2026',
                wedding_time: '4:00 PM',
                venue_city: 'Napa Valley, California',
                button_text: 'Open Invitation',
                subtitle: 'Together with our families, we joyfully invite you',
                opening_style: 'wax-seal',
            },
        },
        {
            id: generateId(),
            type: 'wedding-couple',
            visible: true,
            order: 1,
            config: {
                title: 'Two Hearts, One Journey',
                partner1_name: partner1,
                partner2_name: partner2,
                partner1_bio: 'A lover of sunsets, spontaneous road trips, and warm cups of chai.',
                partner2_bio: 'An architect of dreams, avid reader, and the calm in every storm.',
                our_story: 'From our very first conversation over coffee to stargazing on mountaintops, we discovered a love that felt like coming home. Every laugh, adventure, and quiet moment brought us to this sacred promise.',
                layout: 'side-by-side',
                partner1_photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
                partner2_photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
                couple_photo: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop',
                host_names: 'With the blessings of our parents and families',
            },
        },
        {
            id: generateId(),
            type: 'wedding-message',
            visible: true,
            order: 2,
            config: {
                heading: 'A Cordial Invitation',
                quote: '“Whatever our souls are made of, his and mine are the same.”',
                body: 'Because you have shared in our lives with your love and friendship, we invite you to join us as we celebrate our marriage and embark on the most beautiful chapter of our lives.',
                font_style: 'serif',
                align: 'center',
            },
        },
        {
            id: generateId(),
            type: 'wedding-events',
            visible: true,
            order: 3,
            config: {
                title: 'Wedding Events & Celebrations',
                subtitle: 'Join us across our sacred rituals and jubilant festivities',
                events: [
                    {
                        id: generateId(),
                        name: 'Mehendi & Sangeet',
                        date: 'December 17, 2026',
                        time: '5:30 PM Onwards',
                        venue_name: 'The Orchid Courtyard',
                        address: '100 Sunset Blvd, Napa Valley, CA',
                        description: 'An evening of henna, music, vibrant dances, and celebration.',
                        dress_code: 'Festive & Colorful Traditional',
                    },
                    {
                        id: generateId(),
                        name: 'Wedding Ceremony',
                        date: 'December 18, 2026',
                        time: '11:00 AM',
                        venue_name: 'The Grand Pavilion',
                        address: '100 Sunset Blvd, Napa Valley, CA',
                        description: 'The auspicious vows and sacred union surrounded by nature.',
                        dress_code: 'Formal Traditional / Elegant Attire',
                    },
                    {
                        id: generateId(),
                        name: 'Evening Reception & Dinner',
                        date: 'December 18, 2026',
                        time: '7:00 PM',
                        venue_name: 'The Crystal Ballroom',
                        address: '100 Sunset Blvd, Napa Valley, CA',
                        description: 'Toasts, grand dining, and dancing under the stars.',
                        dress_code: 'Black Tie / Evening Glamour',
                    },
                ],
            },
        },
        {
            id: generateId(),
            type: 'wedding-countdown',
            visible: true,
            order: 4,
            config: {
                title: 'Counting Down to Forever',
                target_date: '2026-12-18T11:00:00',
                display_style: 'classic',
                show_seconds: true,
            },
        },
        {
            id: generateId(),
            type: 'wedding-venue',
            visible: true,
            order: 5,
            config: {
                title: 'Venue & Directions',
                venue_name: 'The Grand Heritage Estate',
                address: '100 Sunset Boulevard',
                city: 'Napa Valley, California 94558',
                map_url: 'https://maps.google.com/?q=Napa+Valley+Estate',
                parking_info: 'Valet parking is complimentary at the main gate. Shuttles run continuously from partner hotels.',
                arrival_notes: 'Guests are kindly requested to arrive 30 minutes prior to ceremony start.',
                button_text: 'Open in Google Maps',
            },
        },
        {
            id: generateId(),
            type: 'wedding-rsvp',
            visible: true,
            order: 6,
            config: {
                enabled: true,
                title: 'Will You Grace Us With Your Presence?',
                subtitle: 'Kindly RSVP by November 15, 2026 so we can reserve your seats.',
                deadline: 'November 15, 2026',
                require_email: false,
                require_phone: false,
                enable_guest_count: true,
                max_guests: 5,
                enable_meal_pref: true,
                meal_options: ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Jain'],
                enable_dietary_notes: true,
                confirmation_message: 'Thank you! We can’t wait to celebrate this special day with you! 💕',
            },
        },
        {
            id: generateId(),
            type: 'wedding-cta',
            visible: true,
            order: 7,
            config: {
                partner1_name: partner1,
                partner2_name: partner2,
                heading: 'We Can’t Wait to Celebrate With You!',
                message: 'Your love, prayers, and presence mean the world to us as we begin our forever.',
                show_rsvp_button: true,
                show_calendar_button: true,
            },
        },
    ]
}

/**
 * Resiliently inserts an experience record into Supabase.
 * If the remote Supabase database does not have the `project_type` column yet,
 * it retries without the column while persisting `project_type` in JSONB settings.
 */
export async function resilientInsertExperience(payload: Record<string, any>) {
    const projectType = payload.project_type || 'birthday'
    const enriched = {
        ...payload,
        theme_settings: {
            ...(payload.theme_settings || {}),
            project_type: projectType,
        },
        intro_settings: {
            ...(payload.intro_settings || {}),
            project_type: projectType,
        },
    }

    // Try normal insert
    const res1 = await (supabase.from('birthday_experiences') as any)
        .insert(enriched)
        .select()
        .single()

    if (!res1.error) {
        return res1
    }

    // If column `project_type` doesn't exist on remote DB (400 Bad Request, PGRST204 or 42703)
    const errMsg = (res1.error.message || '').toLowerCase()
    if (errMsg.includes('project_type') || res1.error.code === 'PGRST204' || res1.error.code === '42703' || res1.error.code === '400') {
        const { project_type, ...withoutCol } = enriched as any as any
        const res2 = await (supabase.from('birthday_experiences') as any)
            .insert(withoutCol)
            .select()
            .single()
        return res2
    }

    return res1
}

/**
 * Resiliently updates an experience record in Supabase.
 */
export async function resilientUpdateExperience(id: string, updates: Record<string, any>) {
    const projectType = updates.project_type || 'birthday'
    const enriched = {
        ...updates,
        theme_settings: {
            ...(updates.theme_settings || {}),
            project_type: projectType,
        },
        intro_settings: {
            ...(updates.intro_settings || {}),
            project_type: projectType,
        },
    }

    const res1 = await (supabase.from('birthday_experiences') as any)
        .update(enriched)
        .eq('id', id)

    if (!res1.error) return res1

    const errMsg = (res1.error.message || '').toLowerCase()
    if (errMsg.includes('project_type') || res1.error.code === 'PGRST204' || res1.error.code === '42703') {
        const { project_type, ...withoutCol } = enriched as any
        return await (supabase.from('birthday_experiences') as any)
            .update(withoutCol)
            .eq('id', id)
    }

    return res1
}

/**
 * Local storage key prefix for fallback RSVPs if Supabase table is not yet migrated
 */
const RSVP_FALLBACK_KEY = 'wedding_rsvps_fallback_'

export async function submitWeddingRsvp(submission: {
    experience_id: string
    guest_name: string
    email?: string
    phone?: string
    attendance: 'attending' | 'declined' | 'tentative'
    guest_count: number
    attending_events?: string[]
    meal_preference?: string
    dietary_notes?: string
    message?: string
}): Promise<{ success: boolean; error?: string }> {
    try {
        const { error } = await (supabase.from('wedding_rsvps') as any).insert({
            experience_id: submission.experience_id,
            guest_name: submission.guest_name,
            email: submission.email || null,
            phone: submission.phone || null,
            attendance: submission.attendance,
            guest_count: submission.guest_count,
            attending_events: submission.attending_events || [],
            meal_preference: submission.meal_preference || null,
            dietary_notes: submission.dietary_notes || null,
            message: submission.message || null,
        })

        if (!error) return { success: true }

        // Fallback to storing in localStorage if table public.wedding_rsvps is not in DB yet
        console.warn('Supabase wedding_rsvps insert failed, saving to local fallback:', error.message)
        const savedList: any[] = JSON.parse(localStorage.getItem(RSVP_FALLBACK_KEY + submission.experience_id) || '[]')
        savedList.push({
            id: generateId(),
            ...submission,
            created_at: new Date().toISOString(),
        })
        localStorage.setItem(RSVP_FALLBACK_KEY + submission.experience_id, JSON.stringify(savedList))
        return { success: true }
    } catch (e: any) {
        // Fallback save
        const savedList: any[] = JSON.parse(localStorage.getItem(RSVP_FALLBACK_KEY + submission.experience_id) || '[]')
        savedList.push({
            id: generateId(),
            ...submission,
            created_at: new Date().toISOString(),
        })
        localStorage.setItem(RSVP_FALLBACK_KEY + submission.experience_id, JSON.stringify(savedList))
        return { success: true }
    }
}

export async function fetchWeddingRsvps(experienceId: string): Promise<WeddingRsvpSubmission[]> {
    const localFallback: WeddingRsvpSubmission[] = JSON.parse(
        localStorage.getItem(RSVP_FALLBACK_KEY + experienceId) || '[]'
    )

    try {
        const { data, error } = await (supabase.from('wedding_rsvps') as any)
            .select('*')
            .eq('experience_id', experienceId)
            .order('created_at', { ascending: false })

        if (!error && Array.isArray(data)) {
            // Merge with local fallback if any exists
            const existingIds = new Set(data.map((d: any) => d.id))
            const uniqueFallbacks = localFallback.filter(f => !existingIds.has(f.id))
            return [...data, ...uniqueFallbacks] as WeddingRsvpSubmission[]
        }
    } catch {
        // use fallback
    }

    return localFallback
}

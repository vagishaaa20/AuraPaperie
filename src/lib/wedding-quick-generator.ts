import type { ThemeId, SectionConfig, WeddingEvent } from './types'
import { generateId, generateSlug } from './utils'

export interface WeddingQuickCreateOptions {
    partner1Name: string
    partner2Name: string
    weddingDate?: string
    venueName?: string
    address?: string
    city?: string
    themeId?: ThemeId
    tone?: 'traditional' | 'romantic' | 'modern' | 'cultural' | 'elegant'
    includeEvents?: boolean
    rsvpDeadline?: string
}

const DEFAULT_WEDDING_PHOTOS = [
    {
        url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop',
        caption: 'Walking hand in hand toward forever 💍',
    },
    {
        url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000&auto=format&fit=crop',
        caption: 'The moment two families became one ✨',
    },
    {
        url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1000&auto=format&fit=crop',
        caption: 'Laughter, joy, and blessed beginnings 🌸',
    },
    {
        url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1000&auto=format&fit=crop',
        caption: 'May our days be as sweet as this journey 🥂',
    },
]

export function generateQuickWeddingExperience(options: WeddingQuickCreateOptions) {
    const partner1 = options.partner1Name?.trim() || 'Aarav'
    const partner2 = options.partner2Name?.trim() || 'Meera'
    const weddingDate = options.weddingDate?.trim() || 'December 18, 2026'
    const venue = options.venueName?.trim() || 'The Grand Heritage Palace'
    const address = options.address?.trim() || (options.city ? `Grand Ballroom, ${options.city}` : '100 Sunset Boulevard, Napa Valley, CA')
    const themeId: ThemeId = options.themeId || (options.tone === 'romantic' ? 'romantic-letterbook' : options.tone === 'cultural' ? 'golden-hour' : 'minimalist-elegance')
    const deadline = options.rsvpDeadline?.trim() || 'November 15, 2026'

    const defaultEvents: WeddingEvent[] = [
        {
            id: generateId(),
            name: 'Welcome Dinner & Sangeet',
            date: weddingDate,
            time: '6:00 PM',
            venue_name: venue,
            address: address,
            description: 'An evening of music, dancing, and heartfelt celebrations with our closest family and friends.',
            dress_code: 'Festive / Traditional Cocktail',
        },
        {
            id: generateId(),
            name: 'Wedding Ceremony',
            date: weddingDate,
            time: '11:00 AM',
            venue_name: venue,
            address: address,
            description: 'Join us as we exchange vows and embark on our lifelong journey together.',
            dress_code: 'Formal Traditional / Black Tie Optional',
        },
        {
            id: generateId(),
            name: 'Dinner Reception',
            date: weddingDate,
            time: '7:30 PM',
            venue_name: venue,
            address: address,
            description: 'Dinner, toasts, and dancing under the stars into the night.',
            dress_code: 'Black Tie / Evening Formal',
        },
    ]

    const sections: SectionConfig[] = [
        // 1. Wedding Cover
        {
            id: generateId(),
            type: 'wedding-cover',
            visible: true,
            order: 0,
            config: {
                partner1_name: partner1,
                partner2_name: partner2,
                wedding_date: weddingDate,
                tagline: 'Together with their families, invite you to share in the joy of their marriage',
            },
        },
        // 2. The Couple
        {
            id: generateId(),
            type: 'wedding-couple',
            visible: true,
            order: 1,
            config: {
                partner1_name: partner1,
                partner2_name: partner2,
                story: 'Two souls with but a single thought, two hearts that beat as one. We cannot wait to celebrate with the people who mean the world to us.',
                couple_photo: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop',
            },
        },
        // 3. Wedding Events & Schedule
        {
            id: generateId(),
            type: 'wedding-events',
            visible: true,
            order: 2,
            config: {
                title: 'Events & Celebrations',
                subtitle: 'Kindly join us in celebrating each auspicious moment',
                events: defaultEvents,
            },
        },
        // 4. Live Countdown
        {
            id: generateId(),
            type: 'wedding-countdown',
            visible: true,
            order: 3,
            config: {
                title: 'Counting Down to Forever',
                wedding_date: weddingDate,
                target_date: '2026-12-18T11:00:00',
            },
        },
        // 5. Wedding Photo Gallery
        {
            id: generateId(),
            type: 'memory-scrapbook',
            visible: true,
            order: 4,
            config: {
                title: 'Our Journey in Pictures 📸',
                subtitle: 'Glimpses of love, laughter, and milestones along the way',
                photos: DEFAULT_WEDDING_PHOTOS,
            },
        },
        // 6. Venue & Directions
        {
            id: generateId(),
            type: 'wedding-venue',
            visible: true,
            order: 5,
            config: {
                venue_name: venue,
                address: address,
                parking_info: 'Complimentary valet parking available on site.',
            },
        },
        // 7. Wedding RSVP
        {
            id: generateId(),
            type: 'wedding-rsvp',
            visible: true,
            order: 6,
            config: {
                title: 'Will You Join Us?',
                subtitle: 'Kindly respond by the date below so we may reserve your seats.',
                deadline: deadline,
            },
        },
        // 8. Closing CTA
        {
            id: generateId(),
            type: 'wedding-cta',
            visible: true,
            order: 7,
            config: {
                partner1_name: partner1,
                partner2_name: partner2,
                message: 'Your presence, blessings, and love are the greatest gifts we could ever ask for.',
            },
        },
    ]

    const title = `${partner1} & ${partner2}'s Wedding Invitation`
    const slug = `${generateSlug(`${partner1}-and-${partner2}`)}-wedding-${Math.random().toString(36).slice(2, 6)}`

    return {
        project_type: 'wedding' as const,
        title,
        recipient_name: `${partner1} & ${partner2}`,
        sender_name: null,
        slug,
        theme_id: themeId,
        theme_settings: {
            theme_id: themeId,
            animation_intensity: 'normal',
            photo_layout: 'polaroid',
        },
        intro_settings: {
            style: 'simple-intro' as const,
            recipient_name: `${partner1} & ${partner2}`,
            teaser_text: 'You are cordially invited to celebrate our wedding...',
            greeting: `${partner1} & ${partner2}`,
            skip_enabled: true,
        },
        sections,
    }
}

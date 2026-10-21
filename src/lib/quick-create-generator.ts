import type { ThemeId, SectionConfig } from './types'
import { generateId, generateSlug } from './utils'

export type RelationshipType =
    | 'friend'
    | 'best-friend'
    | 'partner'
    | 'sibling'
    | 'parent'
    | 'family'
    | 'other'

export type BirthdayTone =
    | 'heartfelt'
    | 'cute'
    | 'funny'
    | 'playful'
    | 'romantic'
    | 'elegant'

export type GiftFormat =
    | 'complete'
    | 'scrapbook'
    | 'cinematic'

export interface QuickCreateOptions {
    recipientName?: string
    senderName?: string
    relationship?: RelationshipType
    tone?: BirthdayTone
    themeId?: ThemeId
    format?: GiftFormat
}

// ─── Curated High-Reliability Unsplash Birthday & Celebration Visuals ─────────
export const CELEBRATION_ASSETS = {
    hero: [
        {
            url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1000&auto=format&fit=crop',
            caption: 'Sparklers & Confetti Magic',
        },
        {
            url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1000&auto=format&fit=crop',
            caption: 'Birthday Balloons Celebration',
        },
        {
            url: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=1000&auto=format&fit=crop',
            caption: 'Birthday Wishes & Sweet Cake',
        },
    ],
    scrapbook: [
        {
            url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800&auto=format&fit=crop',
            caption: 'Making wishes upon golden sparkles ✨',
        },
        {
            url: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=800&auto=format&fit=crop',
            caption: 'Laughter, joy, and unforgettable celebrations 🎉',
        },
        {
            url: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=800&auto=format&fit=crop',
            caption: 'Wrapped with boundless love and care 🎁',
        },
        {
            url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800&auto=format&fit=crop',
            caption: 'Floating on sunshine and birthday cheer 🎈',
        },
        {
            url: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=800&auto=format&fit=crop',
            caption: 'A year sweeter than icing on a cake 🎂',
        },
    ],
    reel: [
        {
            url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1200&auto=format&fit=crop',
            title: 'A New Chapter Begins',
            caption: 'Celebrating another spectacular trip around the sun',
            duration: 4,
        },
        {
            url: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=1200&auto=format&fit=crop',
            title: 'Joy in Every Moment',
            caption: 'Surrounded by laughter, warmth, and lifelong smiles',
            duration: 4,
        },
        {
            url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1200&auto=format&fit=crop',
            title: 'Endless Horizons Ahead',
            caption: 'May this year bring your biggest dreams to life',
            duration: 4,
        },
        {
            url: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=1200&auto=format&fit=crop',
            title: 'Happy Birthday!',
            caption: 'Here is to celebrating you today and always',
            duration: 4,
        },
    ],
}

// ─── Tone & Relationship Content Generators ───────────────────────────────────

function getIntroTeaser(recipient: string, tone: BirthdayTone): string {
    switch (tone) {
        case 'funny':
            return `Alert! Someone who refused to get older has a special surprise waiting...`
        case 'romantic':
            return `A little bundle of love and joy, wrapped up just for you, my dearest ${recipient}...`
        case 'cute':
            return `Psst... ${recipient}! A box full of sparkles, sweet hugs, and wishes awaits you! 🌸`
        case 'playful':
            return `Hold on tight! We put together something extra fun for your big day!`
        case 'elegant':
            return `A bespoke birthday celebration curated in honor of your special day.`
        case 'heartfelt':
        default:
            return `A hand-crafted celebration filled with love and warmth for your special day...`
    }
}

function getHeroSubtitle(recipient: string, tone: BirthdayTone, rel: RelationshipType): string {
    if (tone === 'funny') return `Another year wiser, cooler, and still tolerating my shenanigans!`
    if (tone === 'romantic') return `To the one who makes every single day feel like pure magic.`
    if (tone === 'cute') return `Wishing the brightest, happiest, most wonderful birthday ever!`
    if (rel === 'parent') return `Thank you for your infinite love, strength, and guiding light.`
    if (rel === 'best-friend') return `To my partner in crime, confidant, and favorite human on earth!`
    return `Today the spotlight is on you! Wishing you endless joy, laughter, and celebration.`
}

function getThingsILoveItems(recipient: string, tone: BirthdayTone, rel: RelationshipType) {
    if (tone === 'funny') {
        return [
            { emoji: '🍕', text: 'You always share your food (even when you pretend you will not)' },
            { emoji: '😂', text: 'Your laugh is completely contagious and lights up any room' },
            { emoji: '👑', text: 'How you can turn the most boring situation into an adventure' },
            { emoji: '📱', text: 'You answer my 2 AM weird texts without questioning my sanity' },
            { emoji: '⭐', text: 'You are completely unapologetically yourself, and that is rare' },
            { emoji: '🎂', text: 'You never judge how many slices of cake we consume' },
        ]
    }

    if (tone === 'romantic' || rel === 'partner') {
        return [
            { emoji: '💖', text: 'The gentle warmth in your eyes when you look at me' },
            { emoji: '✨', text: 'How you make every ordinary day feel like an extraordinary adventure' },
            { emoji: '🌟', text: 'Your soft laugh that instantly melts away all of my worries' },
            { emoji: '☕', text: 'Our quiet mornings together and simple moments of peace' },
            { emoji: '💫', text: 'Your endless kindness, empathy, and beautiful generous heart' },
            { emoji: '🌹', text: 'Simply being in your presence feels like coming home' },
        ]
    }

    if (rel === 'parent' || rel === 'family') {
        return [
            { emoji: '🏡', text: 'The safe, loving home and foundation you have always given me' },
            { emoji: '🌿', text: 'Your infinite wisdom and patient guidance through every step' },
            { emoji: '💛', text: 'How you put family above everything with quiet grace' },
            { emoji: '🍲', text: 'The warmth, comfort, and care you effortlessly pour into our lives' },
            { emoji: '✨', text: 'The countless sacrifices you made that I will forever be grateful for' },
            { emoji: '🌻', text: 'Your proud smile that gives me strength in everything I do' },
        ]
    }

    // Default heartfelt / best-friend
    return [
        { emoji: '💫', text: 'Your radiant energy that brightens up even the cloudiest days' },
        { emoji: '🤗', text: 'How you genuinely listen and make everyone feel truly valued' },
        { emoji: '☕', text: 'All the late-night heart-to-heart talks and shared secrets' },
        { emoji: '🌻', text: 'Your resilience, courage, and inspiring positivity' },
        { emoji: '🎉', text: 'The effortless fun and unforgettable memories we share' },
        { emoji: '⭐', text: 'Being the most loyal, thoughtful, and genuine person I know' },
    ]
}

function getLetterContent(recipient: string, sender: string | null, tone: BirthdayTone, rel: RelationshipType) {
    const salutation = `Dearest ${recipient},`
    const signature = sender ? `With all my love & gratitude,\n${sender} ❤️` : 'With all my love ❤️'

    if (tone === 'funny') {
        return {
            salutation,
            body: `Happy Birthday! Another 365 days of you being an absolute legend.\n\nI wanted to make something truly special to commemorate your grand entry into another year of greatness. Thank you for always being there to laugh at things we definitely shouldn't laugh at, for tolerating all my weird quirks, and for simply being one of the best parts of my life.\n\nMay your day be filled with delicious treats, zero awkward small talk, and tons of love. Eat the biggest slice of cake, make an impossible wish, and remember: you're not getting older, you're just leveling up!\n\nCheers to you and many more adventures ahead!`,
            signature,
        }
    }

    if (tone === 'romantic' || rel === 'partner') {
        return {
            salutation,
            body: `Happy Birthday to the love of my life.\n\nEvery day with you is a gift, but today is the most special of all because it brought you into this world. Looking back at our memories, my heart is overflowing with gratitude for your tenderness, your gentle touch, and the endless joy you bring into my universe.\n\nYou have made my world softer, brighter, and infinitely more beautiful. As you blow out your candles today, know that having you in my life is the greatest wish I could have ever asked for.\n\nMay this year shower you with all the peace, happiness, and grand adventures your heart desires. I love you more than words could ever measure.`,
            signature,
        }
    }

    if (rel === 'parent') {
        return {
            salutation,
            body: `Happy Birthday! Today is a day to celebrate the incredible, selfless, and loving person you are.\n\nThank you for every sacrifice, every word of comfort, and every gentle lesson you've shared throughout the years. You've taught me how to walk with kindness, integrity, and courage. There is no compass in this world more steady than your love.\n\nI hope today brings you the same deep joy, peace, and warmth that you so effortlessly give to everyone around you. Thank you for everything you are.`,
            signature,
        }
    }

    // Default Heartfelt
    return {
        salutation,
        body: `Happy Birthday! Today is all about celebrating you and the beautiful light you bring into this world.\n\nI wanted to take a moment to pause and remind you how cherished and deeply valued you are. Your presence makes life so much brighter, and having you by my side is one of my greatest blessings. Through every high and low, your genuine warmth, your honesty, and your kindness stand out like a beacon.\n\nAs you embark on this new year of your life, I hope you are met with doors swinging wide open, dreams taking flight, and moments of quiet, peaceful happiness. Take today to celebrate how far you have come and get excited for all the wonder that still lies ahead.\n\nYou deserve the entire world today and every day.`,
        signature,
    }
}

function getTimelineEntries(recipient: string, rel: RelationshipType) {
    return [
        {
            icon: '🌱',
            title: 'Where It All Began',
            date: 'Chapter One',
            story: 'The first time our paths crossed. Who would have known how important you would become in my life?',
        },
        {
            icon: '☕',
            title: 'Late Night Chats & Endless Laughter',
            date: 'Sweet Memories',
            story: 'From spontaneous coffee runs to hours of laughing until our stomachs hurt.',
        },
        {
            icon: '🚀',
            title: 'Adventures & Milestones',
            date: 'Growing Together',
            story: 'Cheering each other on through every victory, big and small, and always having each other\'s backs.',
        },
        {
            icon: '🎂',
            title: 'Celebrating Today',
            date: 'Here & Now',
            story: `Standing here today celebrating you, your growth, and the wonderful human you continue to be. Happy Birthday, ${recipient}!`,
        },
    ]
}

// ─── Master Quick-Create Generator ─────────────────────────────────────────────

export function generateQuickBirthdayExperience(options: QuickCreateOptions) {
    const recipient = options.recipientName?.trim() || 'My Favorite Human'
    const sender = options.senderName?.trim() || null
    const rel = options.relationship || 'best-friend'
    const tone = options.tone || 'heartfelt'
    const themeId: ThemeId = options.themeId || (tone === 'romantic' ? 'romantic-letterbook' : tone === 'cute' ? 'lavender-dreams' : tone === 'elegant' ? 'midnight-magic' : 'pink-scrapbook')
    const format = options.format || 'complete'

    const letter = getLetterContent(recipient, sender, tone, rel)
    const thingsILove = getThingsILoveItems(recipient, tone, rel)
    const timeline = getTimelineEntries(recipient, rel)

    const sections: SectionConfig[] = [
        // 1. Surprise Intro
        {
            id: generateId(),
            type: 'surprise-intro',
            visible: true,
            order: 0,
            config: {
                style: tone === 'romantic' ? 'sealed-letter' : tone === 'elegant' ? 'cinematic-reveal' : 'gift-box',
                recipient_name: recipient,
                teaser_text: getIntroTeaser(recipient, tone),
                greeting: `Happy Birthday, ${recipient}! 🎉`,
                skip_enabled: true,
            },
        },
        // 2. Birthday Hero
        {
            id: generateId(),
            type: 'birthday-hero',
            visible: true,
            order: 1,
            config: {
                heading: `Happy Birthday, ${recipient}!`,
                subtitle: getHeroSubtitle(recipient, tone, rel),
                photo_url: CELEBRATION_ASSETS.hero[0].url,
                show_decorations: true,
            },
        },
        // 3. Memory Scrapbook
        {
            id: generateId(),
            type: 'memory-scrapbook',
            visible: true,
            order: 2,
            config: {
                title: 'Celebration Moments 📸',
                subtitle: `A curated collection of warm memories for your special day`,
                photos: CELEBRATION_ASSETS.scrapbook,
            },
        },
        // 4. Cinematic Reel
        {
            id: generateId(),
            type: 'cinematic-reel',
            visible: format !== 'scrapbook',
            order: 3,
            config: {
                title: `${recipient}'s Golden Highlights 🎬`,
                subtitle: 'Celebrating your journey in motion and light',
                aspect_ratio: '16:9',
                slide_duration: 4,
                transition: 'fade',
                auto_play: true,
                slides: CELEBRATION_ASSETS.reel,
            },
        },
        // 5. Our Story / Timeline
        {
            id: generateId(),
            type: 'our-story',
            visible: format === 'complete',
            order: 4,
            config: {
                title: 'Our Journey & Milestones',
                subtitle: 'Looking back on the moments that made us smile',
                entries: timeline,
            },
        },
        // 6. Things I Love
        {
            id: generateId(),
            type: 'things-i-love',
            visible: true,
            order: 5,
            config: {
                title: `Special Things I Love About You 💖`,
                subtitle: 'Tap each card to flip and discover why you are so loved',
                items: thingsILove,
            },
        },
        // 7. Birthday Letter
        {
            id: generateId(),
            type: 'birthday-letter',
            visible: true,
            order: 6,
            config: {
                salutation: letter.salutation,
                body: letter.body,
                signature: letter.signature,
            },
        },
        // 8. Birthday Cake
        {
            id: generateId(),
            type: 'birthday-cake',
            visible: true,
            order: 7,
            config: {
                candle_count: 5,
                blowout_message: `Make a wish, ${recipient}! May all your dreams come true! 🎂✨`,
                confetti: true,
            },
        },
        // 9. Hidden Surprise
        {
            id: generateId(),
            type: 'hidden-surprise',
            visible: true,
            order: 8,
            config: {
                trigger: 'cake-candles',
                surprise_type: 'message',
                content: `🎁 Surprise Unlocked!\n\nRemember: age is just the number of years the world has been blessed with you. Here is to 365 new days of happiness, laughter, and living your brightest life!`,
                hint: 'Blow out all the candles on the cake above to unlock a secret surprise! 🎈',
            },
        },
        // 10. Music Player
        {
            id: generateId(),
            type: 'music-player',
            visible: false,
            order: 9,
            config: {
                title: 'Birthday Celebration Song',
                auto_play: false,
            },
        },
        // 11. Final Message
        {
            id: generateId(),
            type: 'final-message',
            visible: true,
            order: 10,
            config: {
                message: `Cheers to You, ${recipient}! 🥂`,
                subtext: 'Wishing you the happiest of birthdays, surrounded by love, warmth, and laughter.',
                button_text: '🔁 Relive the Magic',
                auto_confetti: true,
            },
        },
    ]

    const title = `${recipient}'s Birthday Celebration`
    const slug = `${generateSlug(recipient)}-birthday-${Math.random().toString(36).slice(2, 6)}`

    return {
        title,
        recipient_name: recipient,
        sender_name: sender,
        slug,
        theme_id: themeId,
        theme_settings: {
            theme_id: themeId,
            animation_intensity: 'full',
            photo_layout: 'polaroid',
        },
        intro_settings: {
            style: 'gift-box' as const,
            recipient_name: recipient,
            teaser_text: getIntroTeaser(recipient, tone),
            greeting: `Happy Birthday, ${recipient}!`,
            skip_enabled: true,
        },
        sections,
    }
}

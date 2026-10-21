import type { ThemeConfig } from './types'

// ─── 10 Theme Definitions ─────────────────────────────────────────────────────

export const themes: ThemeConfig[] = [
    // ═══════════════════════════════ SCRAPBOOK THEMES ═══════════════════════════

    {
        id: 'pink-scrapbook',
        name: 'Pink Scrapbook',
        description: 'Playful polaroids, paper tape, doodles, and floating sparkles in blush and warm red.',
        style: 'scrapbook',
        palette: {
            primary: '#e11d48',      // rose-600
            secondary: '#fda4af',    // rose-300
            accent: '#f43f5e',       // rose-500
            background: '#fff1f2',   // rose-50
            surface: '#ffffff',
            text: '#1c0a0d',
            textMuted: '#9f1239',    // rose-800
            border: '#fecdd3',       // rose-200
            highlight: '#fb7185',    // rose-400
        },
        typography: {
            headingFont: "'Playfair Display', serif",
            bodyFont: "'Inter', sans-serif",
            accentFont: "'Caveat', cursive",
            headingWeight: '700',
            letterSpacing: '-0.02em',
        },
        photoFrame: {
            style: 'polaroid',
            borderColor: '#ffffff',
            captionStyle: 'handwriting',
            rotation: true,
        },
        decorations: {
            particles: ['✨', '💕', '🎀', '🌸', '⭐'],
            shapes: ['heart', 'star', 'ribbon'],
            enableStickers: true,
            enableDoodles: true,
            enableConfetti: true,
        },
        animation: {
            intro: 'scale',
            transitions: 'playful',
            intensity: 'full',
            reducedMotionFallback: 'fade',
        },
        previewGradient: 'linear-gradient(135deg, #fff1f2 0%, #fda4af 50%, #e11d48 100%)',
    },

    {
        id: 'lavender-dreams',
        name: 'Lavender Dreams',
        description: 'Dreamy gradients with clouds, stars, and glowing particles in lavender and pale blue.',
        style: 'scrapbook',
        palette: {
            primary: '#7c3aed',      // violet-600
            secondary: '#c4b5fd',    // violet-300
            accent: '#a78bfa',       // violet-400
            background: '#f5f3ff',   // violet-50
            surface: '#ffffff',
            text: '#1e1b2e',
            textMuted: '#6d28d9',    // violet-700
            border: '#ddd6fe',       // violet-200
            highlight: '#8b5cf6',    // violet-500
        },
        typography: {
            headingFont: "'Playfair Display', serif",
            bodyFont: "'Inter', sans-serif",
            accentFont: "'Caveat', cursive",
            headingWeight: '600',
            letterSpacing: '-0.01em',
        },
        photoFrame: {
            style: 'rounded',
            borderColor: '#c4b5fd',
            captionStyle: 'italic',
            rotation: false,
        },
        decorations: {
            particles: ['⭐', '🌙', '✨', '💫', '☁️'],
            shapes: ['star', 'moon', 'cloud'],
            enableStickers: true,
            enableDoodles: false,
            enableConfetti: true,
        },
        animation: {
            intro: 'fade',
            transitions: 'smooth',
            intensity: 'normal',
            reducedMotionFallback: 'fade',
        },
        previewGradient: 'linear-gradient(135deg, #f0e7ff 0%, #c4b5fd 50%, #7c3aed 100%)',
    },

    {
        id: 'vintage-journal',
        name: 'Vintage Memory Journal',
        description: 'Warm beige, antique paper textures, film photography, and handwritten notes.',
        style: 'scrapbook',
        palette: {
            primary: '#92400e',      // amber-800
            secondary: '#d97706',    // amber-600
            accent: '#b45309',       // amber-700
            background: '#fffbeb',   // amber-50
            surface: '#fef3c7',      // amber-100
            text: '#1c1301',
            textMuted: '#78350f',    // amber-900
            border: '#fde68a',       // amber-200
            highlight: '#f59e0b',    // amber-500
        },
        typography: {
            headingFont: "'Playfair Display', serif",
            bodyFont: "'Inter', sans-serif",
            accentFont: "'Caveat', cursive",
            headingWeight: '500',
            letterSpacing: '0',
        },
        photoFrame: {
            style: 'border',
            borderColor: '#d97706',
            captionStyle: 'handwriting',
            rotation: true,
        },
        decorations: {
            particles: ['📜', '🕰️', '📷', '🌿'],
            shapes: ['stamp', 'ribbon'],
            enableStickers: false,
            enableDoodles: true,
            enableConfetti: false,
        },
        animation: {
            intro: 'fade',
            transitions: 'smooth',
            intensity: 'minimal',
            reducedMotionFallback: 'none',
        },
        previewGradient: 'linear-gradient(135deg, #fffbeb 0%, #fde68a 50%, #92400e 100%)',
    },

    {
        id: 'romantic-letterbook',
        name: 'Romantic Letterbook',
        description: 'Elegant stationery with envelopes, ribbons, florals, and refined serif typography.',
        style: 'scrapbook',
        palette: {
            primary: '#881337',      // rose-900
            secondary: '#fda4af',    // rose-300
            accent: '#9f1239',       // rose-800
            background: '#fff5f7',
            surface: '#fff1f2',
            text: '#1c0511',
            textMuted: '#881337',
            border: '#fecdd3',       // rose-200
            highlight: '#e11d48',    // rose-600
        },
        typography: {
            headingFont: "'Playfair Display', serif",
            bodyFont: "'Playfair Display', serif",
            accentFont: "'Caveat', cursive",
            headingWeight: '400',
            letterSpacing: '0.02em',
        },
        photoFrame: {
            style: 'shadow',
            borderColor: '#fecdd3',
            captionStyle: 'italic',
            rotation: false,
        },
        decorations: {
            particles: ['🌹', '🎀', '💌', '✉️'],
            shapes: ['heart', 'ribbon', 'floral'],
            enableStickers: false,
            enableDoodles: false,
            enableConfetti: true,
        },
        animation: {
            intro: 'slide',
            transitions: 'smooth',
            intensity: 'normal',
            reducedMotionFallback: 'fade',
        },
        previewGradient: 'linear-gradient(135deg, #fff1f2 0%, #fda4af 50%, #881337 100%)',
    },

    {
        id: 'playful-bestie',
        name: 'Playful Bestie Scrapbook',
        description: 'Bright colours, cheeky stickers, funny captions, and energetic animations.',
        style: 'scrapbook',
        palette: {
            primary: '#f97316',      // orange-500
            secondary: '#fbbf24',    // amber-400
            accent: '#ec4899',       // pink-500
            background: '#fffbf0',
            surface: '#ffffff',
            text: '#1a0a00',
            textMuted: '#c2410c',    // orange-700
            border: '#fed7aa',       // orange-200
            highlight: '#fb923c',    // orange-400
        },
        typography: {
            headingFont: "'Outfit', sans-serif",
            bodyFont: "'Inter', sans-serif",
            accentFont: "'Caveat', cursive",
            headingWeight: '800',
            letterSpacing: '-0.02em',
        },
        photoFrame: {
            style: 'polaroid',
            borderColor: '#fbbf24',
            captionStyle: 'handwriting',
            rotation: true,
        },
        decorations: {
            particles: ['🎉', '🥳', '🎊', '⚡', '🔥', '💥'],
            shapes: ['star', 'explosion', 'zigzag'],
            enableStickers: true,
            enableDoodles: true,
            enableConfetti: true,
        },
        animation: {
            intro: 'scale',
            transitions: 'playful',
            intensity: 'full',
            reducedMotionFallback: 'fade',
        },
        previewGradient: 'linear-gradient(135deg, #fff7ed 0%, #fbbf24 40%, #f97316 70%, #ec4899 100%)',
    },

    {
        id: 'botanical-garden',
        name: 'Botanical Garden',
        description: 'Sage green, pressed flowers, organic textures, and earthy calm.',
        style: 'scrapbook',
        palette: {
            primary: '#4d7c0f',      // lime-700
            secondary: '#a3e635',    // lime-400
            accent: '#65a30d',       // lime-600
            background: '#f7fef0',
            surface: '#ecfccb',      // lime-100
            text: '#1a2e05',
            textMuted: '#3f6212',    // lime-800
            border: '#d9f99d',       // lime-200
            highlight: '#84cc16',    // lime-500
        },
        typography: {
            headingFont: "'Playfair Display', serif",
            bodyFont: "'Inter', sans-serif",
            accentFont: "'Caveat', cursive",
            headingWeight: '600',
            letterSpacing: '0',
        },
        photoFrame: {
            style: 'border',
            borderColor: '#a3e635',
            captionStyle: 'italic',
            rotation: true,
        },
        decorations: {
            particles: ['🌿', '🌸', '🍃', '🌷', '🌼'],
            shapes: ['leaf', 'petal', 'vine'],
            enableStickers: false,
            enableDoodles: false,
            enableConfetti: false,
        },
        animation: {
            intro: 'fade',
            transitions: 'smooth',
            intensity: 'minimal',
            reducedMotionFallback: 'none',
        },
        previewGradient: 'linear-gradient(135deg, #f7fef0 0%, #d9f99d 50%, #4d7c0f 100%)',
    },

    // ═══════════════════════════════ CINEMATIC THEMES ═══════════════════════════

    {
        id: 'midnight-magic',
        name: 'Midnight Magic',
        description: 'Deep navy, constellations, glowing text, and cinematic reveals. Mystery and wonder.',
        style: 'cinematic',
        palette: {
            primary: '#818cf8',      // indigo-400
            secondary: '#6366f1',    // indigo-500
            accent: '#a78bfa',       // violet-400
            background: '#0a0814',
            surface: '#120f25',
            text: '#f0f0ff',
            textMuted: '#a5b4fc',    // indigo-300
            border: '#2d2060',
            highlight: '#c7d2fe',    // indigo-200
        },
        typography: {
            headingFont: "'Playfair Display', serif",
            bodyFont: "'Inter', sans-serif",
            accentFont: "'Caveat', cursive",
            headingWeight: '700',
            letterSpacing: '0.04em',
        },
        photoFrame: {
            style: 'shadow',
            borderColor: '#6366f1',
            captionStyle: 'italic',
            rotation: false,
        },
        decorations: {
            particles: ['✨', '⭐', '🌟', '💫', '🌙'],
            shapes: ['star', 'constellation'],
            enableStickers: false,
            enableDoodles: false,
            enableConfetti: true,
        },
        animation: {
            intro: 'cinematic',
            transitions: 'smooth',
            intensity: 'full',
            reducedMotionFallback: 'fade',
        },
        previewGradient: 'linear-gradient(135deg, #0a0814 0%, #1e1b4b 50%, #818cf8 100%)',
    },

    {
        id: 'golden-hour',
        name: 'Golden Hour',
        description: 'Warm gold, peach, and amber glows. Atmospheric light and elegant typography.',
        style: 'cinematic',
        palette: {
            primary: '#d97706',      // amber-600
            secondary: '#fbbf24',    // amber-400
            accent: '#f59e0b',       // amber-500
            background: '#1a0d00',
            surface: '#2d1a00',
            text: '#fef9ec',
            textMuted: '#fde68a',    // amber-200
            border: '#78350f',       // amber-900
            highlight: '#fcd34d',    // amber-300
        },
        typography: {
            headingFont: "'Playfair Display', serif",
            bodyFont: "'Inter', sans-serif",
            accentFont: "'Caveat', cursive",
            headingWeight: '700',
            letterSpacing: '0.02em',
        },
        photoFrame: {
            style: 'shadow',
            borderColor: '#d97706',
            captionStyle: 'italic',
            rotation: false,
        },
        decorations: {
            particles: ['✨', '🌟', '🌅', '💛'],
            shapes: ['glow', 'bokeh'],
            enableStickers: false,
            enableDoodles: false,
            enableConfetti: true,
        },
        animation: {
            intro: 'cinematic',
            transitions: 'smooth',
            intensity: 'normal',
            reducedMotionFallback: 'fade',
        },
        previewGradient: 'linear-gradient(135deg, #1a0d00 0%, #78350f 50%, #fbbf24 100%)',
    },

    {
        id: 'starlit-cinema',
        name: 'Starlit Cinema',
        description: 'Dark atmosphere, subtle particles, dramatic photo reveals, and emotional storytelling.',
        style: 'cinematic',
        palette: {
            primary: '#94a3b8',      // slate-400
            secondary: '#64748b',    // slate-500
            accent: '#e2e8f0',       // slate-200
            background: '#020617',   // slate-950
            surface: '#0f172a',      // slate-900
            text: '#f1f5f9',         // slate-100
            textMuted: '#94a3b8',    // slate-400
            border: '#1e293b',       // slate-800
            highlight: '#cbd5e1',    // slate-300
        },
        typography: {
            headingFont: "'Playfair Display', serif",
            bodyFont: "'Inter', sans-serif",
            accentFont: "'Caveat', cursive",
            headingWeight: '400',
            letterSpacing: '0.1em',
        },
        photoFrame: {
            style: 'filmstrip',
            borderColor: '#1e293b',
            captionStyle: 'uppercase',
            rotation: false,
        },
        decorations: {
            particles: ['✨', '⭐'],
            shapes: ['bokeh'],
            enableStickers: false,
            enableDoodles: false,
            enableConfetti: false,
        },
        animation: {
            intro: 'cinematic',
            transitions: 'smooth',
            intensity: 'full',
            reducedMotionFallback: 'fade',
        },
        previewGradient: 'linear-gradient(135deg, #020617 0%, #0f172a 60%, #475569 100%)',
    },

    {
        id: 'minimalist-elegance',
        name: 'Minimalist Elegance',
        description: 'Editorial typography, generous whitespace, and restrained movement. Effortlessly refined.',
        style: 'cinematic',
        palette: {
            primary: '#374151',      // gray-700
            secondary: '#9ca3af',    // gray-400
            accent: '#111827',       // gray-900
            background: '#fafafa',
            surface: '#ffffff',
            text: '#111827',         // gray-900
            textMuted: '#6b7280',    // gray-500
            border: '#e5e7eb',       // gray-200
            highlight: '#374151',    // gray-700
        },
        typography: {
            headingFont: "'Playfair Display', serif",
            bodyFont: "'Inter', sans-serif",
            accentFont: "'Caveat', cursive",
            headingWeight: '400',
            letterSpacing: '0.01em',
        },
        photoFrame: {
            style: 'shadow',
            borderColor: '#e5e7eb',
            captionStyle: 'uppercase',
            rotation: false,
        },
        decorations: {
            particles: [],
            shapes: [],
            enableStickers: false,
            enableDoodles: false,
            enableConfetti: false,
        },
        animation: {
            intro: 'fade',
            transitions: 'smooth',
            intensity: 'minimal',
            reducedMotionFallback: 'none',
        },
        previewGradient: 'linear-gradient(135deg, #fafafa 0%, #e5e7eb 50%, #374151 100%)',
    },
]

export const themeMap = new Map(themes.map(t => [t.id, t]))

export function getTheme(id: string): ThemeConfig {
    return themeMap.get(id as ThemeConfig['id']) ?? themes[0]
}

export const scrapbookThemes = themes.filter(t => t.style === 'scrapbook')
export const cinematicThemes = themes.filter(t => t.style === 'cinematic')

export const getThemeById = getTheme

export function getThemesByStyle(style: 'scrapbook' | 'cinematic'): ThemeConfig[] {
    return themes.filter(t => t.style === style)
}

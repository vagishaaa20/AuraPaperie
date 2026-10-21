import React, { useState, useEffect } from 'react'
import { themes } from '@/lib/theme-registry'
import type { ThemeId, ThemeSettings } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Palette, Type, Sparkles, Layout, Box, Sun, Music, Volume2, Play, Pause, Wind } from 'lucide-react'
import { soundEngine, CURATED_MUSIC_TRACKS } from '@/lib/sound-system'

interface Props {
    currentThemeId: ThemeId
    themeSettings: ThemeSettings
    onChangeTheme: (id: ThemeId) => void
    onChangeSettings: (settings: ThemeSettings) => void
}

const WEDDING_DESIGN_PRESETS: {
    id: string
    name: string
    themeId: ThemeId
    tag: string
    accentColor: string
    headingFont: string
    bodyFont: string
    decorations: string[]
}[] = [
    {
        id: 'floral-romance',
        name: '🌸 Floral Romance',
        themeId: 'pink-scrapbook',
        tag: 'Blush & Gold',
        accentColor: '#f43f5e',
        headingFont: "'Cormorant Garamond', serif",
        bodyFont: "'Inter', sans-serif",
        decorations: ['🌸', '💕', '✨', '🕊️'],
    },
    {
        id: 'royal-heritage',
        name: '👑 Royal Heritage',
        themeId: 'golden-hour',
        tag: 'Gold & Jewel',
        accentColor: '#d97706',
        headingFont: "'Cinzel', serif",
        bodyFont: "'Cormorant Garamond', serif",
        decorations: ['🪔', '👑', '✨', '⚜️'],
    },
    {
        id: 'botanical-garden',
        name: '🌿 Botanical Greenery',
        themeId: 'botanical-garden',
        tag: 'Sage & Olive',
        accentColor: '#059669',
        headingFont: "'Playfair Display', serif",
        bodyFont: "'Inter', sans-serif",
        decorations: ['🌿', '🍃', '🕊️', '✨'],
    },
    {
        id: 'minimalist-elegance',
        name: '🏛️ Modern Editorial',
        themeId: 'minimalist-elegance',
        tag: 'Monochrome Luxe',
        accentColor: '#18181b',
        headingFont: "'Bodoni Moda', serif",
        bodyFont: "'Inter', sans-serif",
        decorations: ['✨', '💍', '✦'],
    },
    {
        id: 'romantic-letterbook',
        name: '📜 Vintage Romance',
        themeId: 'romantic-letterbook',
        tag: 'Parchment & Wine',
        accentColor: '#be123c',
        headingFont: "'Great Vibes', cursive",
        bodyFont: "'Playfair Display', serif",
        decorations: ['💌', '🕊️', '🌸', '✨'],
    },
    {
        id: 'lavender-dreams',
        name: '🪻 Lavender Serenade',
        themeId: 'lavender-dreams',
        tag: 'Lilac & Silver',
        accentColor: '#8b5cf6',
        headingFont: "'Playfair Display', serif",
        bodyFont: "'Inter', sans-serif",
        decorations: ['🪻', '✨', '💜', '🌙'],
    },
    {
        id: 'midnight-magic',
        name: '🌌 Starlit Gala',
        themeId: 'midnight-magic',
        tag: 'Navy & Celestial',
        accentColor: '#fbbf24',
        headingFont: "'Cinzel', serif",
        bodyFont: "'Inter', sans-serif",
        decorations: ['⭐', '✨', '🌙', '💫'],
    },
]

const FONT_PAIRINGS = [
    { label: 'Cormorant + Inter (Luxury Editorial)', heading: "'Cormorant Garamond', serif", body: "'Inter', sans-serif" },
    { label: 'Playfair Display + Inter (Modern Classic)', heading: "'Playfair Display', serif", body: "'Inter', sans-serif" },
    { label: 'Cinzel + Cormorant (Royal Heritage)', heading: "'Cinzel', serif", body: "'Cormorant Garamond', serif" },
    { label: 'Great Vibes + Playfair (Calligraphy Romance)', heading: "'Great Vibes', cursive", body: "'Playfair Display', serif" },
    { label: 'Caveat + Lato (Artisanal Handwritten)', heading: "'Caveat', cursive", body: "'Lato', sans-serif" },
]

const COLOR_SWATCHES = [
    { label: 'Rose Gold', color: '#e11d48' },
    { label: 'Royal Gold', color: '#d97706' },
    { label: 'Sage Olive', color: '#059669' },
    { label: 'Lilac Lavender', color: '#8b5cf6' },
    { label: 'Wine Burgundy', color: '#881337' },
    { label: 'Midnight Blue', color: '#1e3a8a' },
    { label: 'Slate Onyx', color: '#18181b' },
]

const ATMOSPHERE_EFFECTS = [
    { id: 'petals', label: '🌸 Rose Petals' },
    { id: 'marigold', label: '🌼 Marigold Petals' },
    { id: 'gold-dust', label: '✨ Golden Dust' },
    { id: 'leaves', label: '🌿 Olive Leaves' },
    { id: 'stars', label: '⭐ Starlight' },
    { id: 'none', label: '🚫 No Particles' },
]

export default function ThemeSelector({ currentThemeId, themeSettings, onChangeTheme, onChangeSettings }: Props) {
    const [previewingTrackId, setPreviewingTrackId] = useState<string | null>(null)
    const [musicVol, setMusicVol] = useState(soundEngine.musicVolume)
    const [sfxVol, setSfxVol] = useState(soundEngine.sfxVolume)

    const update = (patch: Partial<ThemeSettings>) => {
        onChangeSettings({ ...themeSettings, ...patch })
    }

    const applyPreset = (preset: typeof WEDDING_DESIGN_PRESETS[0]) => {
        onChangeTheme(preset.themeId)
        update({
            accent_color: preset.accentColor,
            heading_font: preset.headingFont,
            body_font: preset.bodyFont,
            custom_decorations: preset.decorations,
        })
    }

    const handleTogglePreviewTrack = (trackId: string) => {
        if (previewingTrackId === trackId && soundEngine.isMusicPlaying) {
            soundEngine.pauseMusic()
            setPreviewingTrackId(null)
        } else {
            soundEngine.playMusic(trackId)
            setPreviewingTrackId(trackId)
        }
    }

    return (
        <div className="p-4 space-y-7 max-h-[calc(100vh-60px)] overflow-y-auto">
            {/* Header */}
            <div>
                <h3 className="font-display font-bold text-gray-900 text-base flex items-center gap-2">
                    <Palette className="w-4 h-4 text-rose-500" />
                    Visual Styling & Sound Design
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                    Customize the cinematic atmosphere, background music, fonts & palettes.
                </p>
            </div>

            {/* ─── 1. Wedding Aesthetic Presets ─────────────────────────── */}
            <div>
                <div className="flex items-center justify-between mb-2.5">
                    <p className="text-xs uppercase tracking-wider text-gray-500 font-bold flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        Design Presets
                    </p>
                    <span className="text-[10px] text-gray-400">1-click styles</span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                    {WEDDING_DESIGN_PRESETS.map(preset => {
                        const isMatch = currentThemeId === preset.themeId && themeSettings.accent_color === preset.accentColor
                        return (
                            <button
                                key={preset.id}
                                type="button"
                                onClick={() => applyPreset(preset)}
                                className={cn(
                                    'p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer group',
                                    isMatch
                                        ? 'bg-rose-50/70 border-rose-400 ring-2 ring-rose-200'
                                        : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                )}
                            >
                                <div className="flex items-center gap-2.5">
                                    <div
                                        className="w-4 h-4 rounded-full flex-shrink-0 shadow-xs border border-white"
                                        style={{ background: preset.accentColor }}
                                    />
                                    <div>
                                        <span className="text-xs font-bold text-gray-900 group-hover:text-rose-600 block">
                                            {preset.name}
                                        </span>
                                        <span className="text-[10px] text-gray-400">{preset.tag}</span>
                                    </div>
                                </div>
                                <div className="flex gap-1 text-xs">
                                    {preset.decorations.slice(0, 3).map((d, i) => (
                                        <span key={i}>{d}</span>
                                    ))}
                                </div>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* ─── 2. Background Wedding Music & Sound ──────────────────── */}
            <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200 space-y-3">
                <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-wider text-rose-900 font-bold flex items-center gap-1.5">
                        <Music className="w-3.5 h-3.5 text-rose-600" />
                        Wedding Background Music
                    </p>
                    <span className="text-[10px] bg-rose-200 text-rose-800 px-2 py-0.5 rounded-full font-bold">
                        Sound Enabled
                    </span>
                </div>

                <div className="space-y-2">
                    {CURATED_MUSIC_TRACKS.map(track => {
                        const isSelected = (themeSettings as any).music_track_id === track.id || (!((themeSettings as any).music_track_id) && track.id === 'shehnai-sitar')
                        const isPreviewing = previewingTrackId === track.id && soundEngine.isMusicPlaying

                        return (
                            <div
                                key={track.id}
                                className={cn(
                                    'p-2.5 rounded-xl border bg-white flex items-center justify-between gap-2 transition-all',
                                    isSelected ? 'border-rose-400 ring-2 ring-rose-200' : 'border-gray-200 hover:border-gray-300'
                                )}
                            >
                                <button
                                    type="button"
                                    onClick={() => {
                                        update({ music_track_id: track.id } as any)
                                        soundEngine.currentTrackId = track.id
                                    }}
                                    className="flex-1 text-left min-w-0 cursor-pointer"
                                >
                                    <span className="text-xs font-bold text-gray-900 block truncate">
                                        {track.title}
                                    </span>
                                    <span className="text-[10px] text-gray-500 block truncate">
                                        {track.genre} • {track.duration}
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleTogglePreviewTrack(track.id)}
                                    className={cn(
                                        'p-2 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer',
                                        isPreviewing
                                            ? 'bg-rose-500 text-white animate-pulse'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    )}
                                    title={isPreviewing ? 'Stop Preview' : 'Preview Track'}
                                >
                                    {isPreviewing ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                                </button>
                            </div>
                        )
                    })}
                </div>

                {/* Music & SFX Volume Sliders */}
                <div className="pt-2 border-t border-rose-200/60 space-y-2">
                    <div>
                        <div className="flex items-center justify-between text-[11px] font-bold text-gray-700 mb-1">
                            <span>Music Volume</span>
                            <span>{Math.round(musicVol * 100)}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={musicVol}
                            onChange={e => {
                                const val = parseFloat(e.target.value)
                                setMusicVol(val)
                                soundEngine.setMusicVolume(val)
                            }}
                            className="w-full accent-rose-500 cursor-pointer"
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between text-[11px] font-bold text-gray-700 mb-1">
                            <span>Sound Effects (Chimes/Seal)</span>
                            <span>{Math.round(sfxVol * 100)}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={sfxVol}
                            onChange={e => {
                                const val = parseFloat(e.target.value)
                                setSfxVol(val)
                                soundEngine.setSfxVolume(val)
                                soundEngine.playClickSound()
                            }}
                            className="w-full accent-rose-500 cursor-pointer"
                        />
                    </div>
                </div>
            </div>

            {/* ─── 3. Atmospheric Particle Effects ──────────────────────── */}
            <div>
                <p className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-2 flex items-center gap-1.5">
                    <Wind className="w-3.5 h-3.5 text-teal-500" />
                    Atmospheric Falling Petals / Particles
                </p>
                <div className="grid grid-cols-2 gap-2">
                    {ATMOSPHERE_EFFECTS.map(effect => {
                        const isSelected = (themeSettings as any).atmosphere_effect === effect.id || (!((themeSettings as any).atmosphere_effect) && effect.id === 'petals')
                        return (
                            <button
                                key={effect.id}
                                type="button"
                                onClick={() => update({ atmosphere_effect: effect.id } as any)}
                                className={cn(
                                    'py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer',
                                    isSelected
                                        ? 'bg-rose-50 border-rose-300 text-rose-700'
                                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                )}
                            >
                                {effect.label}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* ─── 4. Palette & Custom Accent Color ─────────────────────── */}
            <div>
                <p className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-2.5 flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-rose-500" />
                    Color Palette & Accent
                </p>
                <div className="flex items-center gap-1.5 flex-wrap mb-3">
                    {COLOR_SWATCHES.map(swatch => (
                        <button
                            key={swatch.color}
                            type="button"
                            onClick={() => update({ accent_color: swatch.color })}
                            className={cn(
                                'w-7 h-7 rounded-full border-2 transition-transform cursor-pointer',
                                themeSettings.accent_color === swatch.color ? 'scale-110 border-gray-900 shadow-md ring-2 ring-rose-200' : 'border-white hover:scale-105'
                            )}
                            style={{ background: swatch.color }}
                            title={swatch.label}
                        />
                    ))}
                    <div className="flex items-center gap-2 ml-auto">
                        <label className="text-[10px] text-gray-400 font-bold uppercase">Custom</label>
                        <input
                            type="color"
                            value={themeSettings.accent_color || '#e11d48'}
                            onChange={e => update({ accent_color: e.target.value })}
                            className="w-7 h-7 rounded-lg border border-gray-200 cursor-pointer p-0.5 bg-white"
                        />
                    </div>
                </div>
            </div>

            {/* ─── 5. Typography Pairings ────────────────────────────────── */}
            <div>
                <p className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-2 flex items-center gap-1.5">
                    <Type className="w-3.5 h-3.5 text-blue-500" />
                    Font Pairings
                </p>
                <div className="space-y-1.5">
                    {FONT_PAIRINGS.map((font, idx) => {
                        const isSelected = themeSettings.heading_font === font.heading
                        return (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => update({ heading_font: font.heading, body_font: font.body })}
                                className={cn(
                                    'w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer text-xs flex items-center justify-between',
                                    isSelected
                                        ? 'bg-rose-50 border-rose-300 text-rose-800 font-bold'
                                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                                )}
                            >
                                <span>{font.label}</span>
                                {isSelected && <span className="text-rose-500">✓</span>}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* ─── 6. Photo Framing & Layout ────────────────────────────── */}
            <div>
                <p className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-2 flex items-center gap-1.5">
                    <Layout className="w-3.5 h-3.5 text-indigo-500" />
                    Photo Frame Style
                </p>
                <div className="grid grid-cols-2 gap-2">
                    {([
                        { value: 'polaroid', label: '📷 Classic Polaroid' },
                        { value: 'collage', label: '🎨 Editorial Collage' },
                        { value: 'grid', label: '▦ Clean Grid' },
                        { value: 'filmstrip', label: '🎞 Cinema Filmstrip' },
                    ] as const).map(layout => (
                        <button
                            key={layout.value}
                            type="button"
                            onClick={() => update({ photo_layout: layout.value })}
                            className={cn(
                                'py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer',
                                themeSettings.photo_layout === layout.value
                                    ? 'bg-rose-50 border-rose-300 text-rose-700'
                                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                            )}
                        >
                            {layout.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ─── 7. Animation Intensity ────────────────────────────────── */}
            <div>
                <p className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-2 flex items-center gap-1.5">
                    <Box className="w-3.5 h-3.5 text-purple-500" />
                    Motion & Animations
                </p>
                <div className="flex gap-2">
                    {(['minimal', 'normal', 'full'] as const).map(intensity => (
                        <button
                            key={intensity}
                            type="button"
                            onClick={() => update({ animation_intensity: intensity })}
                            className={cn(
                                'flex-1 py-2 rounded-xl text-xs font-semibold capitalize border transition-all cursor-pointer',
                                themeSettings.animation_intensity === intensity
                                    ? 'bg-rose-50 border-rose-300 text-rose-700'
                                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                            )}
                        >
                            {intensity}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

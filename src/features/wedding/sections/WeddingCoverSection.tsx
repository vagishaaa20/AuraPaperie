import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Calendar, MapPin, Music } from 'lucide-react'
import type { SectionProps } from '../../birthday/sections/SurpriseIntroSection'
import { soundEngine } from '@/lib/sound-system'

export function WeddingCoverSection({ section, experience, theme, onUnlock, isUnlocked }: SectionProps) {
    const config = (section.config || {}) as Record<string, unknown>
    const partner1 = (config.partner1_name as string) ?? experience.recipient_name?.split('&')[0]?.trim() ?? 'Aarav'
    const partner2 = (config.partner2_name as string) ?? experience.recipient_name?.split('&')[1]?.trim() ?? 'Meera'
    const weddingDate = (config.wedding_date as string) ?? 'December 18, 2026'
    const weddingTime = (config.wedding_time as string) ?? '4:00 PM'
    const venueCity = (config.venue_city as string) ?? 'Napa Valley, California'
    const title = (config.title as string) ?? 'The Wedding Celebration Of'
    const subtitle = (config.subtitle as string) ?? 'Together with our families, we joyfully invite you'
    const buttonText = (config.button_text as string) ?? 'Open the Invitation ✦'
    const openingStyle = (config.opening_style as 'wax-seal' | 'envelope' | 'chime' | 'fanfare') ?? 'wax-seal'
    const isCinematic = theme.style === 'cinematic'

    const [isOpened, setIsOpened] = useState(isUnlocked || false)

    const handleOpen = () => {
        setIsOpened(true)
        soundEngine.playOpeningSound(openingStyle)
        soundEngine.playMusic()
        if (onUnlock) onUnlock()
    }

    return (
        <section
            className="min-h-screen relative flex flex-col items-center justify-center p-4 sm:p-6 text-center overflow-hidden"
            style={{
                background: isCinematic
                    ? 'radial-gradient(ellipse at center, #1a1528 0%, #08060f 100%)'
                    : `radial-gradient(ellipse at center, #fffaf3 0%, ${theme.palette.background} 65%, ${theme.palette.border} 100%)`,
                color: theme.palette.text,
            }}
        >
            {/* Background Corner Ornaments */}
            <div className="absolute top-4 left-4 text-4xl opacity-20 pointer-events-none select-none">❧</div>
            <div className="absolute bottom-4 right-4 text-4xl opacity-20 pointer-events-none select-none rotate-180">❧</div>

            {/* Main Invitation Envelope / Royal Plaque */}
            <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="relative z-10 w-full max-w-lg mx-auto rounded-3xl p-6 sm:p-10 shadow-2xl text-center space-y-6"
                style={{
                    backgroundColor: isCinematic ? 'rgba(25, 20, 38, 0.92)' : '#fffaf2e6',
                    border: `1px solid ${theme.palette.accent || '#bc8b43'}`,
                    outline: `1px solid ${theme.palette.accent || '#bc8b43'}55`,
                    outlineOffset: '8px',
                    boxShadow: '0 24px 60px rgba(88, 58, 36, 0.15)',
                }}
            >
                {/* Auspicious Sacred Blessing or Monogram Crest */}
                <div className="space-y-1">
                    <span className="text-xl block tracking-widest text-amber-600/90 font-serif">
                        ॥ श्री गणेशाय नमः ॥
                    </span>
                    <div className="flex items-center justify-center gap-3 text-amber-600/60 my-2">
                        <div className="w-12 h-px bg-current" />
                        <span className="text-xs">✦ ✦ ✦</span>
                        <div className="w-12 h-px bg-current" />
                    </div>
                </div>

                {/* Subtitle / Family Invitation line */}
                <div>
                    <span
                        className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] block text-stone-500"
                        style={{ fontFamily: theme.typography.bodyFont }}
                    >
                        {title}
                    </span>
                </div>

                {/* Grand Couple Names */}
                <div className="py-2">
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-4xl sm:text-6xl font-normal tracking-tight leading-none"
                        style={{
                            fontFamily: theme.typography.headingFont,
                            color: isCinematic ? '#ffffff' : theme.palette.primary,
                        }}
                    >
                        {partner1}
                        <span className="block text-2xl sm:text-3xl my-2 italic font-light opacity-70"
                              style={{ color: theme.palette.accent }}>
                            &
                        </span>
                        {partner2}
                    </motion.h1>
                </div>

                {/* Family blessing quote */}
                <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
                    {subtitle}
                </p>

                {/* Date & Location divider */}
                <div className="py-3 border-y border-stone-200/80 space-y-1">
                    <div className="text-xs sm:text-sm font-bold tracking-widest uppercase text-stone-700 flex items-center justify-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-rose-500" />
                        <span>{weddingDate} {weddingTime && `• ${weddingTime}`}</span>
                    </div>
                    {venueCity && (
                        <div className="text-xs text-stone-500 flex items-center justify-center gap-1.5">
                            <MapPin className="w-3 h-3 text-stone-400" />
                            <span>{venueCity}</span>
                        </div>
                    )}
                </div>

                {/* Interactive Open Button with Audio Hint */}
                <div className="pt-2 space-y-3">
                    <motion.button
                        type="button"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleOpen}
                        className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest shadow-lg transition-all cursor-pointer inline-flex items-center justify-center gap-2.5"
                        style={{
                            background: isCinematic
                                ? 'linear-gradient(135deg, #f43f5e 0%, #ec4899 100%)'
                                : `linear-gradient(135deg, ${theme.palette.primary} 0%, ${theme.palette.accent} 100%)`,
                            color: '#ffffff',
                        }}
                    >
                        <span>{buttonText}</span>
                    </motion.button>

                    <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-400">
                        <Music className="w-3 h-3 animate-pulse text-rose-500" />
                        <span>Tap to begin & experience with wedding music</span>
                    </div>
                </div>
            </motion.div>
        </section>
    )
}

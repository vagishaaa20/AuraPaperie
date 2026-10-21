import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { SectionConfig, BirthdayExperience } from '@/lib/types'
import type { getTheme } from '@/lib/theme-registry'

export interface SectionProps {
    section: SectionConfig
    experience: BirthdayExperience
    theme: ReturnType<typeof getTheme>
    onComplete?: () => void
    onCakeDone?: () => void
    onLetterRead?: () => void
    cakeDone?: boolean
    letterRead?: boolean
    pageRef?: React.RefObject<HTMLDivElement>
    floatingMode?: boolean
    onUnlock?: () => void
    isUnlocked?: boolean
}

// ─── Surprise Intro ─────────────────────────────────────────────────────────
export function SurpriseIntroSection({ section, experience, theme, onComplete }: SectionProps) {
    const config = section.config as Record<string, unknown>
    const style = (config.style as string) ?? 'gift-box'
    const teaser = (config.teaser_text as string) ?? 'Something special is waiting for you...'
    const greeting = (config.greeting as string) ?? `Happy Birthday, ${experience.recipient_name}! 🎉`
    const skipEnabled = (config.skip_enabled as boolean) ?? true

    const [opened, setOpened] = useState(false)

    const handleOpen = () => {
        setOpened(true)
        setTimeout(() => onComplete?.(), 1800)
    }

    const icon = style === 'sealed-letter' ? '✉️' : style === 'hidden-polaroid' ? '📷' : style === 'unwrap' ? '🎀' : style === 'secret-door' ? '🚪' : style === 'cinematic-reveal' ? '🎬' : style === 'simple-intro' ? '✨' : '🎁'

    return (
        <motion.div
            className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
            style={{ background: theme.previewGradient }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {/* Background animated particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {['✨', '💕', '🌸', '⭐', '🎀', '🎉'].map((e, i) => (
                    <motion.span key={i}
                        className="absolute text-2xl opacity-30"
                        style={{ left: `${5 + i * 15}%`, top: `${10 + (i % 3) * 30}%` }}
                        animate={{ y: [-15, 15, -15], rotate: [-8, 8, -8] }}
                        transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}>
                        {e}
                    </motion.span>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {!opened ? (
                    <motion.div key="closed" className="relative z-10 text-center px-6 max-w-md"
                        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.2, opacity: 0 }}>
                        <motion.div
                            className="text-8xl mb-8 cursor-pointer select-none filter drop-shadow-xl"
                            animate={{ y: [-8, 8, -8], rotate: [-3, 3, -3] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleOpen}
                            role="button"
                            aria-label="Open your birthday surprise"
                        >
                            {icon}
                        </motion.div>
                        <p className="text-white text-xl font-light mb-8 drop-shadow-sm leading-relaxed">{teaser}</p>
                        <motion.button
                            onClick={handleOpen}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.97 }}
                            className="px-10 py-4 bg-white text-gray-800 font-bold rounded-2xl shadow-2xl text-lg"
                            id="intro-open-btn"
                        >
                            Open ✨
                        </motion.button>
                        {skipEnabled && (
                            <button onClick={() => onComplete?.()} className="block mt-6 mx-auto text-white/50 text-sm hover:text-white/80 transition-colors">
                                Skip intro →
                            </button>
                        )}
                    </motion.div>
                ) : (
                    <motion.div key="opened" className="relative z-10 text-center px-6 max-w-md"
                        initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: [0, 1.3, 1] }}
                            transition={{ duration: 0.6 }}
                            className="text-7xl mb-6">
                            🎉
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-3xl font-bold text-white drop-shadow-lg leading-tight">
                            {greeting}
                        </motion.h1>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { SectionProps } from './SurpriseIntroSection'

export function HiddenSurpriseSection({ section, experience, theme, cakeDone, letterRead, pageRef }: SectionProps) {
    const config = section.config as Record<string, unknown>
    const trigger = (config.trigger as string) ?? 'tap-to-reveal'
    const surpriseType = (config.surprise_type as string) ?? 'message'
    const content = (config.content as string) ?? ''
    const hint = (config.hint as string) ?? "There's one more surprise hiding here..."
    const isCinematic = theme.style === 'cinematic'

    const isUnlocked = trigger === 'cake-candles' ? !!cakeDone
        : trigger === 'letter-read' ? !!letterRead
            : false

    const [manuallyOpened, setManuallyOpened] = useState(false)
    const unlocked = isUnlocked || manuallyOpened

    return (
        <section className="py-16 px-6 text-center" style={{ background: isCinematic ? '#0a0a14' : '#fff9fc' }}>
            <AnimatePresence mode="wait">
                {!unlocked ? (
                    <motion.div key="locked" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <div className="inline-block">
                            <motion.div
                                animate={{ y: [-5, 5, -5] }}
                                transition={{ duration: 2.5, repeat: Infinity }}
                                className="text-6xl mb-6"
                            >
                                🔒
                            </motion.div>
                            <p className="text-lg mb-6" style={{ color: isCinematic ? 'rgba(255,255,255,0.6)' : '#888' }}>
                                {hint}
                            </p>
                            {(trigger === 'tap-to-reveal' || trigger === 'scroll-to') && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => setManuallyOpened(true)}
                                    className="px-8 py-3 rounded-2xl font-bold text-white shadow-lg"
                                    style={{ background: 'linear-gradient(135deg, #f472b6, #a855f7)' }}
                                >
                                    ✨ Reveal Surprise
                                </motion.button>
                            )}
                            {trigger !== 'tap-to-reveal' && trigger !== 'scroll-to' && (
                                <p className="text-sm opacity-50" style={{ color: isCinematic ? '#fff' : '#999' }}>
                                    {trigger === 'cake-candles' ? '🎂 Blow out all candles to unlock!' : '💌 Finish reading the letter to unlock!'}
                                </p>
                            )}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="unlocked"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 120 }}
                    >
                        <div className="text-5xl mb-4">🎀</div>
                        <h3 className="text-2xl font-bold mb-6" style={{ color: isCinematic ? '#f9a8d4' : '#be185d', fontFamily: theme.typography.headingFont }}>
                            Your Surprise!
                        </h3>
                        <div className="max-w-lg mx-auto">
                            {surpriseType === 'message' && (
                                <p className="text-lg leading-relaxed" style={{ color: isCinematic ? 'rgba(255,255,255,0.85)' : '#374151' }}>
                                    {content || 'A special secret message...'}
                                </p>
                            )}
                            {surpriseType === 'photo' && content && (
                                <img src={content} alt="Surprise!" className="mx-auto rounded-2xl shadow-2xl max-w-full" />
                            )}
                            {surpriseType === 'link' && content && (
                                <a href={content} target="_blank" rel="noopener noreferrer"
                                    className="inline-block px-6 py-3 rounded-xl font-bold text-white"
                                    style={{ background: 'linear-gradient(135deg, #f472b6, #a855f7)' }}>
                                    Open Surprise →
                                </a>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    )
}

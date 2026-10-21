import React from 'react'
import { motion } from 'framer-motion'
import { Heart, Sparkles } from 'lucide-react'
import type { SectionProps } from '../../birthday/sections/SurpriseIntroSection'

export function WeddingCoupleSection({ section, experience, theme }: SectionProps) {
    const config = section.config as Record<string, unknown>
    const partner1 = (config.partner1_name as string) ?? experience.recipient_name ?? 'Aarav'
    const partner2 = (config.partner2_name as string) ?? 'Meera'
    const story = (config.story as string) ?? 'Two souls with but a single thought, two hearts that beat as one.'
    const photo1 = config.partner1_photo as string | undefined
    const photo2 = config.partner2_photo as string | undefined
    const couplePhoto = config.couple_photo as string | undefined
    const isCinematic = theme.style === 'cinematic'

    return (
        <section
            className="py-20 px-6 relative overflow-hidden"
            style={{
                background: isCinematic
                    ? '#0a0714'
                    : `linear-gradient(180deg, ${theme.palette.surface} 0%, ${theme.palette.background} 100%)`,
                color: theme.palette.text,
            }}
        >
            <div className="max-w-4xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-sm"
                    style={{
                        background: `${theme.palette.primary}18`,
                        color: theme.palette.primary,
                        border: `1px solid ${theme.palette.primary}30`,
                    }}
                >
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    <span>The Happy Couple</span>
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl sm:text-4xl font-extrabold mb-4"
                    style={{
                        fontFamily: theme.typography.headingFont,
                        color: isCinematic ? '#ffffff' : theme.palette.primary,
                    }}
                >
                    {partner1} & {partner2}
                </motion.h2>

                {story && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-base sm:text-lg max-w-2xl mx-auto italic leading-relaxed mb-12"
                        style={{ color: theme.palette.textMuted, fontFamily: theme.typography.accentFont ?? theme.typography.bodyFont }}
                    >
                        "{story}"
                    </motion.p>
                )}

                {/* Portraits Layout */}
                {couplePhoto ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="max-w-xl mx-auto rounded-3xl overflow-hidden shadow-2xl border-4"
                        style={{ borderColor: theme.palette.primary }}
                    >
                        <img src={couplePhoto} alt={`${partner1} & ${partner2}`} className="w-full h-80 object-cover" />
                    </motion.div>
                ) : (photo1 || photo2) ? (
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-8 max-w-2xl mx-auto">
                        {photo1 && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="text-center"
                            >
                                <div className="w-44 h-52 rounded-2xl overflow-hidden shadow-xl border-2 mx-auto mb-3"
                                    style={{ borderColor: theme.palette.primary }}>
                                    <img src={photo1} alt={partner1} className="w-full h-full object-cover" />
                                </div>
                                <h3 className="font-bold text-lg" style={{ color: theme.palette.primary }}>{partner1}</h3>
                            </motion.div>
                        )}
                        <Heart className="w-8 h-8 text-rose-500 fill-current animate-pulse hidden sm:block" />
                        {photo2 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="text-center"
                            >
                                <div className="w-44 h-52 rounded-2xl overflow-hidden shadow-xl border-2 mx-auto mb-3"
                                    style={{ borderColor: theme.palette.primary }}>
                                    <img src={photo2} alt={partner2} className="w-full h-full object-cover" />
                                </div>
                                <h3 className="font-bold text-lg" style={{ color: theme.palette.primary }}>{partner2}</h3>
                            </motion.div>
                        )}
                    </div>
                ) : null}
            </div>
        </section>
    )
}

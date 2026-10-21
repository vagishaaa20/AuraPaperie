import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Sparkles } from 'lucide-react'
import type { SectionProps } from './SurpriseIntroSection'

export function OurStorySection({ section, experience, theme }: SectionProps) {
    const config = section.config as Record<string, unknown>
    const title = (config.title as string) ?? 'Our Story & Milestones'
    const subtitle = (config.subtitle as string) ?? 'The journey of memories that brought us here'
    const entries = (config.entries as { icon?: string; title: string; date?: string; story?: string; location?: string; photo_url?: string }[]) ?? []
    const isCinematic = theme.style === 'cinematic'

    return (
        <section
            className="py-20 px-6 relative overflow-hidden"
            style={{
                background: isCinematic
                    ? '#0a0814'
                    : `linear-gradient(180deg, ${theme.palette.surface} 0%, ${theme.palette.background} 100%)`,
                color: theme.palette.text,
            }}
        >
            <div className="max-w-3xl mx-auto text-center mb-16">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-4xl font-bold mb-3"
                    style={{
                        color: isCinematic ? theme.palette.text : theme.palette.primary,
                        fontFamily: theme.typography.headingFont,
                    }}
                >
                    {title}
                </motion.h2>
                {subtitle && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-sm md:text-base max-w-lg mx-auto"
                        style={{ color: theme.palette.textMuted, fontFamily: theme.typography.bodyFont }}
                    >
                        {subtitle}
                    </motion.p>
                )}
            </div>

            <div className="relative max-w-2xl mx-auto">
                {/* Vertical Timeline Track with Theme Gradient */}
                <div
                    className="absolute left-6 top-4 bottom-4 w-1 rounded-full shadow-sm"
                    style={{
                        background: `linear-gradient(180deg, ${theme.palette.primary} 0%, ${theme.palette.accent} 50%, ${theme.palette.border} 100%)`,
                    }}
                />

                <div className="space-y-12 pl-16">
                    {entries.map((entry, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -25 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            className="relative group"
                        >
                            {/* Milestone Marker Icon Node */}
                            <div
                                className="absolute -left-[3.25rem] top-0 w-11 h-11 rounded-full flex items-center justify-center text-lg shadow-lg border-2"
                                style={{
                                    background: isCinematic ? theme.palette.surface : '#ffffff',
                                    borderColor: theme.palette.primary,
                                }}
                            >
                                {entry.icon ?? '⭐'}
                            </div>

                            {/* Milestone Card */}
                            <div
                                className="p-6 rounded-2xl shadow-lg border transition-all group-hover:shadow-xl"
                                style={{
                                    background: isCinematic ? theme.palette.surface : '#ffffff',
                                    borderColor: isCinematic ? theme.palette.border : `${theme.palette.border}`,
                                }}
                            >
                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                    {entry.date && (
                                        <span
                                            className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                                            style={{
                                                background: `${theme.palette.primary}18`,
                                                color: theme.palette.primary,
                                            }}
                                        >
                                            <Calendar className="w-3 h-3" />
                                            {entry.date}
                                        </span>
                                    )}
                                    {entry.location && (
                                        <span className="inline-flex items-center gap-1 text-xs opacity-75" style={{ color: theme.palette.textMuted }}>
                                            <MapPin className="w-3 h-3" />
                                            {entry.location}
                                        </span>
                                    )}
                                </div>

                                <h3
                                    className="font-bold text-lg md:text-xl mb-2"
                                    style={{
                                        color: isCinematic ? theme.palette.text : theme.palette.primary,
                                        fontFamily: theme.typography.headingFont,
                                    }}
                                >
                                    {entry.title}
                                </h3>

                                {entry.story && (
                                    <p
                                        className="text-sm leading-relaxed whitespace-pre-line"
                                        style={{ color: isCinematic ? 'rgba(255,255,255,0.8)' : '#4b5563' }}
                                    >
                                        {entry.story}
                                    </p>
                                )}

                                {entry.photo_url && (
                                    <div className="mt-4 rounded-xl overflow-hidden max-h-56 border" style={{ borderColor: theme.palette.border }}>
                                        <img src={entry.photo_url} alt="" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}

                    {entries.length === 0 && (
                        <div
                            className="p-8 rounded-2xl text-center border-2 border-dashed"
                            style={{ borderColor: `${theme.palette.primary}40`, background: `${theme.palette.surface}40` }}
                        >
                            <p className="text-sm" style={{ color: theme.palette.textMuted }}>
                                No milestones added yet. Open the editor to create your timeline!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

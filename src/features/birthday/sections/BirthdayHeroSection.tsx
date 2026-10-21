import React from 'react'
import { motion } from 'framer-motion'
import type { SectionProps } from './SurpriseIntroSection'

export function BirthdayHeroSection({ section, experience, theme }: SectionProps) {
    const config = section.config as Record<string, unknown>
    const heading = (config.heading as string) ?? `Happy Birthday, ${experience.recipient_name}!`
    const subtitle = config.subtitle as string | undefined
    const photoUrl = config.photo_url as string | undefined
    const showDecorations = (config.show_decorations as boolean) ?? true
    const isCinematic = theme.style === 'cinematic'

    return (
        <section className="relative min-h-[60vh] flex flex-col items-center justify-center overflow-hidden py-20 px-6 text-center"
            style={{ background: theme.previewGradient }}>
            <div className="absolute inset-0 bg-black/20" />

            {showDecorations && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {((Array.isArray(theme.decorations) ? theme.decorations : theme.decorations?.particles) ?? ['✨', '💕', '🌸', '⭐']).slice(0, 5).map((d: any, i: number) => (
                        <motion.span key={i} className="absolute text-2xl opacity-40"
                            style={{ left: `${5 + i * 20}%`, top: `${5 + (i % 3) * 25}%` }}
                            animate={{ y: [-10, 10, -10] }}
                            transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}>
                            {d}
                        </motion.span>
                    ))}
                </div>
            )}

            <div className="relative z-10">
                {photoUrl && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="mb-8 mx-auto w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-2xl"
                    >
                        <img src={photoUrl} alt={experience.recipient_name} className="w-full h-full object-cover" />
                    </motion.div>
                )}

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-white/70 text-base uppercase tracking-[0.2em] mb-4"
                    style={{ fontFamily: theme.typography.accent ?? theme.typography.body }}
                >
                    {isCinematic ? 'A message for' : 'Happy Birthday'}
                </motion.p>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 }}
                    className="text-4xl sm:text-6xl font-bold text-white drop-shadow-xl leading-tight"
                    style={{ fontFamily: theme.typography.heading }}
                >
                    {heading}
                </motion.h1>

                {subtitle && (
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="mt-4 text-white/80 text-xl"
                    >
                        {subtitle}
                    </motion.p>
                )}
            </div>
        </section>
    )
}


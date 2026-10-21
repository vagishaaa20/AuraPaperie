import React, { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Mail, Heart } from 'lucide-react'
import type { SectionProps } from './SurpriseIntroSection'

export function BirthdayLetterSection({ section, experience, theme, onLetterRead }: SectionProps) {
    const config = section.config as Record<string, unknown>
    const salutation = (config.salutation as string) ?? `Dear ${experience.recipient_name},`
    const body = (config.body as string) ?? 'Writing this letter to remind you of how truly special and cherished you are. Happy Birthday!'
    const signature = (config.signature as string) ?? 'With all my love ❤️'
    const isCinematic = theme.style === 'cinematic'
    const isVintage = theme.id === 'vintage-journal'

    const ref = useRef<HTMLDivElement>(null)
    const inView = useInView(ref, { once: true, amount: 0.7 })

    useEffect(() => {
        if (inView) onLetterRead?.()
    }, [inView, onLetterRead])

    return (
        <section
            ref={ref}
            className="py-20 px-6 relative overflow-hidden"
            style={{
                background: isCinematic
                    ? '#0a0814'
                    : `linear-gradient(180deg, ${theme.palette.surface} 0%, ${theme.palette.background} 100%)`,
            }}
        >
            <div className="max-w-2xl mx-auto text-center mb-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center shadow-sm"
                    style={{
                        background: `${theme.palette.primary}20`,
                        color: theme.palette.primary,
                    }}
                >
                    <Mail className="w-5 h-5" />
                </motion.div>
                <motion.h2
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-4xl font-bold"
                    style={{
                        color: isCinematic ? theme.palette.text : theme.palette.primary,
                        fontFamily: theme.typography.headingFont,
                    }}
                >
                    A Letter For You
                </motion.h2>
            </div>

            {/* Letter Paper Container */}
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="relative max-w-2xl mx-auto rounded-3xl p-8 sm:p-12 shadow-2xl overflow-hidden border"
                style={{
                    background: isCinematic
                        ? 'linear-gradient(145deg, #141126 0%, #0e0c1b 100%)'
                        : isVintage
                            ? '#fef3c7'
                            : theme.palette.surface,
                    borderColor: isCinematic ? theme.palette.border : `${theme.palette.border}`,
                    color: isCinematic ? theme.palette.text : isVintage ? '#451a03' : theme.palette.text,
                }}
            >
                {/* Vintage Wax Stamp Decoration */}
                {isVintage && (
                    <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-amber-800 text-amber-200 flex items-center justify-center font-bold text-xs shadow-md border-2 border-amber-900 select-none">
                        WAX
                    </div>
                )}

                {/* Notebook Rule Lines */}
                {!isCinematic && (
                    <div
                        className="absolute inset-0 opacity-15 pointer-events-none"
                        style={{
                            backgroundImage: `repeating-linear-gradient(transparent, transparent 27px, ${theme.palette.primary} 27px, ${theme.palette.primary} 28px)`,
                            backgroundPositionY: '48px',
                        }}
                    />
                )}

                <div className="relative space-y-6 leading-relaxed">
                    <p
                        className="text-lg font-bold"
                        style={{
                            color: theme.palette.primary,
                            fontFamily: theme.typography.headingFont,
                        }}
                    >
                        {salutation}
                    </p>

                    <div
                        className="text-base sm:text-lg whitespace-pre-line leading-relaxed"
                        style={{
                            fontFamily: isCinematic ? theme.typography.bodyFont : (theme.typography.accentFont ?? theme.typography.bodyFont),
                        }}
                    >
                        {body}
                    </div>

                    <div className="pt-6 border-t flex items-center justify-between"
                        style={{ borderColor: `${theme.palette.border}80` }}>
                        <p
                            className="font-bold text-base sm:text-lg italic"
                            style={{
                                color: theme.palette.primary,
                                fontFamily: theme.typography.accentFont ?? theme.typography.headingFont,
                            }}
                        >
                            {signature}
                        </p>
                        <Heart className="w-5 h-5 fill-current opacity-70" style={{ color: theme.palette.primary }} />
                    </div>
                </div>
            </motion.div>
        </section>
    )
}

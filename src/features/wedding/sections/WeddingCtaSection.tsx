import React from 'react'
import { motion } from 'framer-motion'
import { Heart, Sparkles, Navigation, Calendar } from 'lucide-react'
import type { SectionProps } from '../../birthday/sections/SurpriseIntroSection'

export function WeddingCtaSection({ section, experience, theme }: SectionProps) {
    const config = section.config as Record<string, unknown>
    const partner1 = (config.partner1_name as string) ?? experience.recipient_name ?? 'Aarav'
    const partner2 = (config.partner2_name as string) ?? 'Meera'
    const message = (config.message as string) ?? 'We cannot wait to celebrate our special day with you!'
    const isCinematic = theme.style === 'cinematic'

    const scrollToRsvp = () => {
        const el = document.getElementById('wedding-rsvp-section')
        if (el) el.scrollIntoView({ behavior: 'smooth' })
        else window.scrollTo({ top: document.body.scrollHeight / 2, behavior: 'smooth' })
    }

    return (
        <section
            className="py-24 px-6 text-center relative overflow-hidden"
            style={{
                background: isCinematic
                    ? 'radial-gradient(circle at center, #1b0f2e 0%, #06030c 100%)'
                    : `linear-gradient(135deg, ${theme.palette.background} 0%, ${theme.palette.surface} 100%)`,
                color: theme.palette.text,
            }}
        >
            <div className="max-w-2xl mx-auto space-y-6">
                <Heart className="w-10 h-10 text-rose-500 fill-current mx-auto animate-pulse" />

                <h2
                    className="text-3xl sm:text-5xl font-extrabold tracking-tight"
                    style={{
                        fontFamily: theme.typography.headingFont,
                        color: isCinematic ? '#ffffff' : theme.palette.primary,
                    }}
                >
                    {partner1} & {partner2}
                </h2>

                <p
                    className="text-base sm:text-lg text-gray-500 max-w-md mx-auto leading-relaxed"
                    style={{ fontFamily: theme.typography.bodyFont }}
                >
                    {message}
                </p>

                <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                    <button
                        onClick={scrollToRsvp}
                        className="py-4 px-8 rounded-2xl text-white font-bold text-sm tracking-wide shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 cursor-pointer"
                        style={{
                            background: `linear-gradient(135deg, ${theme.palette.primary} 0%, ${theme.palette.highlight} 100%)`,
                        }}
                    >
                        <span>RSVP for the Wedding</span>
                    </button>
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="py-4 px-6 rounded-2xl bg-white/80 dark:bg-white/10 hover:bg-white text-gray-700 dark:text-gray-200 font-semibold text-sm border transition-all cursor-pointer"
                        style={{ borderColor: theme.palette.border }}
                    >
                        <span>Back to Top ↑</span>
                    </button>
                </div>

                <div className="pt-8 opacity-75 hover:opacity-100 transition-opacity">
                    <a
                        href="/"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-serif tracking-widest uppercase text-stone-400 hover:text-stone-600 transition-colors"
                    >
                        <img src="/brand/symbol.png" alt="" className="w-5 h-5 object-contain inline-block" />
                        <span>Created on AuraPaperie</span>
                    </a>
                </div>
            </div>
        </section>
    )
}

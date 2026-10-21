import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Shirt } from 'lucide-react'
import type { SectionProps } from '../../birthday/sections/SurpriseIntroSection'

export function WeddingDressCodeSection({ section, theme }: SectionProps) {
    const config = (section.config || {}) as Record<string, unknown>
    const title = (config.title as string) ?? 'Dress Code & Attire'
    const attireStyle = (config.attire_style as string) ?? 'Festive Elegance & Traditional Glamour'
    const description = (config.description as string) ?? 'We would love to see you adorned in joyful, vibrant colors! Feel free to choose traditional, formal, or fusion attire.'
    const womenGuide = (config.women_guide as string) ?? 'Lehengas, sarees, shararas, or floor-length evening gowns.'
    const menGuide = (config.men_guide as string) ?? 'Sherwanis, bandhgalas, kurta-jackets, or tailored suits.'
    const colorNotes = (config.color_notes as string) ?? 'Pastels, jewel tones, and gold accents are warmly encouraged.'
    const isCinematic = theme.style === 'cinematic'

    return (
        <section
            className="py-16 sm:py-20 px-4 sm:px-6 relative overflow-hidden"
            style={{
                background: isCinematic ? '#0e0d16' : 'transparent',
                fontFamily: theme.typography.bodyFont,
            }}
        >
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <span
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2"
                        style={{ background: theme.previewGradient, color: '#fff' }}
                    >
                        <Shirt className="w-3.5 h-3.5" />
                        Attire Guide
                    </span>
                    <h2
                        className="text-2xl sm:text-3xl font-extrabold"
                        style={{
                            fontFamily: theme.typography.headingFont,
                            color: isCinematic ? '#fff' : theme.palette.text || '#1e1b4b',
                        }}
                    >
                        {title}
                    </h2>
                    <p className="text-rose-500 font-semibold text-sm mt-1">{attireStyle}</p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="p-6 sm:p-8 rounded-3xl border shadow-lg space-y-6"
                    style={{
                        background: isCinematic ? 'rgba(255,255,255,0.03)' : '#ffffff',
                        borderColor: isCinematic ? 'rgba(255,255,255,0.08)' : theme.palette.primary + '25',
                    }}
                >
                    <p className="text-sm leading-relaxed text-center max-w-xl mx-auto"
                       style={{ color: isCinematic ? '#cbd5e1' : '#475569' }}>
                        {description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 mb-1 flex items-center gap-1.5">
                                <span>👗</span> For Women
                            </h4>
                            <p className="text-xs text-gray-700 leading-relaxed">{womenGuide}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-800 mb-1 flex items-center gap-1.5">
                                <span>👔</span> For Men
                            </h4>
                            <p className="text-xs text-gray-700 leading-relaxed">{menGuide}</p>
                        </div>
                    </div>

                    {colorNotes && (
                        <div className="text-center pt-2 border-t border-gray-100 text-xs text-gray-500 italic">
                            <Sparkles className="w-3.5 h-3.5 inline mr-1 text-amber-500" />
                            {colorNotes}
                        </div>
                    )}
                </motion.div>
            </div>
        </section>
    )
}

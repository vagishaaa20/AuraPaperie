import React from 'react'
import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'
import type { SectionProps } from '../../birthday/sections/SurpriseIntroSection'

export function WeddingMessageSection({ section, theme }: SectionProps) {
    const config = (section.config || {}) as Record<string, unknown>
    const heading = (config.heading as string) ?? 'A Cordial Invitation'
    const quote = (config.quote as string) ?? '“Whatever our souls are made of, his and mine are the same.”'
    const body = (config.body as string) ?? 'Because you have shared in our lives with your love and friendship, we invite you to join us as we celebrate our marriage and embark on the most beautiful chapter of our lives.'
    const align = (config.align as string) ?? 'center'
    const isCinematic = theme.style === 'cinematic'

    return (
        <section
            className="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden"
            style={{
                background: isCinematic ? '#12111d' : 'transparent',
                fontFamily: theme.typography.bodyFont,
            }}
        >
            <div className="max-w-2xl mx-auto text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="p-8 sm:p-12 rounded-3xl border shadow-xl relative"
                    style={{
                        background: isCinematic ? 'rgba(255,255,255,0.04)' : '#ffffff',
                        borderColor: isCinematic ? 'rgba(255,255,255,0.1)' : theme.palette.primary + '30',
                    }}
                >
                    <div
                        className="w-12 h-12 rounded-full mx-auto mb-6 flex items-center justify-center text-rose-500 shadow-md"
                        style={{ background: theme.previewGradient }}
                    >
                        <Quote className="w-5 h-5 text-white" />
                    </div>

                    <h2
                        className="text-2xl sm:text-3xl font-bold mb-4"
                        style={{
                            fontFamily: theme.typography.headingFont,
                            color: isCinematic ? '#ffffff' : theme.palette.text || '#1e1b4b',
                        }}
                    >
                        {heading}
                    </h2>

                    {quote && (
                        <p
                            className="text-base sm:text-lg italic font-serif mb-6 text-rose-600/90 leading-relaxed max-w-lg mx-auto"
                            style={{ color: theme.palette.primary }}
                        >
                            {quote}
                        </p>
                    )}

                    <div
                        className={`text-sm sm:text-base leading-relaxed space-y-4 ${
                            align === 'left' ? 'text-left' : 'text-center'
                        }`}
                        style={{ color: isCinematic ? '#e2e8f0' : '#475569' }}
                    >
                        <p>{body}</p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2">
                        <span className="text-xl">✨</span>
                        <div className="w-16 h-0.5 rounded-full" style={{ background: theme.palette.primary }} />
                        <span className="text-xl">💍</span>
                        <div className="w-16 h-0.5 rounded-full" style={{ background: theme.palette.primary }} />
                        <span className="text-xl">✨</span>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

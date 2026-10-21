import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Sparkles } from 'lucide-react'
import type { SectionProps } from './SurpriseIntroSection'

export function ThingsILoveSection({ section, experience, theme }: SectionProps) {
    const config = section.config as Record<string, unknown>
    const title = (config.title as string) ?? `Things I Love About You ❤️`
    const subtitle = (config.subtitle as string) ?? 'Click on any card to flip and reveal a special reason'
    const items = (config.items as { emoji?: string; text: string }[]) ?? []
    const isCinematic = theme.style === 'cinematic'

    return (
        <section
            className="py-20 px-6 relative overflow-hidden"
            style={{
                background: isCinematic
                    ? '#080612'
                    : `linear-gradient(180deg, ${theme.palette.background} 0%, ${theme.palette.surface} 100%)`,
                color: theme.palette.text,
            }}
        >
            <div className="max-w-4xl mx-auto text-center mb-14">
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

            <div className="flex flex-wrap justify-center gap-5 max-w-4xl mx-auto">
                {items.map((item, i) => (
                    <FlipCard key={i} item={item} index={i} theme={theme} isCinematic={isCinematic} />
                ))}
                {items.length === 0 && (
                    <div
                        className="p-8 rounded-2xl text-center border-2 border-dashed max-w-md"
                        style={{ borderColor: `${theme.palette.primary}40`, background: `${theme.palette.surface}50` }}
                    >
                        <p className="text-sm font-medium" style={{ color: theme.palette.textMuted }}>
                            No love notes added yet. Use the editor to add reasons why they are loved!
                        </p>
                    </div>
                )}
            </div>
        </section>
    )
}

function FlipCard({
    item,
    index,
    theme,
    isCinematic,
}: {
    item: { emoji?: string; text: string }
    index: number
    theme: any
    isCinematic: boolean
}) {
    const [flipped, setFlipped] = useState(false)

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            onClick={() => setFlipped(!flipped)}
            className="w-40 h-44 sm:w-44 sm:h-48 cursor-pointer relative select-none"
            style={{ perspective: '1000px' }}
            role="button"
            aria-label={`Flip note: ${item.text}`}
        >
            <motion.div
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={{ duration: 0.5, type: 'spring', damping: 20, stiffness: 150 }}
                className="w-full h-full relative"
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* Front of Card */}
                <div
                    className="absolute inset-0 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-lg border transition-transform hover:scale-102"
                    style={{
                        backfaceVisibility: 'hidden',
                        background: isCinematic ? theme.palette.surface : '#ffffff',
                        borderColor: isCinematic ? theme.palette.border : `${theme.palette.primary}30`,
                    }}
                >
                    <span className="text-4xl mb-2">{item.emoji || '💖'}</span>
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.palette.primary }}>
                        Reason #{index + 1}
                    </span>
                    <span className="text-[11px] mt-2 opacity-60 flex items-center gap-1" style={{ color: theme.palette.textMuted }}>
                        Tap to flip
                    </span>
                </div>

                {/* Back of Card (Revealed) */}
                <div
                    className="absolute inset-0 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-xl border overflow-y-auto"
                    style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        background: isCinematic
                            ? 'linear-gradient(135deg, #1c1538 0%, #110d24 100%)'
                            : `linear-gradient(135deg, ${theme.palette.surface} 0%, ${theme.palette.background} 100%)`,
                        borderColor: theme.palette.primary,
                    }}
                >
                    <p
                        className="text-xs sm:text-sm font-semibold leading-relaxed"
                        style={{
                            color: isCinematic ? '#ffffff' : theme.palette.text,
                            fontFamily: theme.typography.accentFont ?? theme.typography.bodyFont,
                        }}
                    >
                        "{item.text}"
                    </p>
                </div>
            </motion.div>
        </motion.div>
    )
}

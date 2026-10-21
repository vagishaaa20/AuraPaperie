import React, { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import confetti from 'canvas-confetti'
import { RotateCcw, Heart } from 'lucide-react'
import type { SectionProps } from './SurpriseIntroSection'

export function FinalMessageSection({ section, experience, theme }: SectionProps) {
    const config = section.config as Record<string, unknown>
    const message = (config.message as string) ?? `Happy Birthday, ${experience.recipient_name}! 🎉`
    const subtext = (config.subtext as string) ?? 'May all your dreams and wishes come true this year and always.'
    const photoUrl = config.photo_url as string | undefined
    const buttonText = (config.button_text as string) ?? '🔁 Relive the Magic'
    const autoConfetti = (config.auto_confetti as boolean) ?? true
    const isCinematic = theme.style === 'cinematic'

    const ref = useRef<HTMLDivElement>(null)
    const inView = useInView(ref, { once: true, amount: 0.4 })

    useEffect(() => {
        if (inView && autoConfetti) {
            const count = 160
            const defaults = { startVelocity: 35, spread: 360, ticks: 70, zIndex: 100, scalar: 0.85 }
            const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min
            const interval = setInterval(() => {
                confetti({
                    ...defaults,
                    particleCount: 45,
                    origin: { x: randomInRange(0.15, 0.35), y: Math.random() - 0.2 },
                    colors: [theme.palette.primary, theme.palette.secondary, theme.palette.highlight, '#fbbf24', '#ffffff'],
                })
                confetti({
                    ...defaults,
                    particleCount: 45,
                    origin: { x: randomInRange(0.65, 0.85), y: Math.random() - 0.2 },
                    colors: [theme.palette.primary, theme.palette.secondary, theme.palette.highlight, '#fbbf24', '#ffffff'],
                })
            }, 250)
            setTimeout(() => clearInterval(interval), 1800)
        }
    }, [inView, autoConfetti, theme.palette])

    const handleReplay = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        setTimeout(() => window.location.reload(), 600)
    }

    return (
        <section
            ref={ref}
            className="relative min-h-[70vh] flex flex-col items-center justify-center px-6 py-24 text-center overflow-hidden"
            style={{
                background: isCinematic
                    ? 'radial-gradient(circle at center, #1b1435 0%, #06040c 100%)'
                    : `linear-gradient(135deg, ${theme.palette.background} 0%, ${theme.palette.surface} 50%, ${theme.palette.border} 100%)`,
                color: theme.palette.text,
            }}
        >
            {/* Theme Floating Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {(Array.isArray(theme.decorations) ? theme.decorations : (theme.decorations?.particles ?? ['✨', '💖', '⭐'])).slice(0, 10).map((p: string, i: number) => (
                    <motion.span
                        key={i}
                        className="absolute text-2xl select-none"
                        style={{
                            left: `${8 + i * 9}%`,
                            top: `${10 + (i % 4) * 22}%`,
                            opacity: isCinematic ? 0.3 : 0.45,
                        }}
                        animate={{ y: [-15, 15, -15], rotate: [-10, 10, -10] }}
                        transition={{ duration: 4 + (i % 3), repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
                    >
                        {p}
                    </motion.span>
                ))}
            </div>

            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                {photoUrl && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="w-32 h-32 sm:w-40 sm:h-40 rounded-full mx-auto overflow-hidden shadow-2xl border-4"
                        style={{ borderColor: theme.palette.primary }}
                    >
                        <img src={photoUrl} alt="" className="w-full h-full object-cover" />
                    </motion.div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="space-y-3"
                >
                    <h2
                        className="text-3xl sm:text-5xl font-extrabold tracking-tight"
                        style={{
                            fontFamily: theme.typography.headingFont,
                            color: isCinematic ? '#ffffff' : theme.palette.primary,
                        }}
                    >
                        {message}
                    </h2>
                    {subtext && (
                        <p
                            className="text-base sm:text-lg max-w-xl mx-auto leading-relaxed"
                            style={{ color: theme.palette.textMuted, fontFamily: theme.typography.bodyFont }}
                        >
                            {subtext}
                        </p>
                    )}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="pt-6"
                >
                    <button
                        onClick={handleReplay}
                        className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-white shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                        style={{
                            background: `linear-gradient(135deg, ${theme.palette.primary} 0%, ${theme.palette.highlight} 100%)`,
                        }}
                    >
                        <RotateCcw className="w-5 h-5" />
                        <span>{buttonText}</span>
                    </button>
                </motion.div>

                {experience.sender_name && (
                    <p className="text-xs uppercase tracking-widest opacity-60 pt-4" style={{ color: theme.palette.textMuted }}>
                        Crafted with love by {experience.sender_name}
                    </p>
                )}
            </div>
        </section>
    )
}

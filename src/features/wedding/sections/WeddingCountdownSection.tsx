import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import type { SectionProps } from '../../birthday/sections/SurpriseIntroSection'

export function WeddingCountdownSection({ section, experience, theme }: SectionProps) {
    const config = section.config as Record<string, unknown>
    const targetDateStr = (config.target_date as string) ?? (config.wedding_date as string) ?? '2026-12-18T10:00:00'
    const title = (config.title as string) ?? 'Counting Down to Forever'
    const isCinematic = theme.style === 'cinematic'

    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, completed: false })

    useEffect(() => {
        const updateTimer = () => {
            const diff = new Date(targetDateStr).getTime() - Date.now()
            if (diff <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, completed: true })
                return
            }
            const days = Math.floor(diff / (1000 * 60 * 60 * 24))
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
            const minutes = Math.floor((diff / 1000 / 60) % 60)
            const seconds = Math.floor((diff / 1000) % 60)
            setTimeLeft({ days, hours, minutes, seconds, completed: false })
        }

        updateTimer()
        const interval = setInterval(updateTimer, 1000)
        return () => clearInterval(interval)
    }, [targetDateStr])

    const blocks = [
        { label: 'Days', val: timeLeft.days },
        { label: 'Hours', val: timeLeft.hours },
        { label: 'Minutes', val: timeLeft.minutes },
        { label: 'Seconds', val: timeLeft.seconds },
    ]

    return (
        <section
            className="py-16 px-6 text-center relative overflow-hidden"
            style={{
                background: isCinematic ? '#0e0b1c' : theme.palette.background,
                color: theme.palette.text,
            }}
        >
            <div className="max-w-2xl mx-auto">
                <motion.h3
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-2xl sm:text-3xl font-extrabold mb-8 tracking-wide"
                    style={{
                        fontFamily: theme.typography.headingFont,
                        color: isCinematic ? '#ffffff' : theme.palette.primary,
                    }}
                >
                    {timeLeft.completed ? '🎉 The Celebration Has Begun!' : title}
                </motion.h3>

                {!timeLeft.completed && (
                    <div className="grid grid-cols-4 gap-3 sm:gap-4 max-w-lg mx-auto">
                        {blocks.map((b, i) => (
                            <motion.div
                                key={b.label}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                                className="p-3 sm:p-5 rounded-2xl shadow-xl border backdrop-blur-sm"
                                style={{
                                    background: isCinematic ? theme.palette.surface : '#ffffff',
                                    borderColor: theme.palette.border,
                                }}
                            >
                                <span
                                    className="block font-mono text-2xl sm:text-4xl font-extrabold tracking-tight"
                                    style={{ color: theme.palette.primary }}
                                >
                                    {String(b.val).padStart(2, '0')}
                                </span>
                                <span className="text-[10px] sm:text-xs uppercase font-bold tracking-widest text-gray-400 mt-1 block">
                                    {b.label}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}

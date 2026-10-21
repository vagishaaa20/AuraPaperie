import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { SectionProps } from './SurpriseIntroSection'

function Candle({ blown, index, onClick }: { blown: boolean; index: number; onClick: () => void }) {
    return (
        <motion.button
            onClick={onClick}
            disabled={blown}
            whileHover={blown ? {} : { scale: 1.1 }}
            whileTap={blown ? {} : { scale: 0.95 }}
            className="flex flex-col items-center gap-0 relative cursor-pointer disabled:cursor-default"
            aria-label={`Blow out candle ${index + 1}`}
        >
            {/* Flame */}
            <AnimatePresence>
                {!blown && (
                    <motion.div
                        initial={{ scale: 1 }}
                        animate={{ scale: [1, 1.2, 0.9, 1.1, 1], y: [0, -2, 0, -1, 0] }}
                        exit={{ scale: 0, opacity: 0, y: -10 }}
                        transition={{ duration: 0.8, repeat: blown ? 0 : Infinity }}
                        className="relative"
                    >
                        <div className="w-3 h-4 rounded-full bg-gradient-to-t from-amber-400 via-orange-400 to-yellow-200 shadow-lg shadow-amber-400/60" />
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Candle body */}
            <div className="w-3 h-10 rounded-sm mt-0.5" style={{ background: `hsl(${index * 37}, 80%, 65%)` }} />
            {blown && <div className="w-1 h-1 rounded-full bg-gray-400 mx-auto -mt-1" />}
        </motion.button>
    )
}

export function BirthdayCakeSection({ section, experience, theme, onCakeDone }: SectionProps) {
    const config = section.config as Record<string, unknown>
    const candleCount = Math.min((config.candle_count as number) ?? 1, 12)
    const blowoutMessage = (config.blowout_message as string) ?? '🎉 Make a wish!'
    const confettiEnabled = (config.confetti as boolean) ?? true
    const isCinematic = theme.style === 'cinematic'
    const [blownCandles, setBlownCandles] = useState<boolean[]>(Array(candleCount).fill(false))
    const [allBlown, setAllBlown] = useState(false)

    const blowCandle = (i: number) => {
        const next = [...blownCandles]
        next[i] = true
        setBlownCandles(next)
        if (next.every(Boolean)) {
            setAllBlown(true)
            onCakeDone?.()
        }
    }

    const blowAll = () => {
        setBlownCandles(Array(candleCount).fill(true))
        setAllBlown(true)
        onCakeDone?.()
    }

    return (
        <section className="py-16 px-6 text-center" style={{ background: isCinematic ? '#0f0f1a' : '#fff9fc' }}>
            <motion.h2
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="text-3xl font-bold mb-12"
                style={{ color: isCinematic ? '#fff' : '#1a1a2e', fontFamily: theme.typography.heading }}
            >
                🎂 Make a Wish!
            </motion.h2>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block"
            >
                {/* Candles */}
                <div className="flex items-end justify-center gap-2 mb-4 px-6">
                    {Array.from({ length: candleCount }).map((_, i) => (
                        <Candle key={i} blown={blownCandles[i]} index={i} onClick={() => blowCandle(i)} />
                    ))}
                </div>

                {/* Cake layers */}
                <div className="relative mx-auto">
                    <div className="rounded-t-3xl py-6 px-12 text-white text-sm font-handwriting shadow-inner"
                        style={{ background: 'linear-gradient(135deg, #f472b6, #ec4899)', minWidth: 180 }}>
                        {template(experience.recipient_name)}
                    </div>
                    <div className="py-4 px-12 text-white text-xs font-handwriting shadow-inner"
                        style={{ background: 'linear-gradient(135deg, #fb7185, #f43f5e)' }}>
                        {Array.from({ length: candleCount }).map((_, i) => '🎂 ').join('').slice(0, 20)}...
                    </div>
                    <div className="rounded-b-3xl py-5 px-12 shadow-xl"
                        style={{ background: 'linear-gradient(135deg, #fda4af, #fb7185)' }} />
                </div>

                {allBlown && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'spring', delay: 0.2 }}
                        className="mt-6"
                    >
                        <p className="text-2xl font-bold" style={{ color: isCinematic ? '#f9a8d4' : '#be185d' }}>{blowoutMessage}</p>
                    </motion.div>
                )}

                {!allBlown && candleCount > 1 && (
                    <button onClick={blowAll} className="mt-4 text-sm underline opacity-50 hover:opacity-80 transition-opacity block mx-auto"
                        style={{ color: isCinematic ? '#fff' : '#999' }}>
                        Blow all out ✨
                    </button>
                )}
            </motion.div>
        </section>
    )
}

function template(name: string) {
    return `Happy Birthday, ${name}! 🎉`
}

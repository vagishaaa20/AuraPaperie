import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import type { SectionProps } from './SurpriseIntroSection'

export function MusicPlayerSection({ section, theme, floatingMode }: SectionProps & { floatingMode?: boolean }) {
    const config = section.config as Record<string, unknown>
    const url = config.url as string | undefined
    const title = (config.title as string) ?? 'Your special song'
    const sourceType = (config.source_type as string) ?? 'url'
    const [playing, setPlaying] = useState(false)
    const audioRef = useRef<HTMLAudioElement>(null)
    const isCinematic = theme.style === 'cinematic'

    const togglePlay = () => {
        if (!audioRef.current) return
        if (playing) { audioRef.current.pause(); setPlaying(false) }
        else { audioRef.current.play().catch(() => null); setPlaying(true) }
    }

    // For YouTube/Spotify, just show a link button
    if (sourceType !== 'url' || !url) {
        const isYT = sourceType === 'youtube'
        if (floatingMode) return null

        return (
            <section className="py-10 px-6 text-center" style={{ background: isCinematic ? '#0f0f1a' : '#fff' }}>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="inline-flex flex-col items-center gap-3">
                    <p className="text-sm" style={{ color: isCinematic ? 'rgba(255,255,255,0.5)' : '#888' }}>🎵 A special song for you</p>
                    <p className="font-semibold" style={{ color: isCinematic ? '#fff' : '#1a1a2e' }}>{title}</p>
                    {url && (
                        <a href={url} target="_blank" rel="noopener noreferrer"
                            className="px-6 py-2.5 rounded-xl font-bold text-white"
                            style={{ background: isYT ? '#ef4444' : '#1db954' }}>
                            {isYT ? '▶ Open on YouTube' : '🎧 Open on Spotify'}
                        </a>
                    )}
                </motion.div>
            </section>
        )
    }

    // Audio file — inline player
    if (floatingMode) {
        return (
            <div className="fixed bottom-4 right-4 z-50">
                <motion.button
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.5 }}
                    onClick={togglePlay}
                    className="w-12 h-12 rounded-full flex items-center justify-center shadow-xl text-white font-bold text-lg"
                    style={{ background: 'linear-gradient(135deg, #f472b6, #a855f7)' }}
                    title={playing ? 'Pause music' : 'Play music'}
                    aria-label={playing ? 'Pause music' : 'Play music'}
                >
                    {playing ? '⏸' : '🎵'}
                    <audio ref={audioRef} src={url} loop={(config.loop as boolean) ?? false} />
                </motion.button>
            </div>
        )
    }

    return (
        <section className="py-12 px-6" style={{ background: isCinematic ? '#0f0f1a' : '#fff' }}>
            <audio ref={audioRef} src={url} loop={(config.loop as boolean) ?? false} />
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="max-w-sm mx-auto rounded-2xl p-6 shadow-xl flex items-center gap-4"
                style={{ background: isCinematic ? '#1e1e38' : 'linear-gradient(135deg, #fce7f3, #f3e8ff)', border: isCinematic ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                <button onClick={togglePlay}
                    className="w-14 h-14 rounded-full flex items-center justify-center text-2xl text-white flex-shrink-0 shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #f472b6, #a855f7)' }}
                    aria-label={playing ? 'Pause' : 'Play'}>
                    {playing ? '⏸' : '▶'}
                </button>
                <div>
                    <p className="font-bold" style={{ color: isCinematic ? '#fff' : '#1a1a2e' }}>{title}</p>
                    <p className="text-xs" style={{ color: isCinematic ? 'rgba(255,255,255,0.4)' : '#888' }}>🎵 {playing ? 'Now playing...' : 'Tap to play'}</p>
                </div>
            </motion.div>
        </section>
    )
}

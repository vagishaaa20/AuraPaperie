import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, Volume2, VolumeX, Maximize2, Sparkles, Film } from 'lucide-react'
import type { SectionProps } from './SurpriseIntroSection'

export interface ReelSlide {
    url: string
    type?: 'image' | 'video'
    caption?: string
    title?: string
    duration?: number // seconds
}

export function CinematicReelSection({ section, experience, theme }: SectionProps) {
    const config = section.config as Record<string, unknown>
    const title = (config.title as string) ?? `${experience.recipient_name}'s Highlight Reel 🎬`
    const subtitle = (config.subtitle as string) ?? 'A celebration of unforgettable moments'
    const slides = (config.slides as ReelSlide[]) ?? (config.photos as ReelSlide[]) ?? []
    const aspectRatio = (config.aspect_ratio as string) ?? '16:9'
    const transitionType = (config.transition as string) ?? 'fade'
    const autoPlay = (config.auto_play as boolean) ?? true
    const defaultDuration = (config.slide_duration as number) ?? 4

    const isCinematic = theme.style === 'cinematic'
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isPlaying, setIsPlaying] = useState(autoPlay)
    const [isMuted, setIsMuted] = useState(true)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    // Current slide duration
    const currentSlide = slides[currentIndex]
    const currentDuration = (currentSlide?.duration ?? defaultDuration) * 1000

    useEffect(() => {
        if (!isPlaying || slides.length <= 1) return
        const timer = setTimeout(() => {
            setCurrentIndex(prev => (prev + 1) % slides.length)
        }, currentDuration)
        return () => clearTimeout(timer)
    }, [currentIndex, isPlaying, slides.length, currentDuration])

    const handleNext = () => setCurrentIndex(prev => (prev + 1) % slides.length)
    const handlePrev = () => setCurrentIndex(prev => (prev - 1 + slides.length) % slides.length)
    const handleRestart = () => {
        setCurrentIndex(0)
        setIsPlaying(true)
    }

    const toggleFullscreen = () => {
        if (!containerRef.current) return
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen?.().catch(() => {})
            setIsFullscreen(true)
        } else {
            document.exitFullscreen?.().catch(() => {})
            setIsFullscreen(false)
        }
    }

    // Aspect ratio styling
    const aspectClass = aspectRatio === '9:16'
        ? 'max-w-sm aspect-[9/16]'
        : aspectRatio === '1:1'
            ? 'max-w-lg aspect-square'
            : 'max-w-4xl aspect-video'

    return (
        <section
            className="py-20 px-6 relative overflow-hidden"
            style={{
                background: isCinematic
                    ? 'radial-gradient(ellipse at center, #110d24 0%, #06040c 100%)'
                    : `linear-gradient(180deg, ${theme.palette.background} 0%, ${theme.palette.surface} 100%)`,
                color: theme.palette.text,
            }}
        >
            <div className="max-w-5xl mx-auto text-center mb-8">
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 shadow-sm"
                    style={{
                        background: `${theme.palette.primary}18`,
                        color: theme.palette.primary,
                        border: `1px solid ${theme.palette.primary}30`,
                    }}
                >
                    <Film className="w-3.5 h-3.5" />
                    <span>Memory Reel</span>
                </motion.div>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-4xl font-bold mb-3"
                    style={{
                        fontFamily: theme.typography.headingFont,
                        color: isCinematic ? theme.palette.text : theme.palette.primary,
                    }}
                >
                    {title}
                </motion.h2>
                {subtitle && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-sm md:text-base max-w-xl mx-auto"
                        style={{ color: theme.palette.textMuted, fontFamily: theme.typography.bodyFont }}
                    >
                        {subtitle}
                    </motion.p>
                )}
            </div>

            {slides.length === 0 ? (
                <div
                    className="max-w-xl mx-auto rounded-3xl p-12 text-center border-2 border-dashed"
                    style={{
                        borderColor: `${theme.palette.primary}40`,
                        background: `${theme.palette.surface}80`,
                    }}
                >
                    <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl shadow-sm"
                        style={{ background: `${theme.palette.primary}20` }}>
                        🎬
                    </div>
                    <h3 className="font-bold text-lg mb-1" style={{ color: theme.palette.primary }}>No Clips Added Yet</h3>
                    <p className="text-sm" style={{ color: theme.palette.textMuted }}>
                        Open the editor to upload photographs, videos, and music for this cinematic reel.
                    </p>
                </div>
            ) : (
                <div ref={containerRef} className={`relative mx-auto rounded-3xl overflow-hidden shadow-2xl ${aspectClass} border`}
                    style={{
                        borderColor: isCinematic ? `${theme.palette.border}` : `${theme.palette.primary}30`,
                        background: '#000',
                    }}
                >
                    {/* Media Slide with Ken Burns Pan/Zoom Animation */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, scale: transitionType === 'zoom' ? 1.15 : 1 }}
                            animate={{ opacity: 1, scale: 1.05 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.2, ease: 'easeOut' }}
                            className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden bg-black"
                        >
                            {currentSlide?.type === 'video' ? (
                                <video
                                    src={currentSlide.url}
                                    autoPlay={isPlaying}
                                    loop
                                    muted={isMuted}
                                    playsInline
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <motion.img
                                    src={currentSlide?.url}
                                    alt={currentSlide?.caption ?? `Moment ${currentIndex + 1}`}
                                    className="w-full h-full object-cover select-none"
                                    animate={{
                                        scale: [1, 1.08],
                                        x: [(currentIndex % 2 === 0 ? -10 : 10), 0],
                                    }}
                                    transition={{ duration: currentDuration / 1000, ease: 'linear' }}
                                />
                            )}
                            {/* Cinematic Vignette */}
                            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                        </motion.div>
                    </AnimatePresence>

                    {/* Slide Caption Overlay */}
                    {(currentSlide?.title || currentSlide?.caption) && (
                        <div className="absolute bottom-16 left-6 right-6 z-20 pointer-events-none text-left">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentIndex}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {currentSlide.title && (
                                        <h4
                                            className="text-xl md:text-2xl font-bold text-white drop-shadow-md mb-1"
                                            style={{ fontFamily: theme.typography.headingFont }}
                                        >
                                            {currentSlide.title}
                                        </h4>
                                    )}
                                    {currentSlide.caption && (
                                        <p
                                            className="text-sm md:text-base text-white/90 drop-shadow line-clamp-2"
                                            style={{ fontFamily: theme.typography.accentFont ?? theme.typography.bodyFont }}
                                        >
                                            {currentSlide.caption}
                                        </p>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    )}

                    {/* Progress Bar Top */}
                    <div className="absolute top-4 left-4 right-4 z-20 flex gap-1.5">
                        {slides.map((_, i) => (
                            <div key={i} className="flex-1 h-1 rounded-full bg-white/30 overflow-hidden backdrop-blur-sm">
                                {i < currentIndex ? (
                                    <div className="h-full bg-white w-full" />
                                ) : i === currentIndex ? (
                                    <motion.div
                                        className="h-full bg-white"
                                        initial={{ width: '0%' }}
                                        animate={{ width: isPlaying ? '100%' : '0%' }}
                                        transition={{ duration: currentDuration / 1000, ease: 'linear' }}
                                    />
                                ) : (
                                    <div className="h-full w-0" />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Playback Controls Bottom */}
                    <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between text-white text-xs backdrop-blur-md bg-black/40 px-4 py-2.5 rounded-2xl border border-white/10">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/20 hover:bg-white/30 transition-colors cursor-pointer"
                                aria-label={isPlaying ? 'Pause' : 'Play'}
                            >
                                {isPlaying ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white ml-0.5" />}
                            </button>
                            <button
                                onClick={handleRestart}
                                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                                aria-label="Replay"
                            >
                                <RotateCcw className="w-3.5 h-3.5 text-white" />
                            </button>
                            <span className="font-mono text-white/80">
                                {currentIndex + 1} / {slides.length}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsMuted(!isMuted)}
                                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                                aria-label={isMuted ? 'Unmute' : 'Mute'}
                            >
                                {isMuted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
                            </button>
                            <button
                                onClick={toggleFullscreen}
                                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                                aria-label="Fullscreen"
                            >
                                <Maximize2 className="w-3.5 h-3.5 text-white" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Play, Pause, SkipForward, SkipBack, Volume2, VolumeX,
    Music, Sparkles, Compass, Film, ListFilter, Share2
} from 'lucide-react'
import { soundEngine, CURATED_MUSIC_TRACKS } from '@/lib/sound-system'
import type { ThemeConfig, SectionConfig } from '@/lib/types'

interface Props {
    sections: SectionConfig[]
    renderSection: (section: SectionConfig, index: number) => React.ReactNode
    theme: ThemeConfig
    initialMode?: 'guided' | 'interactive'
    autoAdvanceDuration?: number // in seconds, e.g. 7
    allowSound?: boolean
}

export function CinematicScenePlayer({
    sections,
    renderSection,
    theme,
    initialMode = 'guided',
    autoAdvanceDuration = 8,
    allowSound = true,
}: Props) {
    const [mode, setMode] = useState<'guided' | 'interactive'>(initialMode)
    const [currentSceneIndex, setCurrentSceneIndex] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [progress, setProgress] = useState(0)

    // Audio states synced from soundEngine
    const [musicPlaying, setMusicPlaying] = useState(soundEngine.isMusicPlaying)
    const [isMuted, setIsMuted] = useState(soundEngine.isMuted)
    const [showAudioMenu, setShowAudioMenu] = useState(false)

    const timerRef = useRef<number | null>(null)

    // Sync sound engine state
    useEffect(() => {
        const unsubscribe = soundEngine.subscribe(() => {
            setMusicPlaying(soundEngine.isMusicPlaying)
            setIsMuted(soundEngine.isMuted)
        })
        return unsubscribe
    }, [])

    const activeSections = sections.filter(s => s.visible).sort((a, b) => a.order - b.order)
    const totalScenes = activeSections.length
    const currentSection = activeSections[currentSceneIndex] || activeSections[0]

    // Auto-advance in Guided mode
    useEffect(() => {
        if (mode !== 'guided' || !isPlaying || totalScenes <= 1) {
            setProgress(0)
            if (timerRef.current) clearInterval(timerRef.current)
            return
        }

        const intervalMs = 100
        const totalSteps = (autoAdvanceDuration * 1000) / intervalMs
        let currentStep = 0

        timerRef.current = window.setInterval(() => {
            currentStep += 1
            const pct = Math.min(100, (currentStep / totalSteps) * 100)
            setProgress(pct)

            if (currentStep >= totalSteps) {
                // Next scene
                setCurrentSceneIndex(prev => (prev + 1) % totalScenes)
                currentStep = 0
                soundEngine.playSceneTransitionSound()
            }
        }, intervalMs)

        return () => {
            if (timerRef.current) clearInterval(timerRef.current)
        }
    }, [mode, isPlaying, currentSceneIndex, totalScenes, autoAdvanceDuration])

    const goToScene = (index: number) => {
        const next = Math.max(0, Math.min(totalScenes - 1, index))
        setCurrentSceneIndex(next)
        setProgress(0)
        soundEngine.playSceneTransitionSound()
    }

    const currentTrack = CURATED_MUSIC_TRACKS.find(t => t.id === soundEngine.currentTrackId) || CURATED_MUSIC_TRACKS[0]

    return (
        <div className="relative min-h-screen">
            {/* ─── Mode Switcher & Global Scene Header ───────────────────────── */}
            <div className="sticky top-0 z-40 bg-white/70 backdrop-blur-md border-b border-gray-200/50 px-3 py-2 flex items-center justify-between text-xs">
                {/* Left: Mode switcher */}
                <div className="flex items-center gap-1 bg-gray-100/80 p-0.5 rounded-xl">
                    <button
                        type="button"
                        onClick={() => {
                            setMode('guided')
                            setIsPlaying(true)
                            soundEngine.playClickSound()
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                            mode === 'guided'
                                ? 'bg-white text-rose-600 shadow-xs'
                                : 'text-gray-500 hover:text-gray-800'
                        }`}
                    >
                        <Film className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Cinematic Film</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setMode('interactive')
                            setIsPlaying(false)
                            soundEngine.playClickSound()
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                            mode === 'interactive'
                                ? 'bg-white text-rose-600 shadow-xs'
                                : 'text-gray-500 hover:text-gray-800'
                        }`}
                    >
                        <Compass className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Explore All</span>
                    </button>
                </div>

                {/* Center: Scene Indicators (in Guided Mode) */}
                {mode === 'guided' && (
                    <div className="flex items-center gap-1 overflow-x-auto max-w-[200px] sm:max-w-xs px-2">
                        {activeSections.map((sec, idx) => (
                            <button
                                key={sec.id}
                                type="button"
                                onClick={() => goToScene(idx)}
                                className={`h-1.5 rounded-full transition-all ${
                                    idx === currentSceneIndex
                                        ? 'w-6 bg-rose-500'
                                        : 'w-2 bg-gray-300 hover:bg-gray-400'
                                }`}
                                title={`Scene ${idx + 1}`}
                            />
                        ))}
                    </div>
                )}

                {/* Right: Audio Control Button */}
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => {
                            soundEngine.toggleMusic()
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold transition-all border ${
                            musicPlaying
                                ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
                                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                        title="Toggle Wedding Music"
                    >
                        <Music className="w-3.5 h-3.5 text-rose-500" />
                        <span className="text-[11px] truncate max-w-[90px] hidden md:inline">
                            {musicPlaying ? 'Playing' : 'Music Off'}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => soundEngine.toggleMute()}
                        className="p-1.5 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-gray-800"
                        title={isMuted ? 'Unmute' : 'Mute Sound'}
                    >
                        {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-500" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                </div>
            </div>

            {/* ─── SCENE RENDERER ────────────────────────────────────────────── */}
            {mode === 'guided' ? (
                /* GUIDED CINEMATIC SCENE */
                <div className="relative min-h-[85vh] flex flex-col justify-center">
                    {/* Auto-advance Progress Bar */}
                    {isPlaying && (
                        <div className="absolute top-0 left-0 right-0 h-1 bg-rose-100 z-30">
                            <div
                                className="h-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-100 ease-linear"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    )}

                    {/* Scene Transition Container */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentSection?.id || currentSceneIndex}
                            initial={{ opacity: 0, scale: 0.98, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 1.02, y: -15 }}
                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                            className="w-full flex-1 flex flex-col justify-center py-6"
                        >
                            {renderSection(currentSection, currentSceneIndex)}
                        </motion.div>
                    </AnimatePresence>

                    {/* Guided Floating Controls Dock */}
                    <div className="sticky bottom-6 z-40 flex items-center justify-center gap-3 px-4">
                        <div className="bg-white/85 backdrop-blur-md border border-gray-200/80 shadow-xl rounded-full px-4 py-2 flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => goToScene(currentSceneIndex - 1)}
                                disabled={currentSceneIndex === 0}
                                className="p-2 rounded-full hover:bg-gray-100 text-gray-600 disabled:opacity-30 cursor-pointer"
                                title="Previous Scene"
                            >
                                <SkipBack className="w-4 h-4" />
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setIsPlaying(!isPlaying)
                                    soundEngine.playClickSound()
                                }}
                                className="p-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-md hover:scale-105 transition-transform cursor-pointer"
                                title={isPlaying ? 'Pause auto-play' : 'Resume auto-play'}
                            >
                                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                            </button>

                            <button
                                type="button"
                                onClick={() => goToScene(currentSceneIndex + 1)}
                                disabled={currentSceneIndex === totalScenes - 1}
                                className="p-2 rounded-full hover:bg-gray-100 text-gray-600 disabled:opacity-30 cursor-pointer"
                                title="Next Scene"
                            >
                                <SkipForward className="w-4 h-4" />
                            </button>

                            <span className="text-[11px] font-bold text-gray-400 border-l border-gray-200 pl-3">
                                {currentSceneIndex + 1} / {totalScenes}
                            </span>
                        </div>
                    </div>
                </div>
            ) : (
                /* INTERACTIVE EXPLORATION MODE (Scrollable with in-view animations) */
                <div className="space-y-4">
                    {activeSections.map((sec, idx) => (
                        <div key={sec.id} id={`scene-${sec.type}`}>
                            {renderSection(sec, idx)}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

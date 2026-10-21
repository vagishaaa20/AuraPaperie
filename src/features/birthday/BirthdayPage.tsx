import React, { useState, useEffect, useRef } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { getTheme } from '@/lib/theme-registry'
import type { BirthdayExperience, SectionConfig } from '@/lib/types'
import { SurpriseIntroSection } from './sections/SurpriseIntroSection'
import { BirthdayHeroSection } from './sections/BirthdayHeroSection'
import { MemoryScrapbookSection } from './sections/MemoryScrapbookSection'
import { OurStorySection } from './sections/OurStorySection'
import { ThingsILoveSection } from './sections/ThingsILoveSection'
import { BirthdayLetterSection } from './sections/BirthdayLetterSection'
import { BirthdayCakeSection } from './sections/BirthdayCakeSection'
import { HiddenSurpriseSection } from './sections/HiddenSurpriseSection'
import { MusicPlayerSection } from './sections/MusicPlayerSection'
import { CinematicReelSection } from './sections/CinematicReelSection'
import { FinalMessageSection } from './sections/FinalMessageSection'

export default function BirthdayPage() {
    const { slug } = useParams<{ slug: string }>()
    const [experience, setExperience] = useState<BirthdayExperience | null>(null)
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)
    const [introComplete, setIntroComplete] = useState(false)
    const [cakeDone, setCakeDone] = useState(false)
    const [letterRead, setLetterRead] = useState(false)
    const pageRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!slug) return
        supabase
            .from('birthday_experiences')
            .select('*')
            .eq('slug', slug)
            .eq('status', 'published')
            .single()
            .then(({ data, error }) => {
                if (error || !data) setNotFound(true)
                else setExperience(data)
                setLoading(false)
            })
    }, [slug])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    className="text-5xl"
                >
                    🎀
                </motion.div>
            </div>
        )
    }

    if (notFound) {
        return <Navigate to="/404" replace />
    }

    if (!experience) return null

    const theme = getTheme(experience.theme_id)
    const sorted = [...experience.sections]
        .filter(s => s.visible)
        .sort((a, b) => a.order - b.order)

    const sectionProps = {
        experience,
        theme,
        onCakeDone: () => setCakeDone(true),
        onLetterRead: () => setLetterRead(true),
        cakeDone,
        letterRead,
        pageRef,
    }

    return (
        <div
            ref={pageRef}
            className="min-h-screen"
            style={{
                background: theme.style === 'cinematic' ? '#0a0a14' : '#fdf8f8',
                fontFamily: theme.typography.body,
            }}
        >
            {/* Music player (non-visual, floats at top if enabled) */}
            {(() => {
                const musicSection = sorted.find(s => s.type === 'music-player')
                if (musicSection?.config.url) {
                    return <MusicPlayerSection section={musicSection} {...sectionProps} floatingMode />
                }
            })()}

            <AnimatePresence mode="wait">
                {!introComplete ? (
                    (() => {
                        const introSection = sorted.find(s => s.type === 'surprise-intro')
                        return introSection ? (
                            <SurpriseIntroSection
                                key="intro"
                                section={introSection}
                                {...sectionProps}
                                onComplete={() => setIntroComplete(true)}
                            />
                        ) : (
                            <div key="no-intro" />
                        )
                    })()
                ) : (
                    <motion.div key="main-experience" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
                        {sorted
                            .filter(s => s.type !== 'surprise-intro')
                            .map(section => (
                                <SectionRenderer
                                    key={section.id}
                                    section={section}
                                    {...sectionProps}
                                />
                            ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating sparkles for scrapbook themes */}
            {theme.style === 'scrapbook' && introComplete && (
                <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                    {['✨', '💕', '🌸', '⭐', '🎀'].map((e, i) => (
                        <motion.span
                            key={i}
                            className="absolute text-xl opacity-30"
                            style={{ left: `${5 + i * 18}%`, top: `${10 + (i % 3) * 25}%` }}
                            animate={{ y: [-10, 10, -10], rotate: [-5, 5, -5] }}
                            transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
                        >
                            {e}
                        </motion.span>
                    ))}
                </div>
            )}
        </div>
    )
}

// ─── Section renderer ──────────────────────────────────────────────────────────
function SectionRenderer({ section, ...props }: { section: SectionConfig } & Parameters<typeof BirthdayHeroSection>[0]) {
    switch (section.type) {
        case 'birthday-hero': return <BirthdayHeroSection section={section} {...props} />
        case 'memory-scrapbook': return <MemoryScrapbookSection section={section} {...props} />
        case 'our-story': return <OurStorySection section={section} {...props} />
        case 'things-i-love': return <ThingsILoveSection section={section} {...props} />
        case 'birthday-letter': return <BirthdayLetterSection section={section} {...props} onLetterRead={props.onLetterRead} />
        case 'birthday-cake': return <BirthdayCakeSection section={section} {...props} onCakeDone={props.onCakeDone} />
        case 'hidden-surprise': return <HiddenSurpriseSection section={section} {...props} />
        case 'music-player': return <MusicPlayerSection section={section} {...props} />
        case 'cinematic-reel': return <CinematicReelSection section={section} {...props} />
        case 'final-message': return <FinalMessageSection section={section} {...props} />
        default: return null
    }
}


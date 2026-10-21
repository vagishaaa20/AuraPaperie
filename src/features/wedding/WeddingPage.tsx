import React, { useState, useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { getTheme } from '@/lib/theme-registry'
import type { BirthdayExperience, SectionConfig } from '@/lib/types'
import { soundEngine } from '@/lib/sound-system'

// Atmosphere & Player
import { WeddingAtmosphere } from './components/WeddingAtmosphere'
import { CinematicScenePlayer } from './components/CinematicScenePlayer'

// Section Components
import { WeddingCoverSection } from './sections/WeddingCoverSection'
import { WeddingCoupleSection } from './sections/WeddingCoupleSection'
import { WeddingMessageSection } from './sections/WeddingMessageSection'
import { WeddingEventsSection } from './sections/WeddingEventsSection'
import { WeddingCountdownSection } from './sections/WeddingCountdownSection'
import { WeddingVenueSection } from './sections/WeddingVenueSection'
import { WeddingRsvpSection } from './sections/WeddingRsvpSection'
import { WeddingDressCodeSection } from './sections/WeddingDressCodeSection'
import { WeddingTravelSection } from './sections/WeddingTravelSection'
import { WeddingFaqSection } from './sections/WeddingFaqSection'
import { WeddingCtaSection } from './sections/WeddingCtaSection'
import { MemoryScrapbookSection } from '../birthday/sections/MemoryScrapbookSection'
import { CinematicReelSection } from '../birthday/sections/CinematicReelSection'

export default function WeddingPage() {
    const { slug } = useParams<{ slug: string }>()
    const [experience, setExperience] = useState<BirthdayExperience | null>(null)
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)
    const [isUnlocked, setIsUnlocked] = useState(false)

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

    // Cleanup audio on unmount
    useEffect(() => {
        return () => {
            soundEngine.stopMusic()
        }
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-50">
                <div className="text-center space-y-3">
                    <div className="w-10 h-10 border-4 border-rose-400 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-sm font-serif text-stone-500">Unfolding Wedding Invitation...</p>
                </div>
            </div>
        )
    }

    if (notFound || !experience) {
        return <Navigate to="/404" replace />
    }

    const theme = getTheme(experience.theme_id)
    const sortedSections = [...experience.sections]
        .filter(s => s.visible)
        .sort((a, b) => a.order - b.order)

    const coverSection = sortedSections.find(s => s.type === 'wedding-cover')
    const innerSections = sortedSections.filter(s => s.type !== 'wedding-cover')

    const sectionProps = {
        experience,
        theme,
        isUnlocked: true,
        onUnlock: () => setIsUnlocked(true),
    }

    const renderSectionComponent = (section: SectionConfig) => {
        switch (section.type) {
            case 'wedding-cover':
                return <WeddingCoverSection section={section} {...sectionProps} />
            case 'wedding-couple':
                return <WeddingCoupleSection section={section} {...sectionProps} />
            case 'wedding-message':
                return <WeddingMessageSection section={section} {...sectionProps} />
            case 'wedding-events':
                return <WeddingEventsSection section={section} {...sectionProps} />
            case 'wedding-countdown':
                return <WeddingCountdownSection section={section} {...sectionProps} />
            case 'memory-scrapbook':
                return <MemoryScrapbookSection section={section} {...sectionProps} />
            case 'cinematic-reel':
                return <CinematicReelSection section={section} {...sectionProps} />
            case 'wedding-venue':
                return <WeddingVenueSection section={section} {...sectionProps} />
            case 'wedding-dress-code':
                return <WeddingDressCodeSection section={section} {...sectionProps} />
            case 'wedding-travel':
                return <WeddingTravelSection section={section} {...sectionProps} />
            case 'wedding-faq':
                return <WeddingFaqSection section={section} {...sectionProps} />
            case 'wedding-rsvp':
                return (
                    <div id="wedding-rsvp-section">
                        <WeddingRsvpSection section={section} {...sectionProps} />
                    </div>
                )
            case 'wedding-cta':
                return <WeddingCtaSection section={section} {...sectionProps} />
            default:
                return null
        }
    }

    // Initial Gatefold / Wax Seal Opening Experience
    if (!isUnlocked && coverSection) {
        return (
            <div className="relative min-h-screen overflow-hidden">
                <WeddingAtmosphere themeId={experience.theme_id} />
                <WeddingCoverSection
                    section={coverSection}
                    experience={experience}
                    theme={theme}
                    isUnlocked={false}
                    onUnlock={() => setIsUnlocked(true)}
                />
            </div>
        )
    }

    // Unlocked Cinematic Multi-Scene Experience
    return (
        <div
            className="min-h-screen text-gray-900 selection:bg-rose-100 selection:text-rose-900 overflow-x-hidden"
            style={{
                background: theme.palette.background,
                fontFamily: theme.typography.bodyFont,
            }}
        >
            <WeddingAtmosphere themeId={experience.theme_id} />
            <CinematicScenePlayer
                sections={innerSections.length > 0 ? innerSections : sortedSections}
                theme={theme}
                renderSection={(sec) => renderSectionComponent(sec)}
            />
        </div>
    )
}

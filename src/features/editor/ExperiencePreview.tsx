import React from 'react'
import type { BirthdayExperience, SectionConfig } from '@/lib/types'
import { getTheme } from '@/lib/theme-registry'
import { getProjectType } from '@/lib/project-helpers'

// Wedding Section Components
import { WeddingCoverSection } from '../wedding/sections/WeddingCoverSection'
import { WeddingCoupleSection } from '../wedding/sections/WeddingCoupleSection'
import { WeddingMessageSection } from '../wedding/sections/WeddingMessageSection'
import { WeddingEventsSection } from '../wedding/sections/WeddingEventsSection'
import { WeddingCountdownSection } from '../wedding/sections/WeddingCountdownSection'
import { WeddingVenueSection } from '../wedding/sections/WeddingVenueSection'
import { WeddingRsvpSection } from '../wedding/sections/WeddingRsvpSection'
import { WeddingDressCodeSection } from '../wedding/sections/WeddingDressCodeSection'
import { WeddingTravelSection } from '../wedding/sections/WeddingTravelSection'
import { WeddingFaqSection } from '../wedding/sections/WeddingFaqSection'
import { WeddingCtaSection } from '../wedding/sections/WeddingCtaSection'
import { MemoryScrapbookSection } from '../birthday/sections/MemoryScrapbookSection'
import { CinematicReelSection } from '../birthday/sections/CinematicReelSection'
import { WeddingAtmosphere } from '../wedding/components/WeddingAtmosphere'

interface Props {
    experience: BirthdayExperience
    device: 'desktop' | 'tablet' | 'mobile'
}

export default function ExperiencePreview({ experience, device }: Props) {
    const theme = getTheme(experience.theme_id)
    const sorted = [...experience.sections]
        .filter(s => s.visible)
        .sort((a, b) => a.order - b.order)

    const isCinematic = theme.style === 'cinematic'
    const isWedding = getProjectType(experience) === 'wedding'

    return (
        <div
            className="min-h-full relative overflow-hidden"
            style={{
                background: isCinematic ? '#0f0f1a' : theme.palette.background || '#fdf8f8',
                fontFamily: theme.typography.bodyFont,
            }}
        >
            {isWedding && <WeddingAtmosphere themeId={experience.theme_id} />}
            {sorted.map(section => (
                <PreviewSection key={section.id} section={section} experience={experience} theme={theme} isCinematic={isCinematic} />
            ))}

            {sorted.length === 0 && (
                <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
                    No visible sections
                </div>
            )}
        </div>
    )
}

function PreviewSection({ section, experience, theme, isCinematic }: {
    section: SectionConfig
    experience: BirthdayExperience
    theme: ReturnType<typeof getTheme>
    isCinematic: boolean
}) {
    const sectionProps = {
        section,
        experience,
        theme,
        isUnlocked: true,
        onUnlock: () => {},
    }

    switch (section.type) {
        // Dedicated Wedding Sections (Real live rendering)
        case 'wedding-cover':
            return <WeddingCoverSection {...sectionProps} />
        case 'wedding-couple':
            return <WeddingCoupleSection {...sectionProps} />
        case 'wedding-message':
            return <WeddingMessageSection {...sectionProps} />
        case 'wedding-events':
            return <WeddingEventsSection {...sectionProps} />
        case 'wedding-countdown':
            return <WeddingCountdownSection {...sectionProps} />
        case 'wedding-venue':
            return <WeddingVenueSection {...sectionProps} />
        case 'wedding-dress-code':
            return <WeddingDressCodeSection {...sectionProps} />
        case 'wedding-travel':
            return <WeddingTravelSection {...sectionProps} />
        case 'wedding-faq':
            return <WeddingFaqSection {...sectionProps} />
        case 'wedding-rsvp':
            return <WeddingRsvpSection {...sectionProps} />
        case 'wedding-cta':
            return <WeddingCtaSection {...sectionProps} />

        // Shared Visual Sections
        case 'memory-scrapbook':
            return <MemoryScrapbookSection {...sectionProps} />
        case 'cinematic-reel':
            return <CinematicReelSection {...sectionProps} />

        // Birthday Sections
        case 'surprise-intro':
            return (
                <div className="flex flex-col items-center justify-center py-10 px-6 text-center"
                    style={{ background: theme.previewGradient, minHeight: 180 }}>
                    <span className="text-3xl mb-2">🎁</span>
                    <p className="text-white font-bold text-lg">{experience.recipient_name}</p>
                    <p className="text-white/80 text-xs mt-1">Tap to unwrap</p>
                </div>
            )
        case 'birthday-hero':
            return (
                <div className="py-12 px-6 text-center" style={{ background: theme.previewGradient }}>
                    <span className="text-4xl block mb-2">🎂</span>
                    <h2 className="text-2xl font-bold text-white">Happy Birthday, {experience.recipient_name}!</h2>
                    <p className="text-white/80 text-sm mt-1">Celebrating you today & always ✨</p>
                </div>
            )
        case 'our-story':
            return (
                <div className="py-8 px-6 bg-white/50 border-y border-gray-100 my-2">
                    <h3 className="font-bold text-sm text-gray-800 text-center mb-4">Our Story</h3>
                    <div className="space-y-3">
                        {((section.config?.entries as any[]) || [{ title: 'The Beginning', date: 'Day One' }]).slice(0, 3).map((e: any, i: number) => (
                            <div key={i} className="flex gap-3 text-xs">
                                <span className="font-mono text-gray-400 flex-shrink-0">{e.date || '•'}</span>
                                <span className="font-semibold text-gray-700">{e.title || 'Special Memory'}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )
        case 'things-i-love':
            return (
                <div className="py-8 px-6">
                    <h3 className="font-bold text-sm text-gray-800 text-center mb-4">Things I Love About You</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {((section.config?.reasons as any[]) || ['Your kindness', 'Your smile']).slice(0, 4).map((r: any, i: number) => (
                            <div key={i} className="p-3 rounded-xl bg-white border border-gray-100 shadow-xs text-xs text-center font-medium text-gray-700">
                                💕 {typeof r === 'string' ? r : r.title || 'Love'}
                            </div>
                        ))}
                    </div>
                </div>
            )
        case 'birthday-letter':
            return (
                <div className="py-10 px-6 max-w-sm mx-auto my-4 bg-amber-50/80 border border-amber-200/60 rounded-2xl shadow-sm text-center">
                    <span className="text-2xl block mb-2">💌</span>
                    <h4 className="font-serif font-bold text-sm text-amber-900 mb-2">A Letter For You</h4>
                    <p className="text-xs text-amber-800/80 font-serif leading-relaxed line-clamp-3">
                        {(section.config?.letter_text as string) || 'Dearest one, on your special day...'}
                    </p>
                </div>
            )
        case 'birthday-cake':
            return (
                <div className="py-10 px-6 text-center bg-pink-50/50 border-y border-pink-100">
                    <span className="text-4xl block mb-2">🎂</span>
                    <p className="text-xs font-bold text-pink-700 uppercase tracking-wider">Make a Wish & Blow the Candles</p>
                </div>
            )
        case 'hidden-surprise':
            return (
                <div className="py-8 px-6 text-center bg-purple-50/60 border border-dashed border-purple-200 rounded-2xl m-4">
                    <span className="text-2xl block mb-1">🎀</span>
                    <p className="text-xs font-semibold text-purple-700">Scratch to reveal hidden surprise</p>
                </div>
            )
        case 'music-player':
            return (
                <div className="p-4 bg-gray-900 text-white flex items-center justify-between rounded-xl mx-4 my-2">
                    <div className="flex items-center gap-2 text-xs">
                        <span>🎵</span>
                        <span className="font-medium truncate">{(section.config?.track_title as string) || 'Celebration Melody'}</span>
                    </div>
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">Playing</span>
                </div>
            )
        case 'final-message':
            return (
                <div className="py-10 px-6 text-center" style={{ background: theme.previewGradient }}>
                    <p className="text-white text-sm font-medium leading-relaxed line-clamp-4">
                        {(section.config?.message as string) ?? `Happy Birthday, ${experience.recipient_name}! 🎉`}
                    </p>
                </div>
            )

        default:
            return null
    }
}

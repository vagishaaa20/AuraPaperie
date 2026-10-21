import React from 'react'
import type { SectionConfig, BirthdayExperience } from '@/lib/types'
import SurpriseIntroEditor from './sections/SurpriseIntroEditor'
import BirthdayHeroEditor from './sections/BirthdayHeroEditor'
import MemoryScrapbookEditor from './sections/MemoryScrapbookEditor'
import OurStoryEditor from './sections/OurStoryEditor'
import ThingsILoveEditor from './sections/ThingsILoveEditor'
import BirthdayLetterEditor from './sections/BirthdayLetterEditor'
import BirthdayCakeEditor from './sections/BirthdayCakeEditor'
import HiddenSurpriseEditor from './sections/HiddenSurpriseEditor'
import MusicPlayerEditor from './sections/MusicPlayerEditor'
import CinematicReelEditor from './sections/CinematicReelEditor'
import FinalMessageEditor from './sections/FinalMessageEditor'

// Wedding Editors
import WeddingCoverEditor from '../wedding/sections/WeddingCoverEditor'
import WeddingCoupleEditor from '../wedding/sections/WeddingCoupleEditor'
import WeddingMessageEditor from '../wedding/sections/WeddingMessageEditor'
import WeddingEventsEditor from '../wedding/sections/WeddingEventsEditor'
import WeddingCountdownEditor from '../wedding/sections/WeddingCountdownEditor'
import WeddingVenueEditor from '../wedding/sections/WeddingVenueEditor'
import WeddingRsvpEditor from '../wedding/sections/WeddingRsvpEditor'
import WeddingDressCodeEditor from '../wedding/sections/WeddingDressCodeEditor'
import WeddingTravelEditor from '../wedding/sections/WeddingTravelEditor'
import WeddingFaqEditor from '../wedding/sections/WeddingFaqEditor'
import WeddingCtaEditor from '../wedding/sections/WeddingCtaEditor'

interface Props {
    section: SectionConfig
    experience: BirthdayExperience
    onChange: (updated: SectionConfig) => void
}

export default function SectionEditor({ section, experience, onChange }: Props) {
    const updateConfig = (config: Record<string, unknown>) => {
        onChange({ ...section, config })
    }

    const editorProps = { section, experience, config: (section.config || {}) as Record<string, unknown>, onChange: updateConfig }

    const editors: Record<string, React.FC<typeof editorProps>> = {
        // Birthday sections
        'surprise-intro': SurpriseIntroEditor,
        'birthday-hero': BirthdayHeroEditor,
        'memory-scrapbook': MemoryScrapbookEditor,
        'our-story': OurStoryEditor,
        'things-i-love': ThingsILoveEditor,
        'birthday-letter': BirthdayLetterEditor,
        'birthday-cake': BirthdayCakeEditor,
        'hidden-surprise': HiddenSurpriseEditor,
        'music-player': MusicPlayerEditor,
        'cinematic-reel': CinematicReelEditor,
        'final-message': FinalMessageEditor,

        // Wedding sections
        'wedding-cover': WeddingCoverEditor,
        'wedding-couple': WeddingCoupleEditor,
        'wedding-message': WeddingMessageEditor,
        'wedding-events': WeddingEventsEditor,
        'wedding-countdown': WeddingCountdownEditor,
        'wedding-venue': WeddingVenueEditor,
        'wedding-rsvp': WeddingRsvpEditor,
        'wedding-dress-code': WeddingDressCodeEditor,
        'wedding-travel': WeddingTravelEditor,
        'wedding-faq': WeddingFaqEditor,
        'wedding-cta': WeddingCtaEditor,
    }

    const Editor = editors[section.type]
    if (!Editor) return <div className="p-6 text-gray-400">No editor for section type: {section.type}</div>

    return (
        <div className="h-full overflow-y-auto">
            <Editor {...editorProps} />
        </div>
    )
}

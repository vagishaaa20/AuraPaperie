import React, { useState } from 'react'
import { motion, Reorder } from 'framer-motion'
import { GripVertical, Eye, EyeOff, Plus, Copy, Trash2, RotateCcw } from 'lucide-react'
import type { SectionConfig, SectionType, ProjectType } from '@/lib/types'
import { generateId } from '@/lib/utils'
import toast from 'react-hot-toast'

export const SECTION_METADATA: Record<string, { label: string; emoji: string; description: string }> = {
    // Wedding Sections
    'wedding-cover': { label: 'Invitation Cover', emoji: '💌', description: 'Monogram, couple names, date & envelope open' },
    'wedding-couple': { label: 'The Happy Couple', emoji: '💍', description: 'Portraits, personal bios, story & host names' },
    'wedding-message': { label: 'Invitation Wording', emoji: '📜', description: 'Formal blessing, quote & warm welcome note' },
    'wedding-events': { label: 'Events Itinerary', emoji: '📅', description: 'Mehendi, Sangeet, Ceremony, Reception schedule' },
    'wedding-countdown': { label: 'Countdown Timer', emoji: '⏳', description: 'Live animated countdown to the wedding' },
    'wedding-venue': { label: 'Venue & Directions', emoji: '📍', description: 'Map link, address, parking & arrival guide' },
    'wedding-rsvp': { label: 'Guest RSVP Form', emoji: '✉️', description: 'Interactive attendance, guest count & meal choice' },
    'wedding-dress-code': { label: 'Dress Code Guide', emoji: '👗', description: 'Attire suggestions & color palette for guests' },
    'wedding-travel': { label: 'Travel & Accommodations', emoji: '🏨', description: 'Hotel room blocks, discount codes & shuttles' },
    'wedding-faq': { label: 'Guest FAQs', emoji: '❓', description: 'Children, plus-ones, registry & parking answers' },
    'wedding-cta': { label: 'Closing & Save-The-Date', emoji: '💖', description: 'Final blessing, calendar button & warm signoff' },

    // Birthday / Shared Sections
    'memory-scrapbook': { label: 'Photo Scrapbook', emoji: '📸', description: 'Polaroids, captions, and memory collage' },
    'cinematic-reel': { label: 'Cinematic Reel', emoji: '🎬', description: 'Fullscreen musical photo slideshow' },
    'music-player': { label: 'Background Music', emoji: '🎵', description: 'Ambient celebration audio player' },
    'surprise-intro': { label: 'Surprise Intro', emoji: '🎁', description: 'Opening gift box or envelope reveal' },
    'birthday-hero': { label: 'Hero Banner', emoji: '🎂', description: 'Header with confetti, name & age' },
    'our-story': { label: 'Journey Timeline', emoji: '📖', description: 'Milestones and key memories over time' },
    'things-i-love': { label: 'Things I Adore', emoji: '💕', description: 'Cards highlighting special qualities' },
    'birthday-letter': { label: 'Heartfelt Letter', emoji: '💌', description: 'Parchment letter with wax seal' },
    'birthday-cake': { label: 'Interactive Cake', emoji: '🎂', description: 'Blow out real candles on screen' },
    'hidden-surprise': { label: 'Hidden Surprise', emoji: '🎀', description: 'Secret message scratch card' },
    'final-message': { label: 'Final Message', emoji: '✨', description: 'Closing birthday wishes and celebration' },
}

const WEDDING_SECTION_TYPES: SectionType[] = [
    'wedding-cover',
    'wedding-couple',
    'wedding-message',
    'wedding-events',
    'wedding-countdown',
    'wedding-venue',
    'wedding-rsvp',
    'wedding-dress-code',
    'wedding-travel',
    'wedding-faq',
    'wedding-cta',
    'memory-scrapbook',
    'cinematic-reel',
    'music-player',
]

const BIRTHDAY_SECTION_TYPES: SectionType[] = [
    'surprise-intro',
    'birthday-hero',
    'memory-scrapbook',
    'our-story',
    'things-i-love',
    'birthday-letter',
    'birthday-cake',
    'hidden-surprise',
    'music-player',
    'cinematic-reel',
    'final-message',
]

interface Props {
    sections: SectionConfig[]
    selectedSectionId: string | null
    projectType?: ProjectType
    onSelectSection: (id: string) => void
    onUpdateSections: (sections: SectionConfig[]) => void
}

export default function SectionManager({
    sections,
    selectedSectionId,
    projectType = 'birthday',
    onSelectSection,
    onUpdateSections,
}: Props) {
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
    const sorted = [...sections].sort((a, b) => a.order - b.order)

    const toggleVisibility = (id: string) => {
        onUpdateSections(
            sections.map(s => (s.id === id ? { ...s, visible: !s.visible } : s))
        )
    }

    const handleReorder = (newOrder: SectionConfig[]) => {
        onUpdateSections(newOrder.map((s, i) => ({ ...s, order: i })))
    }

    const handleDuplicate = (id: string) => {
        const target = sections.find(s => s.id === id)
        if (!target) return
        const duplicated: SectionConfig = {
            id: generateId(),
            type: target.type,
            visible: true,
            order: target.order + 1,
            config: JSON.parse(JSON.stringify(target.config || {})),
        }
        const updated = [...sections]
        updated.splice(target.order + 1, 0, duplicated)
        onUpdateSections(updated.map((s, i) => ({ ...s, order: i })))
        onSelectSection(duplicated.id)
        toast.success(`Duplicated ${SECTION_METADATA[target.type]?.label || 'section'}`)
    }

    const handleDelete = (id: string) => {
        if (sections.length <= 1) {
            toast.error('Invitation must have at least one section.')
            return
        }
        const remaining = sections.filter(s => s.id !== id).map((s, i) => ({ ...s, order: i }))
        onUpdateSections(remaining)
        if (selectedSectionId === id) {
            onSelectSection(remaining[0]?.id || '')
        }
        setConfirmDeleteId(null)
        toast.success('Section removed')
    }

    const handleReset = (id: string) => {
        onUpdateSections(
            sections.map(s => (s.id === id ? { ...s, config: {} } : s))
        )
        toast.success('Section styling reset to defaults')
    }

    const addSection = (type: SectionType) => {
        const alreadyExists = sections.some(s => s.type === type)
        if (alreadyExists) {
            onUpdateSections(
                sections.map(s => (s.type === type ? { ...s, visible: true } : s))
            )
            const existing = sections.find(s => s.type === type)
            if (existing) onSelectSection(existing.id)
            toast.success(`Restored ${SECTION_METADATA[type]?.label || type}`)
            return
        }

        const newSection: SectionConfig = {
            id: generateId(),
            type,
            visible: true,
            order: sections.length,
            config: {},
        }

        onUpdateSections([...sections, newSection])
        onSelectSection(newSection.id)
        toast.success(`Added ${SECTION_METADATA[type]?.label || type}`)
    }

    const relevantTypes = projectType === 'wedding' ? WEDDING_SECTION_TYPES : BIRTHDAY_SECTION_TYPES

    const inactiveTypes = relevantTypes.filter(t => {
        const s = sections.find(sec => sec.type === t)
        return !s || !s.visible
    })

    return (
        <div className="p-4 space-y-6">
            <div>
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Active Sections ({sections.filter(s => s.visible).length}/{sections.length})
                    </h3>
                    <span className="text-[10px] text-gray-400">Drag items to reorder</span>
                </div>

                <Reorder.Group axis="y" values={sorted} onReorder={handleReorder} className="space-y-1.5">
                    {sorted.map(section => {
                        const meta = SECTION_METADATA[section.type] || { label: section.type, emoji: '✨', description: '' }
                        const isSelected = section.id === selectedSectionId

                        return (
                            <Reorder.Item
                                key={section.id}
                                value={section}
                                className={`flex items-center gap-2 p-2.5 rounded-xl cursor-pointer transition-all group ${
                                    isSelected
                                        ? 'bg-rose-50 border border-rose-200 shadow-xs'
                                        : 'hover:bg-gray-50 border border-transparent'
                                } ${!section.visible ? 'opacity-40' : ''}`}
                                onClick={() => onSelectSection(section.id)}
                            >
                                <div className="flex-shrink-0 cursor-grab text-gray-300 hover:text-gray-500">
                                    <GripVertical className="w-4 h-4" />
                                </div>
                                <span className="text-base">{meta.emoji}</span>
                                <div className="flex-1 min-w-0">
                                    <span className={`text-xs sm:text-sm font-semibold truncate block ${isSelected ? 'text-rose-700' : 'text-gray-800'}`}>
                                        {meta.label}
                                    </span>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={e => {
                                            e.stopPropagation()
                                            handleDuplicate(section.id)
                                        }}
                                        className="p-1 rounded hover:bg-white text-gray-400 hover:text-gray-700"
                                        title="Duplicate Section"
                                    >
                                        <Copy className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={e => {
                                            e.stopPropagation()
                                            toggleVisibility(section.id)
                                        }}
                                        className="p-1 rounded hover:bg-white text-gray-400 hover:text-gray-700"
                                        title={section.visible ? 'Hide Section' : 'Show Section'}
                                    >
                                        {section.visible ? <Eye className="w-3.5 h-3.5 text-gray-500" /> : <EyeOff className="w-3.5 h-3.5 text-gray-300" />}
                                    </button>
                                    <button
                                        onClick={e => {
                                            e.stopPropagation()
                                            if (confirmDeleteId === section.id) {
                                                handleDelete(section.id)
                                            } else {
                                                setConfirmDeleteId(section.id)
                                                setTimeout(() => setConfirmDeleteId(null), 3500)
                                            }
                                        }}
                                        className={`p-1 rounded transition-colors ${
                                            confirmDeleteId === section.id
                                                ? 'bg-red-500 text-white font-bold text-[10px] px-1.5'
                                                : 'hover:bg-white text-gray-400 hover:text-red-500'
                                        }`}
                                        title={confirmDeleteId === section.id ? 'Click again to confirm delete' : 'Delete Section'}
                                    >
                                        {confirmDeleteId === section.id ? 'Delete?' : <Trash2 className="w-3.5 h-3.5" />}
                                    </button>
                                </div>
                            </Reorder.Item>
                        )
                    })}
                </Reorder.Group>
            </div>

            {inactiveTypes.length > 0 && (
                <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                        Add Available Section
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {inactiveTypes.map(type => {
                            const meta = SECTION_METADATA[type] || { label: type, emoji: '✨', description: '' }
                            return (
                                <button
                                    key={type}
                                    onClick={() => addSection(type)}
                                    className="flex items-start gap-2.5 p-2.5 bg-gray-50 hover:bg-rose-50/70 hover:border-rose-200 rounded-xl transition-all border border-gray-100 text-left cursor-pointer group"
                                >
                                    <span className="text-lg">{meta.emoji}</span>
                                    <div className="flex-1 min-w-0">
                                        <span className="text-xs font-bold text-gray-800 group-hover:text-rose-700 truncate block">
                                            {meta.label}
                                        </span>
                                        {meta.description && (
                                            <span className="text-[10px] text-gray-400 line-clamp-1">
                                                {meta.description}
                                            </span>
                                        )}
                                    </div>
                                    <Plus className="w-3.5 h-3.5 text-gray-400 group-hover:text-rose-500 flex-shrink-0 mt-0.5" />
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}

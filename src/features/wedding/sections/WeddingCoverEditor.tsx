import React from 'react'
import type { SectionConfig, BirthdayExperience } from '@/lib/types'
import { Heart, Sparkles, Image as ImageIcon } from 'lucide-react'

interface Props {
    section: SectionConfig
    experience: BirthdayExperience
    config: Record<string, unknown>
    onChange: (config: Record<string, unknown>) => void
}

const PRESET_OPENINGS = [
    { id: 'wax-seal', name: 'Royal Wax Seal', icon: '💌' },
    { id: 'envelope', name: 'Unfolding Envelope', icon: '✉️' },
    { id: 'gold-badge', name: 'Golden Monogram', icon: '✨' },
    { id: 'cinematic', name: 'Cinematic Fade In', icon: '🎬' },
]

export default function WeddingCoverEditor({ config, onChange }: Props) {
    const update = (key: string, val: unknown) => {
        onChange({ ...config, [key]: val })
    }

    return (
        <div className="p-6 space-y-6 max-w-xl mx-auto">
            <div>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-rose-500 fill-current" />
                    Invitation Cover & Envelope
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                    The grand opening experience your guests see when tapping your link.
                </p>
            </div>

            {/* Couple Names */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Partner 1 Name</label>
                    <input
                        type="text"
                        value={(config.partner1_name as string) ?? ''}
                        onChange={e => update('partner1_name', e.target.value)}
                        placeholder="e.g. Aarav"
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Partner 2 Name</label>
                    <input
                        type="text"
                        value={(config.partner2_name as string) ?? ''}
                        onChange={e => update('partner2_name', e.target.value)}
                        placeholder="e.g. Meera"
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
                    />
                </div>
            </div>

            {/* Title / Invitation Heading */}
            <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Header Wording</label>
                <input
                    type="text"
                    value={(config.title as string) ?? 'The Wedding Celebration Of'}
                    onChange={e => update('title', e.target.value)}
                    placeholder="e.g. The Wedding Celebration Of"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
                />
            </div>

            {/* Subtitle / Family Invitation line */}
            <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Subtitle / Family Line</label>
                <input
                    type="text"
                    value={(config.subtitle as string) ?? 'Together with our families, we joyfully invite you'}
                    onChange={e => update('subtitle', e.target.value)}
                    placeholder="e.g. Together with our families..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
                />
            </div>

            {/* Date & Location */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Wedding Date</label>
                    <input
                        type="text"
                        value={(config.wedding_date as string) ?? ''}
                        onChange={e => update('wedding_date', e.target.value)}
                        placeholder="e.g. December 18, 2026"
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">City / Region</label>
                    <input
                        type="text"
                        value={(config.venue_city as string) ?? ''}
                        onChange={e => update('venue_city', e.target.value)}
                        placeholder="e.g. Napa Valley, California"
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
                    />
                </div>
            </div>

            {/* Opening Animation Style */}
            <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Opening Interaction Style</label>
                <div className="grid grid-cols-2 gap-2">
                    {PRESET_OPENINGS.map(style => {
                        const isSelected = (config.opening_style as string ?? 'wax-seal') === style.id
                        return (
                            <button
                                key={style.id}
                                type="button"
                                onClick={() => update('opening_style', style.id)}
                                className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all ${
                                    isSelected
                                        ? 'bg-rose-50 border-rose-400 text-rose-800 ring-2 ring-rose-200 font-semibold'
                                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                <span className="text-xl">{style.icon}</span>
                                <span className="text-xs">{style.name}</span>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Button Text */}
            <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">“Open Invitation” Button Text</label>
                <input
                    type="text"
                    value={(config.button_text as string) ?? 'Open Invitation'}
                    onChange={e => update('button_text', e.target.value)}
                    placeholder="e.g. Open Invitation"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
                />
            </div>

            {/* Cover Background Photo */}
            <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Cover Artwork / Background URL (Optional)</label>
                <div className="flex gap-2">
                    <input
                        type="url"
                        value={(config.cover_image as string) ?? ''}
                        onChange={e => update('cover_image', e.target.value)}
                        placeholder="https://... (leave empty for theme default)"
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-rose-400 focus:outline-none"
                    />
                </div>
            </div>
        </div>
    )
}

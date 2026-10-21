import React from 'react'
import type { SectionConfig, BirthdayExperience } from '@/lib/types'
import { FileText } from 'lucide-react'

interface Props {
    section: SectionConfig
    experience: BirthdayExperience
    config: Record<string, unknown>
    onChange: (config: Record<string, unknown>) => void
}

const QUOTE_PRESETS = [
    { label: 'Emily Brontë (Soulmate)', text: '“Whatever our souls are made of, his and mine are the same.”' },
    { label: 'Corinthians (Sacred Love)', text: '“Love is patient, love is kind. It always protects, always trusts, always hopes, always perseveres.”' },
    { label: 'Rumi (Destiny)', text: '“Lovers don’t finally meet somewhere. They’re in each other all along.”' },
    { label: 'Sanskrit Blessing (Mangalam)', text: '“May our minds walk together, our hearts beat as one, and our spirits forever rejoice in love.”' },
    { label: 'Classic Romance', text: '“Two lives, two hearts, joined together in friendship, united forever in love.”' },
]

export default function WeddingMessageEditor({ config, onChange }: Props) {
    const update = (key: string, val: unknown) => {
        onChange({ ...config, [key]: val })
    }

    return (
        <div className="p-6 space-y-6 max-w-xl mx-auto">
            <div>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-rose-500" />
                    Formal Invitation Wording
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                    Compose the heartfelt words, quote, or blessing inviting your guests.
                </p>
            </div>

            {/* Heading */}
            <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Section Heading</label>
                <input
                    type="text"
                    value={(config.heading as string) ?? 'A Cordial Invitation'}
                    onChange={e => update('heading', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
                />
            </div>

            {/* Quote Presets */}
            <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Inspirational Quote / Verse Presets</label>
                <select
                    onChange={e => {
                        if (e.target.value) update('quote', e.target.value)
                    }}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs text-gray-700 mb-2 focus:ring-2 focus:ring-rose-400 focus:outline-none"
                    defaultValue=""
                >
                    <option value="" disabled>Choose a preset quote...</option>
                    {QUOTE_PRESETS.map((q, idx) => (
                        <option key={idx} value={q.text}>{q.label}</option>
                    ))}
                </select>
                <textarea
                    rows={2}
                    value={(config.quote as string) ?? ''}
                    onChange={e => update('quote', e.target.value)}
                    placeholder="Enter custom quote or poem..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm italic focus:ring-2 focus:ring-rose-400 focus:outline-none"
                />
            </div>

            {/* Main Invitation Body */}
            <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Invitation Body Text</label>
                <textarea
                    rows={5}
                    value={(config.body as string) ?? ''}
                    onChange={e => update('body', e.target.value)}
                    placeholder="Because you have shared in our lives with your love and friendship..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm leading-relaxed focus:ring-2 focus:ring-rose-400 focus:outline-none"
                />
            </div>

            {/* Alignment */}
            <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Text Alignment</label>
                <div className="flex gap-2">
                    {['center', 'left'].map(align => (
                        <button
                            key={align}
                            type="button"
                            onClick={() => update('align', align)}
                            className={`flex-1 py-2 rounded-xl text-xs font-semibold border capitalize transition-all ${
                                (config.align ?? 'center') === align
                                    ? 'bg-rose-50 border-rose-400 text-rose-700'
                                    : 'bg-white border-gray-200 text-gray-600'
                            }`}
                        >
                            {align} Aligned
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

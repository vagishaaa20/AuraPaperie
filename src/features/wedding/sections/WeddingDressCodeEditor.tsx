import React from 'react'
import type { SectionConfig, BirthdayExperience } from '@/lib/types'
import { Shirt } from 'lucide-react'

interface Props {
    section: SectionConfig
    experience: BirthdayExperience
    config: Record<string, unknown>
    onChange: (config: Record<string, unknown>) => void
}

export default function WeddingDressCodeEditor({ config, onChange }: Props) {
    const update = (key: string, val: unknown) => {
        onChange({ ...config, [key]: val })
    }

    return (
        <div className="p-6 space-y-6 max-w-xl mx-auto">
            <div>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <Shirt className="w-5 h-5 text-rose-500" />
                    Dress Code & Attire Suggestions
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                    Guide your guests on the desired fashion aesthetic and colors for your events.
                </p>
            </div>

            <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Title</label>
                <input
                    type="text"
                    value={(config.title as string) ?? 'Dress Code & Attire'}
                    onChange={e => update('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
                />
            </div>

            <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Attire Style / Tagline</label>
                <input
                    type="text"
                    value={(config.attire_style as string) ?? 'Festive Elegance & Traditional Glamour'}
                    onChange={e => update('attire_style', e.target.value)}
                    placeholder="e.g. Black Tie Optional / Traditional Festive"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
                />
            </div>

            <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">General Description</label>
                <textarea
                    rows={2}
                    value={(config.description as string) ?? ''}
                    onChange={e => update('description', e.target.value)}
                    placeholder="We would love to see you adorned in joyful, vibrant colors! Feel free to wear formal or fusion attire."
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Women’s Guide</label>
                    <textarea
                        rows={2}
                        value={(config.women_guide as string) ?? ''}
                        onChange={e => update('women_guide', e.target.value)}
                        placeholder="Lehengas, sarees, evening gowns..."
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Men’s Guide</label>
                    <textarea
                        rows={2}
                        value={(config.men_guide as string) ?? ''}
                        onChange={e => update('men_guide', e.target.value)}
                        placeholder="Sherwanis, suits, bandhgalas..."
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Color Palette Suggestions</label>
                <input
                    type="text"
                    value={(config.color_notes as string) ?? ''}
                    onChange={e => update('color_notes', e.target.value)}
                    placeholder="e.g. Pastels, jewel tones, and gold accents are warmly encouraged."
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
                />
            </div>
        </div>
    )
}

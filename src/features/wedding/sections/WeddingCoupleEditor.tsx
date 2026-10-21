import React, { useState } from 'react'
import { Heart, Upload, Trash2 } from 'lucide-react'
import type { SectionConfig, BirthdayExperience } from '@/lib/types'

interface Props {
    section: SectionConfig
    experience: BirthdayExperience
    config: Record<string, unknown>
    onChange: (config: Record<string, unknown>) => void
}

export default function WeddingCoupleEditor({ config, onChange }: Props) {
    const update = (key: string, value: unknown) => onChange({ ...config, [key]: value })

    return (
        <div className="p-6 space-y-6">
            <div>
                <h2 className="font-display font-bold text-xl text-gray-900 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-rose-500" />
                    The Couple Details
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                    Names, love story, and portrait photos of the partners.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Partner 1</label>
                    <input
                        type="text"
                        value={(config.partner1_name as string) ?? ''}
                        placeholder="Aarav"
                        onChange={e => update('partner1_name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Partner 2</label>
                    <input
                        type="text"
                        value={(config.partner2_name as string) ?? ''}
                        placeholder="Meera"
                        onChange={e => update('partner2_name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Our Story / Quote</label>
                <textarea
                    rows={3}
                    value={(config.story as string) ?? ''}
                    placeholder="Two souls with but a single thought, two hearts that beat as one..."
                    onChange={e => update('story', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                />
            </div>

            <div className="space-y-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">Couple Photo URL</label>
                <input
                    type="url"
                    value={(config.couple_photo as string) ?? ''}
                    placeholder="https://.../couple.jpg"
                    onChange={e => update('couple_photo', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                />
            </div>
        </div>
    )
}

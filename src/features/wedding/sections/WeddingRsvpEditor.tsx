import React from 'react'
import { Send } from 'lucide-react'
import type { SectionConfig, BirthdayExperience } from '@/lib/types'

interface Props {
    section: SectionConfig
    experience: BirthdayExperience
    config: Record<string, unknown>
    onChange: (config: Record<string, unknown>) => void
}

export default function WeddingRsvpEditor({ config, onChange }: Props) {
    const update = (key: string, value: unknown) => onChange({ ...config, [key]: value })

    return (
        <div className="p-6 space-y-6">
            <div>
                <h2 className="font-display font-bold text-xl text-gray-900 flex items-center gap-2">
                    <Send className="w-5 h-5 text-rose-500" />
                    Guest RSVP Settings
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                    Guests can confirm attendance, guest counts, and dietary notes directly from the link.
                </p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                        RSVP Title
                    </label>
                    <input
                        type="text"
                        value={(config.title as string) ?? 'Will You Join Us?'}
                        onChange={e => update('title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                        Subtitle / Instructions
                    </label>
                    <input
                        type="text"
                        value={(config.subtitle as string) ?? 'Please let us know if you can make it to our special celebration'}
                        onChange={e => update('subtitle', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                        RSVP Deadline Date
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. November 15, 2026"
                        value={(config.deadline as string) ?? ''}
                        onChange={e => update('deadline', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                    />
                </div>
            </div>
        </div>
    )
}

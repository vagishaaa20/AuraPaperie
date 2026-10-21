import React from 'react'
import { Calendar } from 'lucide-react'
import type { SectionConfig, BirthdayExperience } from '@/lib/types'

interface Props {
    section: SectionConfig
    experience: BirthdayExperience
    config: Record<string, unknown>
    onChange: (config: Record<string, unknown>) => void
}

export default function WeddingCountdownEditor({ config, onChange }: Props) {
    const update = (key: string, value: unknown) => onChange({ ...config, [key]: value })

    return (
        <div className="p-6 space-y-6">
            <div>
                <h2 className="font-display font-bold text-xl text-gray-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-rose-500" />
                    Live Wedding Countdown
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                    Displays days, hours, minutes, and seconds until the wedding ceremony.
                </p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                        Heading Title
                    </label>
                    <input
                        type="text"
                        value={(config.title as string) ?? 'Counting Down to Forever'}
                        onChange={e => update('title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                        Target Date & Time
                    </label>
                    <input
                        type="datetime-local"
                        value={(config.target_date as string) ?? '2026-12-18T10:00'}
                        onChange={e => update('target_date', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                    />
                </div>
            </div>
        </div>
    )
}

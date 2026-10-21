import React from 'react'
import type { SectionConfig, BirthdayExperience } from '@/lib/types'

interface Props {
    section: SectionConfig
    experience: BirthdayExperience
    config: Record<string, unknown>
    onChange: (config: Record<string, unknown>) => void
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            {hint && <p className="text-xs text-gray-400 mb-1.5">{hint}</p>}
            {children}
        </div>
    )
}

export default function BirthdayHeroEditor({ experience, config, onChange }: Props) {
    const update = (key: string, value: unknown) => onChange({ ...config, [key]: value })

    return (
        <div className="p-6 space-y-6">
            <div>
                <h2 className="font-display font-bold text-xl text-gray-900">🎂 Birthday Hero</h2>
                <p className="text-sm text-gray-400 mt-1">The first thing the birthday person sees after the intro</p>
            </div>

            <Field label="Main heading">
                <input type="text"
                    value={(config.heading as string) ?? `Happy Birthday, ${experience.recipient_name}!`}
                    onChange={e => update('heading', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                    placeholder={`Happy Birthday, ${experience.recipient_name}!`}
                />
            </Field>

            <Field label="Subtitle" hint="Optional line below the main heading">
                <input type="text"
                    value={(config.subtitle as string) ?? ''}
                    onChange={e => update('subtitle', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                    placeholder="e.g. Today is all about you ✨"
                />
            </Field>

            <Field label="Hero photo URL" hint="Paste a photo URL or upload from the memory library">
                <input type="url"
                    value={(config.photo_url as string) ?? ''}
                    onChange={e => update('photo_url', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                    placeholder="https://... or leave blank for decorative background"
                />
            </Field>

            <div className="flex items-center justify-between py-3 border-t border-gray-100">
                <div>
                    <p className="text-sm font-medium text-gray-700">Show floating decorations</p>
                    <p className="text-xs text-gray-400">Theme-specific particles around the hero</p>
                </div>
                <button
                    onClick={() => update('show_decorations', !(config.show_decorations ?? true))}
                    className={`relative w-11 h-6 rounded-full transition-colors ${(config.show_decorations ?? true) ? 'bg-rose-500' : 'bg-gray-200'}`}
                    role="switch"
                    aria-checked={(config.show_decorations ?? true) as boolean}
                >
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${(config.show_decorations ?? true) ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
            </div>
        </div>
    )
}

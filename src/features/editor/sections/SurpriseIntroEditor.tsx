import React from 'react'
import type { SectionConfig, BirthdayExperience, IntroStyle } from '@/lib/types'

interface Props {
    section: SectionConfig
    experience: BirthdayExperience
    config: Record<string, unknown>
    onChange: (config: Record<string, unknown>) => void
}

const INTRO_STYLES: { value: IntroStyle; label: string; description: string; emoji: string }[] = [
    { value: 'gift-box', label: 'Gift Box', description: 'Ribbon unties, box opens to reveal greeting', emoji: '🎁' },
    { value: 'sealed-letter', label: 'Sealed Letter', description: 'Envelope opens to reveal a note', emoji: '✉️' },
    { value: 'hidden-polaroid', label: 'Hidden Polaroid', description: 'Photo revealed from paper cover', emoji: '📷' },
    { value: 'unwrap', label: 'Unwrap Surprise', description: 'Tap to peel away wrapping paper', emoji: '🎀' },
    { value: 'secret-door', label: 'Secret Door', description: 'Door or curtain opens into experience', emoji: '🚪' },
    { value: 'cinematic-reveal', label: 'Cinematic Reveal', description: 'Animated typography and atmosphere', emoji: '🎬' },
    { value: 'simple-intro', label: 'Simple Intro', description: 'Clean greeting with a button to open', emoji: '✨' },
]

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
            {children}
        </div>
    )
}

export default function SurpriseIntroEditor({ experience, config, onChange }: Props) {
    const update = (key: string, value: unknown) => onChange({ ...config, [key]: value })
    const introStyle = (config.style as IntroStyle) ?? experience.intro_settings.style

    return (
        <div className="p-6 space-y-6">
            <div>
                <h2 className="font-display font-bold text-xl text-gray-900">🎁 Surprise Intro</h2>
                <p className="text-sm text-gray-400 mt-1">Configure how the birthday person discovers the experience</p>
            </div>

            <Field label="Opening style">
                <div className="grid gap-2">
                    {INTRO_STYLES.map(style => (
                        <button
                            key={style.value}
                            onClick={() => update('style', style.value)}
                            className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${introStyle === style.value
                                    ? 'border-rose-400 bg-rose-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <span className="text-2xl">{style.emoji}</span>
                            <div>
                                <p className="font-semibold text-sm text-gray-900">{style.label}</p>
                                <p className="text-xs text-gray-400">{style.description}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </Field>

            <Field label="Teaser text">
                <input
                    type="text"
                    value={(config.teaser_text as string) ?? experience.intro_settings.teaser_text}
                    onChange={e => update('teaser_text', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                    placeholder="Something special is waiting for you..."
                />
            </Field>

            <Field label="Revealed greeting">
                <input
                    type="text"
                    value={(config.greeting as string) ?? experience.intro_settings.greeting}
                    onChange={e => update('greeting', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                    placeholder={`Happy Birthday, ${experience.recipient_name}! 🎉`}
                />
            </Field>

            <Field label="Animation speed">
                <div className="flex gap-2">
                    {(['slow', 'normal', 'fast'] as const).map(speed => (
                        <button
                            key={speed}
                            onClick={() => update('animation_speed', speed)}
                            className={`flex-1 py-2 rounded-xl text-xs font-semibold border capitalize transition-all ${(config.animation_speed ?? 'normal') === speed
                                    ? 'bg-rose-50 border-rose-300 text-rose-700'
                                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                                }`}
                        >
                            {speed}
                        </button>
                    ))}
                </div>
            </Field>

            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-700">Allow skip</p>
                    <p className="text-xs text-gray-400">Recipient can skip the intro animation</p>
                </div>
                <button
                    onClick={() => update('skip_enabled', !(config.skip_enabled ?? true))}
                    className={`relative w-11 h-6 rounded-full transition-colors ${(config.skip_enabled ?? true) ? 'bg-rose-500' : 'bg-gray-200'}`}
                    role="switch"
                    aria-checked={(config.skip_enabled ?? true) as boolean}
                >
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${(config.skip_enabled ?? true) ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
            </div>
        </div>
    )
}

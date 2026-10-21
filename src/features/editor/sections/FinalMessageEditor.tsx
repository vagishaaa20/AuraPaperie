import React from 'react'
import type { SectionConfig, BirthdayExperience } from '@/lib/types'

interface Props { section: SectionConfig; experience: BirthdayExperience; config: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }

export default function FinalMessageEditor({ experience, config, onChange }: Props) {
    const update = (k: string, v: unknown) => onChange({ ...config, [k]: v })
    return (
        <div className="p-6 space-y-6">
            <div>
                <h2 className="font-display font-bold text-xl text-gray-900">✨ Final Birthday Message</h2>
                <p className="text-sm text-gray-400 mt-1">The last thing the birthday person sees — make it memorable!</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Closing message</label>
                <textarea value={(config.message as string) ?? `Happy Birthday, ${experience.recipient_name}! 🎉\n\nI hope this little website made your day a little more special. You deserve all the love and joy in the world.\n\nWith all my love ❤️`}
                    onChange={e => update('message', e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none font-serif" />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Background style</label>
                <div className="grid grid-cols-3 gap-2">
                    {[
                        { value: 'gradient', label: 'Gradient', emoji: '🌅' },
                        { value: 'confetti', label: 'Confetti', emoji: '🎉' },
                        { value: 'stars', label: 'Starfield', emoji: '⭐' },
                    ].map(bg => (
                        <button key={bg.value} onClick={() => update('bg_style', bg.value)}
                            className={`flex flex-col items-center py-3 rounded-xl border-2 text-xs font-semibold gap-1 transition-all ${config.bg_style === bg.value ? 'border-rose-400 bg-rose-50 text-rose-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                            <span className="text-xl">{bg.emoji}</span>
                            {bg.label}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Button text (links back to top)</label>
                <input type="text" value={(config.button_text as string) ?? '🔁 Relive it again'}
                    onChange={e => update('button_text', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400" />
            </div>

            <div className="flex items-center justify-between py-3 border-t border-gray-100">
                <div>
                    <p className="text-sm font-medium text-gray-700">Auto-confetti on scroll to bottom</p>
                    <p className="text-xs text-gray-400">Burst of confetti when they reach the final message</p>
                </div>
                <button onClick={() => update('auto_confetti', !(config.auto_confetti ?? true))}
                    className={`relative w-11 h-6 rounded-full transition-colors ${(config.auto_confetti ?? true) ? 'bg-rose-500' : 'bg-gray-200'}`}
                    role="switch" aria-checked={(config.auto_confetti ?? true) as boolean}>
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${(config.auto_confetti ?? true) ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
            </div>
        </div>
    )
}

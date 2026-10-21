import React from 'react'
import type { SectionConfig, BirthdayExperience } from '@/lib/types'

interface Props { section: SectionConfig; experience: BirthdayExperience; config: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }

export default function HiddenSurpriseEditor({ config, onChange }: Props) {
    const update = (k: string, v: unknown) => onChange({ ...config, [k]: v })
    return (
        <div className="p-6 space-y-6">
            <div>
                <h2 className="font-display font-bold text-xl text-gray-900">🎀 Hidden Surprise</h2>
                <p className="text-sm text-gray-400 mt-1">A locked reveal the recipient must discover by scrolling or completing an interaction</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Unlock trigger</label>
                <div className="grid grid-cols-2 gap-2">
                    {[
                        { value: 'scroll-to', label: 'Scroll to end', emoji: '📜' },
                        { value: 'cake-candles', label: 'Blow out candles', emoji: '🎂' },
                        { value: 'letter-read', label: 'Finish reading letter', emoji: '💌' },
                        { value: 'tap-to-reveal', label: 'Tap to reveal', emoji: '✨' },
                    ].map(t => (
                        <button key={t.value} onClick={() => update('trigger', t.value)}
                            className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all ${config.trigger === t.value ? 'border-rose-400 bg-rose-50 text-rose-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                            <span>{t.emoji}</span> {t.label}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Surprise type</label>
                <div className="flex gap-2">
                    {(['message', 'photo', 'video', 'link'] as const).map(type => (
                        <button key={type} onClick={() => update('surprise_type', type)}
                            className={`flex-1 py-2 rounded-xl text-xs font-semibold border capitalize transition-all ${config.surprise_type === type ? 'bg-rose-50 border-rose-300 text-rose-700' : 'border-gray-200 text-gray-500'}`}>
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Surprise content</label>
                <textarea value={(config.content as string) ?? ''}
                    onChange={e => update('content', e.target.value)}
                    placeholder="Enter the secret message, photo URL, or link..."
                    rows={4}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none" />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hint text (shown before unlock)</label>
                <input type="text" value={(config.hint as string) ?? '🔒 There\'s one more surprise hiding here...'}
                    onChange={e => update('hint', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400" />
            </div>
        </div>
    )
}

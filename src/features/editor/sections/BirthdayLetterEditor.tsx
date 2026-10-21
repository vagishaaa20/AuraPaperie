import React from 'react'
import type { SectionConfig, BirthdayExperience } from '@/lib/types'

interface Props { section: SectionConfig; experience: BirthdayExperience; config: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }

export default function BirthdayLetterEditor({ experience, config, onChange }: Props) {
    const update = (k: string, v: unknown) => onChange({ ...config, [k]: v })
    return (
        <div className="p-6 space-y-6">
            <div>
                <h2 className="font-display font-bold text-xl text-gray-900">💌 Birthday Letter</h2>
                <p className="text-sm text-gray-400 mt-1">A heartfelt letter shown on beautiful stationery</p>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salutation</label>
                <input type="text" value={(config.salutation as string) ?? `Dear ${experience.recipient_name},`}
                    onChange={e => update('salutation', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Letter body</label>
                <textarea value={(config.body as string) ?? ''}
                    onChange={e => update('body', e.target.value)}
                    placeholder={`Write your letter to ${experience.recipient_name} here...`}
                    rows={10}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none font-serif leading-relaxed" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Closing & signature</label>
                <input type="text" value={(config.signature as string) ?? (experience.sender_name ? `With love, ${experience.sender_name}` : 'With love ❤️')}
                    onChange={e => update('signature', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stationery style</label>
                <div className="flex gap-2">
                    {(['elegant', 'romantic', 'casual'] as const).map(s => (
                        <button key={s} onClick={() => update('stationery', s)}
                            className={`flex-1 py-2 rounded-xl text-xs font-semibold border capitalize transition-all ${config.stationery === s ? 'bg-rose-50 border-rose-300 text-rose-700' : 'border-gray-200 text-gray-500'}`}>
                            {s}
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex items-center justify-between py-3 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-700">Unfolding animation</p>
                <button onClick={() => update('unfold_animation', !(config.unfold_animation ?? true))}
                    className={`relative w-11 h-6 rounded-full transition-colors ${(config.unfold_animation ?? true) ? 'bg-rose-500' : 'bg-gray-200'}`}
                    role="switch" aria-checked={(config.unfold_animation ?? true) as boolean}>
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${(config.unfold_animation ?? true) ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
            </div>
        </div>
    )
}

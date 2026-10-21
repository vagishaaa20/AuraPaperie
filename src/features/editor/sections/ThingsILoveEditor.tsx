import React from 'react'
import type { SectionConfig, BirthdayExperience } from '@/lib/types'

interface Props { section: SectionConfig; experience: BirthdayExperience; config: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }

export default function ThingsILoveEditor({ experience, config, onChange }: Props) {
    const update = (k: string, v: unknown) => onChange({ ...config, [k]: v })
    const items = (config.items as { text: string; emoji?: string }[]) ?? []
    const addItem = () => onChange({ ...config, items: [...items, { text: '', emoji: '💕' }] })
    const removeItem = (i: number) => onChange({ ...config, items: items.filter((_, idx) => idx !== i) })
    const updateItem = (i: number, field: string, value: string) =>
        onChange({ ...config, items: items.map((item, idx) => idx === i ? { ...item, [field]: value } : item) })

    return (
        <div className="p-6 space-y-6">
            <div>
                <h2 className="font-display font-bold text-xl text-gray-900">💕 Things I Love About You</h2>
                <p className="text-sm text-gray-400 mt-1">Interactive flip cards or reveal notes</p>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section title</label>
                <input type="text" value={(config.title as string) ?? `Things I Love About ${experience.recipient_name}`}
                    onChange={e => update('title', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Card style</label>
                <div className="flex gap-2">
                    {(['flip-card', 'mini-envelope', 'paper-scrap'] as const).map(style => (
                        <button key={style} onClick={() => update('card_style', style)}
                            className={`flex-1 py-2 rounded-xl text-xs font-semibold border capitalize transition-all ${config.card_style === style ? 'bg-rose-50 border-rose-300 text-rose-700' : 'border-gray-200 text-gray-500'}`}>
                            {style.replace('-', ' ')}
                        </button>
                    ))}
                </div>
            </div>
            <div>
                <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-700">Items ({items.length})</label>
                    <button onClick={addItem} className="text-xs text-rose-500 hover:text-rose-700 font-semibold">+ Add</button>
                </div>
                <div className="space-y-2">
                    {items.length === 0 && (
                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center text-sm text-gray-400">
                            Add things you love about {experience.recipient_name}
                        </div>
                    )}
                    {items.map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <input type="text" value={item.emoji ?? '💕'} onChange={e => updateItem(i, 'emoji', e.target.value)}
                                className="w-10 h-10 text-center border border-gray-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-rose-400" maxLength={2} />
                            <input type="text" value={item.text} onChange={e => updateItem(i, 'text', e.target.value)}
                                placeholder="Your smile lights up the room..." className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400" />
                            <button onClick={() => removeItem(i)} className="text-red-400 hover:text-red-600 text-lg">✕</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

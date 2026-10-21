import React from 'react'
import type { SectionConfig, BirthdayExperience } from '@/lib/types'

interface Props {
    section: SectionConfig
    experience: BirthdayExperience
    config: Record<string, unknown>
    onChange: (config: Record<string, unknown>) => void
}

export default function OurStoryEditor({ config, onChange }: Props) {
    const update = (k: string, v: unknown) => onChange({ ...config, [k]: v })
    const entries = (config.entries as { title: string; story: string; date?: string; icon?: string }[]) ?? []

    const addEntry = () => onChange({ ...config, entries: [...entries, { title: '', story: '', date: '', icon: '⭐' }] })
    const removeEntry = (i: number) => onChange({ ...config, entries: entries.filter((_, idx) => idx !== i) })
    const updateEntry = (i: number, field: string, value: string) =>
        onChange({ ...config, entries: entries.map((e, idx) => idx === i ? { ...e, [field]: value } : e) })

    return (
        <div className="p-6 space-y-6">
            <div>
                <h2 className="font-display font-bold text-xl text-gray-900">📖 Our Story</h2>
                <p className="text-sm text-gray-400 mt-1">Create a timeline of your shared memories and milestones</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section title</label>
                <input type="text" value={(config.title as string) ?? 'Our Story'} onChange={e => update('title', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400" />
            </div>

            <div>
                <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-700">Timeline entries</label>
                    <button onClick={addEntry} className="text-xs text-rose-500 hover:text-rose-700 font-semibold">+ Add entry</button>
                </div>
                <div className="space-y-4">
                    {entries.length === 0 && (
                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center text-sm text-gray-400">
                            Add your first milestone, memory, or important date
                        </div>
                    )}
                    {entries.map((entry, i) => (
                        <div key={i} className="border border-gray-200 rounded-xl p-4 space-y-3">
                            <div className="flex items-center gap-2 justify-between">
                                <input type="text" value={entry.icon ?? '⭐'} onChange={e => updateEntry(i, 'icon', e.target.value)}
                                    className="w-10 h-10 text-center border border-gray-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-rose-400" maxLength={2} />
                                <input type="text" value={entry.title} onChange={e => updateEntry(i, 'title', e.target.value)}
                                    placeholder="Milestone title" className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400" />
                                <button onClick={() => removeEntry(i)} className="text-red-400 hover:text-red-600 text-xl">✕</button>
                            </div>
                            <input type="text" value={entry.date ?? ''} onChange={e => updateEntry(i, 'date', e.target.value)}
                                placeholder="Date (e.g. June 2022)" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-400" />
                            <textarea value={entry.story} onChange={e => updateEntry(i, 'story', e.target.value)}
                                placeholder="Tell the story of this moment..." rows={3}
                                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

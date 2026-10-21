import React, { useState } from 'react'
import { Plus, Trash2, Calendar, Clock, MapPin, Sparkles } from 'lucide-react'
import type { SectionConfig, BirthdayExperience, WeddingEvent } from '@/lib/types'
import { generateId } from '@/lib/utils'

interface Props {
    section: SectionConfig
    experience: BirthdayExperience
    config: Record<string, unknown>
    onChange: (config: Record<string, unknown>) => void
}

export default function WeddingEventsEditor({ config, onChange }: Props) {
    const update = (key: string, value: unknown) => onChange({ ...config, [key]: value })
    const events = (config.events as WeddingEvent[]) ?? []

    const [name, setName] = useState('')
    const [date, setDate] = useState('')
    const [time, setTime] = useState('')
    const [venueName, setVenueName] = useState('')
    const [address, setAddress] = useState('')
    const [dressCode, setDressCode] = useState('')

    const addEvent = () => {
        if (!name.trim()) return
        const newEv: WeddingEvent = {
            id: generateId(),
            name: name.trim(),
            date: date.trim(),
            time: time.trim() || undefined,
            venue_name: venueName.trim() || 'Venue TBD',
            address: address.trim() || undefined,
            dress_code: dressCode.trim() || undefined,
        }
        onChange({ ...config, events: [...events, newEv] })
        setName('')
        setDate('')
        setTime('')
        setVenueName('')
        setAddress('')
        setDressCode('')
    }

    const removeEvent = (index: number) => {
        onChange({ ...config, events: events.filter((_, i) => i !== index) })
    }

    return (
        <div className="p-6 space-y-6">
            <div>
                <h2 className="font-display font-bold text-xl text-gray-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-rose-500" />
                    Wedding Events & Schedule
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                    Add all ceremonies and celebrations (e.g. Ceremony, Reception, Sangeet, Haldi, Cocktail).
                </p>
            </div>

            <div className="space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <input
                    type="text"
                    placeholder="Section Title (e.g. Wedding Events)"
                    value={(config.title as string) ?? 'Wedding Events & Celebrations'}
                    onChange={e => update('title', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm"
                />
            </div>

            {/* Add Event Form */}
            <div className="border border-rose-100 bg-rose-50/40 p-4 rounded-2xl space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-rose-700">Add New Event</h3>
                <input
                    type="text"
                    required
                    placeholder="Event Name (e.g. Wedding Ceremony, Sangeet, Reception)"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm"
                />

                <div className="grid grid-cols-2 gap-2">
                    <input
                        type="text"
                        placeholder="Date (e.g. Dec 18, 2026)"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm"
                    />
                    <input
                        type="text"
                        placeholder="Time (e.g. 5:00 PM)"
                        value={time}
                        onChange={e => setTime(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm"
                    />
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <input
                        type="text"
                        placeholder="Venue Name (e.g. Grand Ballroom)"
                        value={venueName}
                        onChange={e => setVenueName(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm"
                    />
                    <input
                        type="text"
                        placeholder="Dress Code (e.g. Formal, Traditional)"
                        value={dressCode}
                        onChange={e => setDressCode(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm"
                    />
                </div>

                <input
                    type="text"
                    placeholder="Full Address (optional)"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm"
                />

                <button
                    type="button"
                    onClick={addEvent}
                    disabled={!name.trim()}
                    className="w-full py-2.5 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                    <Plus className="w-4 h-4" /> Add Event
                </button>
            </div>

            {/* Events List */}
            <div className="space-y-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Configured Events ({events.length})
                </label>
                {events.map((ev, i) => (
                    <div key={ev.id || i} className="p-3 bg-white border border-gray-200 rounded-2xl flex items-center justify-between shadow-xs">
                        <div>
                            <h4 className="font-bold text-sm text-gray-800">{ev.name}</h4>
                            <p className="text-xs text-gray-400">{ev.date} {ev.time ? `• ${ev.time}` : ''} • {ev.venue_name}</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => removeEvent(i)}
                            className="p-1.5 text-gray-400 hover:text-rose-600 cursor-pointer"
                            aria-label="Remove event"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

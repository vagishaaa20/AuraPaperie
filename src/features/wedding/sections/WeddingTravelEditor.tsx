import React from 'react'
import type { SectionConfig, BirthdayExperience } from '@/lib/types'
import { Hotel } from 'lucide-react'

interface Props {
    section: SectionConfig
    experience: BirthdayExperience
    config: Record<string, unknown>
    onChange: (config: Record<string, unknown>) => void
}

export default function WeddingTravelEditor({ config, onChange }: Props) {
    const update = (key: string, val: unknown) => {
        onChange({ ...config, [key]: val })
    }

    return (
        <div className="p-6 space-y-6 max-w-xl mx-auto">
            <div>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <Hotel className="w-5 h-5 text-rose-500" />
                    Accommodations & Travel Information
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                    Hotel room blocks, group discount codes, and airport/shuttle recommendations for out-of-town guests.
                </p>
            </div>

            <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Section Title</label>
                <input
                    type="text"
                    value={(config.title as string) ?? 'Travel & Accommodations'}
                    onChange={e => update('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Recommended Hotel</label>
                    <input
                        type="text"
                        value={(config.hotel_name as string) ?? ''}
                        onChange={e => update('hotel_name', e.target.value)}
                        placeholder="e.g. Silverado Resort & Spa"
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Hotel Address / City</label>
                    <input
                        type="text"
                        value={(config.hotel_address as string) ?? ''}
                        onChange={e => update('hotel_address', e.target.value)}
                        placeholder="e.g. 1600 Atlas Peak Rd, Napa, CA"
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Discount / Group Code</label>
                    <input
                        type="text"
                        value={(config.booking_code as string) ?? ''}
                        onChange={e => update('booking_code', e.target.value)}
                        placeholder="e.g. WEDDING2026"
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-rose-400 focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Direct Booking Link</label>
                    <input
                        type="url"
                        value={(config.booking_url as string) ?? ''}
                        onChange={e => update('booking_url', e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-rose-400 focus:outline-none"
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Nearest Airports & Driving Advice</label>
                <textarea
                    rows={2}
                    value={(config.airport_notes as string) ?? ''}
                    onChange={e => update('airport_notes', e.target.value)}
                    placeholder="e.g. SFO and OAK are approx 1 hour away."
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
                />
            </div>

            <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Shuttle & Transportation Details</label>
                <textarea
                    rows={2}
                    value={(config.shuttle_notes as string) ?? ''}
                    onChange={e => update('shuttle_notes', e.target.value)}
                    placeholder="e.g. Continuous shuttles between the resort and the venue will run every 15 minutes."
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
                />
            </div>
        </div>
    )
}

import React from 'react'
import type { SectionConfig, BirthdayExperience } from '@/lib/types'
import { MapPin } from 'lucide-react'

interface Props {
    section: SectionConfig
    experience: BirthdayExperience
    config: Record<string, unknown>
    onChange: (config: Record<string, unknown>) => void
}

export default function WeddingVenueEditor({ config, onChange }: Props) {
    const update = (key: string, val: unknown) => {
        onChange({ ...config, [key]: val })
    }

    return (
        <div className="p-6 space-y-6 max-w-xl mx-auto">
            <div>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-rose-500" />
                    Venue & Travel Directions
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                    Help your guests navigate effortlessly to your celebration venues.
                </p>
            </div>

            {/* Section Title */}
            <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Section Title</label>
                <input
                    type="text"
                    value={(config.title as string) ?? 'Venue & Directions'}
                    onChange={e => update('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
                />
            </div>

            {/* Venue Name */}
            <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Venue Name</label>
                <input
                    type="text"
                    value={(config.venue_name as string) ?? ''}
                    onChange={e => update('venue_name', e.target.value)}
                    placeholder="e.g. The Grand Heritage Estate"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
                />
            </div>

            {/* Address */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Street Address</label>
                    <input
                        type="text"
                        value={(config.address as string) ?? ''}
                        onChange={e => update('address', e.target.value)}
                        placeholder="e.g. 100 Sunset Boulevard"
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">City, State / Postal</label>
                    <input
                        type="text"
                        value={(config.city as string) ?? ''}
                        onChange={e => update('city', e.target.value)}
                        placeholder="e.g. Napa Valley, CA 94558"
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
                    />
                </div>
            </div>

            {/* Google Maps link */}
            <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Google Maps / Directions Link</label>
                <input
                    type="url"
                    value={(config.map_url as string) ?? ''}
                    onChange={e => update('map_url', e.target.value)}
                    placeholder="https://maps.google.com/?q=..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-rose-400 focus:outline-none"
                />
            </div>

            {/* Parking & Valet Information */}
            <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Parking & Valet Information</label>
                <textarea
                    rows={2}
                    value={(config.parking_info as string) ?? ''}
                    onChange={e => update('parking_info', e.target.value)}
                    placeholder="e.g. Valet parking is complimentary at the grand entrance. Overnight parking permitted."
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
                />
            </div>

            {/* Arrival Instructions */}
            <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Arrival Instructions / Notes</label>
                <textarea
                    rows={2}
                    value={(config.arrival_notes as string) ?? ''}
                    onChange={e => update('arrival_notes', e.target.value)}
                    placeholder="e.g. Please plan to arrive by 10:30 AM to be seated before the baraat / procession."
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
                />
            </div>

            {/* Button text */}
            <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Directions Button Text</label>
                <input
                    type="text"
                    value={(config.button_text as string) ?? 'Open in Google Maps'}
                    onChange={e => update('button_text', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
                />
            </div>
        </div>
    )
}

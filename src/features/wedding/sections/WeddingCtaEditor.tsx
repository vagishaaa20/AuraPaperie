import React from 'react'
import type { SectionConfig, BirthdayExperience } from '@/lib/types'
import { HeartHandshake } from 'lucide-react'

interface Props {
    section: SectionConfig
    experience: BirthdayExperience
    config: Record<string, unknown>
    onChange: (config: Record<string, unknown>) => void
}

export default function WeddingCtaEditor({ config, onChange }: Props) {
    const update = (key: string, val: unknown) => {
        onChange({ ...config, [key]: val })
    }

    return (
        <div className="p-6 space-y-6 max-w-xl mx-auto">
            <div>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <HeartHandshake className="w-5 h-5 text-rose-500" />
                    Closing Invitation & Save-the-Date
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                    The final warm closing note and quick action buttons for your guests.
                </p>
            </div>

            {/* Couple Signature Names */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Partner 1</label>
                    <input
                        type="text"
                        value={(config.partner1_name as string) ?? ''}
                        onChange={e => update('partner1_name', e.target.value)}
                        placeholder="Aarav"
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Partner 2</label>
                    <input
                        type="text"
                        value={(config.partner2_name as string) ?? ''}
                        onChange={e => update('partner2_name', e.target.value)}
                        placeholder="Meera"
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
                    />
                </div>
            </div>

            {/* Heading */}
            <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Closing Heading</label>
                <input
                    type="text"
                    value={(config.heading as string) ?? 'We Can’t Wait to Celebrate With You!'}
                    onChange={e => update('heading', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
                />
            </div>

            {/* Message */}
            <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Closing Blessing / Message</label>
                <textarea
                    rows={4}
                    value={(config.message as string) ?? ''}
                    onChange={e => update('message', e.target.value)}
                    placeholder="Your love, presence, and blessings are the greatest gifts we could ever ask for."
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm leading-relaxed focus:ring-2 focus:ring-rose-400 focus:outline-none"
                />
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2 border-t border-gray-100">
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                    <input
                        type="checkbox"
                        checked={(config.show_rsvp_button as boolean) ?? true}
                        onChange={e => update('show_rsvp_button', e.target.checked)}
                        className="w-4 h-4 rounded text-rose-500 focus:ring-rose-400"
                    />
                    <div>
                        <span className="text-xs font-bold text-gray-800 block">Show Quick RSVP Button</span>
                        <span className="text-[11px] text-gray-500">Scrolls smoothly directly to the RSVP form</span>
                    </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                    <input
                        type="checkbox"
                        checked={(config.show_calendar_button as boolean) ?? true}
                        onChange={e => update('show_calendar_button', e.target.checked)}
                        className="w-4 h-4 rounded text-rose-500 focus:ring-rose-400"
                    />
                    <div>
                        <span className="text-xs font-bold text-gray-800 block">Show “Add to Google Calendar” Button</span>
                        <span className="text-[11px] text-gray-500">Allows guests to add your wedding dates directly to their phone</span>
                    </div>
                </label>
            </div>
        </div>
    )
}

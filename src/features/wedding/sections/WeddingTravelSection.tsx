import React from 'react'
import { motion } from 'framer-motion'
import { Hotel, Plane, Bus } from 'lucide-react'
import type { SectionProps } from '../../birthday/sections/SurpriseIntroSection'

export function WeddingTravelSection({ section, theme }: SectionProps) {
    const config = (section.config || {}) as Record<string, unknown>
    const title = (config.title as string) ?? 'Travel & Accommodations'
    const hotelName = (config.hotel_name as string) ?? 'The Silverado Resort & Spa'
    const hotelAddress = (config.hotel_address as string) ?? '1600 Atlas Peak Rd, Napa, CA'
    const bookingCode = (config.booking_code as string) ?? 'AARAVMEERA26'
    const bookingUrl = (config.booking_url as string) ?? ''
    const airportNotes = (config.airport_notes as string) ?? 'San Francisco International (SFO) or Oakland (OAK) are both approx. 1 hour away by car.'
    const shuttleNotes = (config.shuttle_notes as string) ?? 'Complimentary shuttle service will operate between the Silverado Resort and the venue on both event days.'
    const isCinematic = theme.style === 'cinematic'

    return (
        <section
            className="py-16 sm:py-20 px-4 sm:px-6 relative overflow-hidden"
            style={{
                background: isCinematic ? '#100f1c' : 'transparent',
                fontFamily: theme.typography.bodyFont,
            }}
        >
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <span
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2"
                        style={{ background: theme.previewGradient, color: '#fff' }}
                    >
                        <Hotel className="w-3.5 h-3.5" />
                        Guest Stay
                    </span>
                    <h2
                        className="text-2xl sm:text-3xl font-extrabold"
                        style={{
                            fontFamily: theme.typography.headingFont,
                            color: isCinematic ? '#fff' : theme.palette.text || '#1e1b4b',
                        }}
                    >
                        {title}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Hotel card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="p-6 rounded-3xl border shadow-md space-y-3"
                        style={{
                            background: isCinematic ? 'rgba(255,255,255,0.03)' : '#ffffff',
                            borderColor: isCinematic ? 'rgba(255,255,255,0.08)' : '#e2e8f0',
                        }}
                    >
                        <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                            <Hotel className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-base text-gray-900" style={{ color: isCinematic ? '#fff' : undefined }}>
                            {hotelName}
                        </h3>
                        <p className="text-xs text-gray-500">{hotelAddress}</p>
                        {bookingCode && (
                            <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-xs">
                                <span className="text-gray-500 block text-[10px] font-bold uppercase">Discount Code</span>
                                <span className="font-mono font-bold text-rose-600">{bookingCode}</span>
                            </div>
                        )}
                        {bookingUrl && (
                            <a
                                href={bookingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block text-xs font-bold text-rose-600 hover:underline pt-1"
                            >
                                Book with Group Rate →
                            </a>
                        )}
                    </motion.div>

                    {/* Flights & Shuttles */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="p-6 rounded-3xl border shadow-md space-y-4"
                        style={{
                            background: isCinematic ? 'rgba(255,255,255,0.03)' : '#ffffff',
                            borderColor: isCinematic ? 'rgba(255,255,255,0.08)' : '#e2e8f0',
                        }}
                    >
                        <div>
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-800 mb-1" style={{ color: isCinematic ? '#fff' : undefined }}>
                                <Plane className="w-4 h-4 text-blue-500" />
                                <span>Nearest Airports</span>
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed">{airportNotes}</p>
                        </div>

                        <div className="pt-2 border-t border-gray-100">
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-800 mb-1" style={{ color: isCinematic ? '#fff' : undefined }}>
                                <Bus className="w-4 h-4 text-emerald-500" />
                                <span>Shuttle Transfers</span>
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed">{shuttleNotes}</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

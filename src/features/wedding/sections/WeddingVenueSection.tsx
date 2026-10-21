import React from 'react'
import { motion } from 'framer-motion'
import { MapPin, Navigation, Car, Info } from 'lucide-react'
import type { SectionProps } from '../../birthday/sections/SurpriseIntroSection'

export function WeddingVenueSection({ section, experience, theme }: SectionProps) {
    const config = section.config as Record<string, unknown>
    const venueName = (config.venue_name as string) ?? 'The Grand Heritage Estate'
    const address = (config.address as string) ?? '100 Sunset Boulevard, Napa Valley, CA'
    const directionsUrl = config.directions_url as string | undefined
    const parkingInfo = config.parking_info as string | undefined
    const isCinematic = theme.style === 'cinematic'

    // Google Maps search URL fallback
    const mapLink = directionsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${venueName} ${address}`)}`

    return (
        <section
            className="py-20 px-6 relative overflow-hidden"
            style={{
                background: isCinematic ? '#070510' : theme.palette.background,
                color: theme.palette.text,
            }}
        >
            <div className="max-w-2xl mx-auto text-center">
                <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center text-rose-500 shadow-md"
                    style={{ background: `${theme.palette.primary}20`, color: theme.palette.primary }}
                >
                    <MapPin className="w-6 h-6" />
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl sm:text-4xl font-extrabold mb-3"
                    style={{
                        fontFamily: theme.typography.headingFont,
                        color: isCinematic ? '#ffffff' : theme.palette.primary,
                    }}
                >
                    Venue & Location
                </motion.h2>

                <div
                    className="mt-8 rounded-3xl p-8 shadow-xl border text-center space-y-4"
                    style={{
                        background: isCinematic ? theme.palette.surface : '#ffffff',
                        borderColor: theme.palette.border,
                    }}
                >
                    <h3 className="text-2xl font-bold" style={{ color: theme.palette.primary }}>
                        {venueName}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto leading-relaxed">
                        {address}
                    </p>

                    {parkingInfo && (
                        <div className="flex items-center justify-center gap-2 text-xs text-gray-400 pt-2">
                            <Car className="w-4 h-4 text-rose-400" />
                            <span>{parkingInfo}</span>
                        </div>
                    )}

                    <div className="pt-4">
                        <a
                            href={mapLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 py-3.5 px-6 rounded-2xl text-white font-bold text-xs sm:text-sm tracking-wide shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
                            style={{
                                background: `linear-gradient(135deg, ${theme.palette.primary} 0%, ${theme.palette.highlight} 100%)`,
                            }}
                        >
                            <Navigation className="w-4 h-4" />
                            <span>Get Driving Directions</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}

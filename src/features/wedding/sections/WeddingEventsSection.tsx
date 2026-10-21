import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, Navigation, CalendarPlus, List, Grid } from 'lucide-react'
import type { SectionProps } from '../../birthday/sections/SurpriseIntroSection'
import type { WeddingEvent } from '@/lib/types'
import { generateGoogleCalendarUrl, downloadIcsFile } from '@/lib/calendar-helpers'
import { soundEngine } from '@/lib/sound-system'

export function WeddingEventsSection({ section, experience, theme }: SectionProps) {
    const config = (section.config || {}) as Record<string, unknown>
    const title = (config.title as string) ?? 'Wedding Events & Celebrations'
    const subtitle = (config.subtitle as string) ?? 'Join us in each step of our auspicious journey'
    const events = (config.events as WeddingEvent[]) ?? []
    const isCinematic = theme.style === 'cinematic'

    const [viewMode, setViewMode] = useState<'cards' | 'compact'>('cards')

    return (
        <section
            className="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden"
            style={{
                background: isCinematic
                    ? '#0b0817'
                    : `linear-gradient(180deg, ${theme.palette.background} 0%, ${theme.palette.surface} 100%)`,
                color: theme.palette.text,
            }}
        >
            <div className="max-w-4xl mx-auto text-center mb-10">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl sm:text-4xl font-extrabold mb-3"
                    style={{
                        fontFamily: theme.typography.headingFont,
                        color: isCinematic ? '#ffffff' : theme.palette.primary,
                    }}
                >
                    {title}
                </motion.h2>
                {subtitle && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-xs sm:text-sm max-w-lg mx-auto text-stone-500"
                        style={{ fontFamily: theme.typography.bodyFont }}
                    >
                        {subtitle}
                    </motion.p>
                )}

                {/* View switcher: Cards vs Compact */}
                {events.length > 1 && (
                    <div className="inline-flex items-center gap-1 bg-stone-100 p-1 rounded-xl mt-6">
                        <button
                            type="button"
                            onClick={() => {
                                setViewMode('cards')
                                soundEngine.playClickSound()
                            }}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                viewMode === 'cards' ? 'bg-white shadow-xs text-rose-600' : 'text-stone-500 hover:text-stone-800'
                            }`}
                        >
                            <Grid className="w-3.5 h-3.5" />
                            <span>Detailed Cards</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setViewMode('compact')
                                soundEngine.playClickSound()
                            }}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                viewMode === 'compact' ? 'bg-white shadow-xs text-rose-600' : 'text-stone-500 hover:text-stone-800'
                            }`}
                        >
                            <List className="w-3.5 h-3.5" />
                            <span>Compact Itinerary</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Detailed Cards View */}
            {viewMode === 'cards' ? (
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                    {events.map((ev, i) => {
                        const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(
                            `${ev.venue_name || ''} ${ev.address || ''}`.trim()
                        )}`

                        return (
                            <motion.div
                                key={ev.id || i}
                                initial={{ opacity: 0, y: 25 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="rounded-3xl p-6 sm:p-8 shadow-xl border flex flex-col justify-between transition-all hover:shadow-2xl"
                                style={{
                                    background: isCinematic ? 'rgba(25, 20, 38, 0.95)' : '#ffffff',
                                    borderColor: `${theme.palette.border}`,
                                }}
                            >
                                <div>
                                    {ev.photo_url && (
                                        <div
                                            className="w-full h-44 rounded-2xl overflow-hidden mb-4 border"
                                            style={{ borderColor: theme.palette.border }}
                                        >
                                            <img src={ev.photo_url} alt={ev.name} className="w-full h-full object-cover" />
                                        </div>
                                    )}

                                    <div className="flex items-start justify-between gap-3 mb-2">
                                        <h3
                                            className="text-xl sm:text-2xl font-bold"
                                            style={{
                                                color: isCinematic ? '#ffffff' : theme.palette.primary,
                                                fontFamily: theme.typography.headingFont,
                                            }}
                                        >
                                            {ev.name}
                                        </h3>
                                        {ev.dress_code && (
                                            <span
                                                className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full whitespace-nowrap"
                                                style={{
                                                    background: `${theme.palette.primary}18`,
                                                    color: theme.palette.primary,
                                                }}
                                            >
                                                {ev.dress_code}
                                            </span>
                                        )}
                                    </div>

                                    {ev.description && (
                                        <p className="text-xs sm:text-sm text-stone-500 mb-6 leading-relaxed">
                                            {ev.description}
                                        </p>
                                    )}
                                </div>

                                <div
                                    className="space-y-3 pt-4 border-t text-xs font-medium"
                                    style={{ borderColor: `${theme.palette.border}80` }}
                                >
                                    {ev.date && (
                                        <div className="flex items-center gap-2 text-stone-700 font-bold">
                                            <Calendar className="w-4 h-4 text-rose-500" />
                                            <span>{ev.date}</span>
                                        </div>
                                    )}
                                    {ev.time && (
                                        <div className="flex items-center gap-2 text-stone-600">
                                            <Clock className="w-4 h-4 text-rose-500" />
                                            <span>{ev.time}</span>
                                        </div>
                                    )}
                                    {ev.venue_name && (
                                        <div className="flex items-start gap-2 text-stone-600">
                                            <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <span className="font-bold text-stone-800 block">{ev.venue_name}</span>
                                                {ev.address && <span className="text-[11px] opacity-80">{ev.address}</span>}
                                            </div>
                                        </div>
                                    )}

                                    {/* Event Actions: Map Directions + Add to Calendar */}
                                    <div className="flex items-center gap-2 pt-3">
                                        {(ev.venue_name || ev.address) && (
                                            <a
                                                href={mapsUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 py-2 px-3 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
                                            >
                                                <Navigation className="w-3.5 h-3.5 text-rose-500" />
                                                <span>Directions</span>
                                            </a>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const url = generateGoogleCalendarUrl({
                                                    title: `${experience.recipient_name} — ${ev.name}`,
                                                    startDateStr: ev.date,
                                                    startTimeStr: ev.time,
                                                    location: `${ev.venue_name || ''}, ${ev.address || ''}`,
                                                    description: ev.description,
                                                })
                                                window.open(url, '_blank')
                                            }}
                                            className="flex-1 py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                                            title="Add to Google Calendar"
                                        >
                                            <CalendarPlus className="w-3.5 h-3.5 text-rose-500" />
                                            <span>Add to Cal</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                downloadIcsFile({
                                                    title: `${experience.recipient_name} — ${ev.name}`,
                                                    startDateStr: ev.date,
                                                    startTimeStr: ev.time,
                                                    location: `${ev.venue_name || ''}, ${ev.address || ''}`,
                                                    description: ev.description,
                                                })
                                            }}
                                            className="py-2 px-2.5 rounded-xl border border-stone-200 text-stone-500 hover:bg-stone-50 text-[10px] font-bold transition-colors cursor-pointer"
                                            title="Download .ics file (Apple Calendar / Outlook)"
                                        >
                                            .ICS
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            ) : (
                /* Compact Itinerary Timeline View */
                <div className="max-w-2xl mx-auto space-y-4">
                    {events.map((ev, i) => (
                        <motion.div
                            key={ev.id || i}
                            initial={{ opacity: 0, x: -15 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="p-5 rounded-2xl border shadow-sm flex items-center justify-between gap-4"
                            style={{
                                background: isCinematic ? 'rgba(25, 20, 38, 0.95)' : '#ffffff',
                                borderColor: theme.palette.border,
                            }}
                        >
                            <div className="flex items-center gap-4 min-w-0">
                                <div
                                    className="w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center text-lg font-bold"
                                    style={{
                                        background: `${theme.palette.primary}15`,
                                        color: theme.palette.primary,
                                    }}
                                >
                                    {i + 1}
                                </div>
                                <div className="min-w-0 text-left">
                                    <h4 className="font-bold text-sm text-stone-900 truncate">{ev.name}</h4>
                                    <p className="text-xs text-rose-600 font-medium">
                                        {ev.date} {ev.time && `• ${ev.time}`}
                                    </p>
                                    {ev.venue_name && (
                                        <p className="text-[11px] text-stone-400 truncate">{ev.venue_name}</p>
                                    )}
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    const url = generateGoogleCalendarUrl({
                                        title: `${experience.recipient_name} — ${ev.name}`,
                                        startDateStr: ev.date,
                                        startTimeStr: ev.time,
                                        location: `${ev.venue_name || ''}, ${ev.address || ''}`,
                                        description: ev.description,
                                    })
                                    window.open(url, '_blank')
                                }}
                                className="flex-shrink-0 p-2 rounded-xl bg-stone-100 hover:bg-rose-50 text-stone-600 hover:text-rose-600 transition-colors"
                                title="Add to Google Calendar"
                            >
                                <CalendarPlus className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))}
                </div>
            )}
        </section>
    )
}

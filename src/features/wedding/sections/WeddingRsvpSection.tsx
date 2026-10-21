import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Send, Users, Heart } from 'lucide-react'
import { submitWeddingRsvp } from '@/lib/project-helpers'
import toast from 'react-hot-toast'
import confetti from 'canvas-confetti'
import { soundEngine } from '@/lib/sound-system'
import type { SectionProps } from '../../birthday/sections/SurpriseIntroSection'

export function WeddingRsvpSection({ section, experience, theme }: SectionProps) {
    const config = section.config as Record<string, unknown>
    const title = (config.title as string) ?? 'Will You Join Us?'
    const subtitle = (config.subtitle as string) ?? 'Please let us know if you can make it to our special celebration'
    const deadline = config.deadline as string | undefined
    const isCinematic = theme.style === 'cinematic'

    const [guestName, setGuestName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [attendance, setAttendance] = useState<'attending' | 'declined'>('attending')
    const [guestCount, setGuestCount] = useState(1)
    const [dietaryNotes, setDietaryNotes] = useState('')
    const [message, setMessage] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!guestName.trim()) {
            toast.error('Please enter your name')
            return
        }

        setSubmitting(true)
        const res = await submitWeddingRsvp({
            experience_id: experience.id,
            guest_name: guestName.trim(),
            email: email.trim() || undefined,
            phone: phone.trim() || undefined,
            attendance,
            guest_count: attendance === 'attending' ? guestCount : 0,
            dietary_notes: dietaryNotes.trim() || undefined,
            message: message.trim() || undefined,
        })
        const error = res.success ? null : { message: res.error }
        setSubmitting(false)

        if (error) {
            toast.error('Could not submit RSVP. Please try again.')
            return
        }

        soundEngine.playRsvpSuccessSound()
        try {
            confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } })
        } catch {}
        toast.success(attendance === 'attending' ? 'Thank you! We cannot wait to celebrate with you! 🎉' : 'Thank you for letting us know! ❤️')
        setSubmitted(true)
    }

    return (
        <section
            className="py-20 px-6 relative overflow-hidden"
            style={{
                background: isCinematic
                    ? '#0a0815'
                    : `linear-gradient(180deg, ${theme.palette.surface} 0%, ${theme.palette.background} 100%)`,
                color: theme.palette.text,
            }}
        >
            <div className="max-w-xl mx-auto text-center mb-10">
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
                    {title}
                </motion.h2>
                {subtitle && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-sm sm:text-base text-gray-500 max-w-md mx-auto"
                        style={{ fontFamily: theme.typography.bodyFont }}
                    >
                        {subtitle}
                    </motion.p>
                )}
                {deadline && (
                    <p className="text-xs uppercase tracking-widest font-bold mt-2" style={{ color: theme.palette.primary }}>
                        Kindly RSVP by {deadline}
                    </p>
                )}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-xl mx-auto rounded-3xl p-8 sm:p-10 shadow-2xl border"
                style={{
                    background: isCinematic ? theme.palette.surface : '#ffffff',
                    borderColor: theme.palette.border,
                }}
            >
                {submitted ? (
                    <div className="text-center py-8 space-y-4">
                        <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-3xl shadow-lg"
                            style={{ background: `${theme.palette.primary}20`, color: theme.palette.primary }}>
                            💌
                        </div>
                        <h3 className="text-2xl font-bold" style={{ color: theme.palette.primary }}>
                            RSVP Received!
                        </h3>
                        <p className="text-sm text-gray-500 max-w-xs mx-auto">
                            Thank you, {guestName}. Your response has been saved for the couple.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Attendance Toggle */}
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setAttendance('attending')}
                                className={`py-3 px-4 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                                    attendance === 'attending'
                                        ? 'bg-rose-50 border-rose-500 text-rose-700 shadow-xs'
                                        : 'bg-white border-gray-200 text-gray-600'
                                }`}
                            >
                                ✨ Joyfully Accept
                            </button>
                            <button
                                type="button"
                                onClick={() => setAttendance('declined')}
                                className={`py-3 px-4 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                                    attendance === 'declined'
                                        ? 'bg-gray-100 border-gray-400 text-gray-800 shadow-xs'
                                        : 'bg-white border-gray-200 text-gray-600'
                                }`}
                            >
                                🕊️ Regretfully Decline
                            </button>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                                Full Name <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="Your full name"
                                value={guestName}
                                onChange={e => setGuestName(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    placeholder="+1 234 567 890"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                                />
                            </div>
                        </div>

                        {attendance === 'attending' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                                        Total Attending Guests
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={guestCount}
                                        onChange={e => setGuestCount(Number(e.target.value))}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                                        Dietary Restrictions
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Vegetarian, Vegan, Nut allergy..."
                                        value={dietaryNotes}
                                        onChange={e => setDietaryNotes(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                                Warm Wishes to the Couple
                            </label>
                            <textarea
                                rows={3}
                                placeholder="Write a short wish or message..."
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-3.5 px-6 rounded-2xl text-white font-bold text-sm tracking-wide shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                            style={{
                                background: `linear-gradient(135deg, ${theme.palette.primary} 0%, ${theme.palette.highlight} 100%)`,
                            }}
                        >
                            <Send className="w-4 h-4" />
                            <span>{submitting ? 'Submitting RSVP...' : 'Confirm RSVP'}</span>
                        </button>
                    </form>
                )}
            </motion.div>
        </section>
    )
}

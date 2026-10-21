import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Calendar, MapPin, X, Check, Share2, Edit3, Sparkles } from 'lucide-react'
import { themes } from '@/lib/theme-registry'
import { useAuth } from '@/features/auth/AuthContext'
import { supabase } from '@/lib/supabase'
import { generateQuickWeddingExperience } from '@/lib/wedding-quick-generator'
import { resilientInsertExperience, resilientUpdateExperience } from '@/lib/project-helpers'
import type { ThemeId, BirthdayExperience } from '@/lib/types'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

interface Props {
    onClose: () => void
    onCreated: () => void
}

export default function WeddingQuickCreateModal({ onClose, onCreated }: Props) {
    const { user } = useAuth()
    const navigate = useNavigate()

    const [partner1, setPartner1] = useState('')
    const [partner2, setPartner2] = useState('')
    const [weddingDate, setWeddingDate] = useState('December 18, 2026')
    const [venueName, setVenueName] = useState('')
    const [city, setCity] = useState('')
    const [selectedTheme, setSelectedTheme] = useState<ThemeId>('minimalist-elegance')
    const [tone, setTone] = useState<'traditional' | 'romantic' | 'modern' | 'cultural' | 'elegant'>('romantic')

    const [generating, setGenerating] = useState(false)
    const [createdProject, setCreatedProject] = useState<BirthdayExperience | null>(null)

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) {
            toast.error('Please sign in first')
            return
        }

        setGenerating(true)

        const payload = generateQuickWeddingExperience({
            partner1Name: partner1 || 'Aarav',
            partner2Name: partner2 || 'Meera',
            weddingDate,
            venueName: venueName || 'The Grand Heritage Estate',
            city: city || 'Napa Valley, CA',
            themeId: selectedTheme,
            tone,
        })

        const { data, error } = await resilientInsertExperience({
            owner_id: user.id,
            ...payload,
            status: 'draft',
            published_at: null,
        })

        setGenerating(false)

        if (error || !data) {
            toast.error('Failed to create invitation. Please try again.')
            return
        }

        toast.success(`Wedding invitation for ${payload.recipient_name} created! 💍`)
        onCreated()
        setCreatedProject(data)
    }

    const handlePublishDirect = async () => {
        if (!createdProject) return
        const publishedAt = new Date().toISOString()
        const { error } = await resilientUpdateExperience(createdProject.id, {
                status: 'published',
                published_at: publishedAt,
            })

        if (error) {
            toast.error('Could not publish link')
            return
        }

        toast.success('Your wedding invitation is live! 🥂')
        window.open(`/wedding/${createdProject.slug}`, '_blank')
        onClose()
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
            onClick={e => { if (e.target === e.currentTarget && !generating) onClose() }}
        >
            <motion.div
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 relative my-8 border border-rose-100"
            >
                {!generating && (
                    <button
                        onClick={onClose}
                        className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}

                {createdProject ? (
                    <div className="text-center py-6 space-y-6">
                        <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-4xl shadow-xl shadow-rose-200"
                            style={{ background: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 100%)' }}>
                            💍
                        </div>

                        <div>
                            <span className="text-xs font-bold uppercase tracking-widest text-rose-500">
                                Wedding Invitation Created!
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
                                {createdProject.title}
                            </h2>
                            <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
                                Ceremony schedules, RSVP form, directions, live countdown, and photo gallery are ready!
                            </p>
                        </div>

                        <div className="p-4 bg-rose-50/70 rounded-2xl border border-rose-100 text-left space-y-2 max-w-md mx-auto">
                            <div className="flex items-center justify-between text-xs text-gray-600 font-medium">
                                <span>Couple:</span>
                                <span className="font-bold text-gray-900">{createdProject.recipient_name}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-600 font-medium">
                                <span>Theme:</span>
                                <span className="font-bold text-gray-800 capitalize">{createdProject.theme_id.replace('-', ' ')}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-600 font-medium">
                                <span>Guest Link:</span>
                                <span className="font-mono text-gray-500 truncate max-w-[200px]">/wedding/{createdProject.slug}</span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-2 max-w-md mx-auto">
                            <button
                                onClick={handlePublishDirect}
                                className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold text-sm shadow-lg shadow-rose-200 hover:shadow-rose-300 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02]"
                            >
                                <Share2 className="w-4 h-4" />
                                <span>Publish & View Link</span>
                            </button>
                            <button
                                onClick={() => {
                                    onClose()
                                    navigate(`/editor/${createdProject.id}`)
                                }}
                                className="flex-1 py-3.5 px-6 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <Edit3 className="w-4 h-4" />
                                <span>Customize in Studio</span>
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleCreate} className="space-y-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-100 text-rose-700 mb-2">
                                <Heart className="w-3.5 h-3.5 fill-current" />
                                <span>Digital Wedding Invitation</span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                                Create Wedding Invitation in 1-Click ✨
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Enter couple details. We will automatically generate an invitation card, RSVP form, live countdown, and event cards!
                            </p>
                        </div>

                        {/* Partner 1 & Partner 2 */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                                    Partner 1's Name <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Aarav, Michael..."
                                    value={partner1}
                                    onChange={e => setPartner1(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                                    Partner 2's Name <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Meera, Emma..."
                                    value={partner2}
                                    onChange={e => setPartner2(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                                />
                            </div>
                        </div>

                        {/* Wedding Date & Venue */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                                    Wedding Date <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. December 18, 2026"
                                    value={weddingDate}
                                    onChange={e => setWeddingDate(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                                    City or Venue
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Napa Valley, CA or Udaipur"
                                    value={city}
                                    onChange={e => setCity(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                                />
                            </div>
                        </div>

                        {/* Theme Selection */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                                Invitation Aesthetic Theme
                            </label>
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                                {themes.map(th => {
                                    const isSel = selectedTheme === th.id
                                    return (
                                        <button
                                            type="button"
                                            key={th.id}
                                            onClick={() => setSelectedTheme(th.id)}
                                            className={`flex-shrink-0 w-28 p-2 rounded-2xl border text-center transition-all cursor-pointer ${
                                                isSel ? 'border-rose-500 ring-2 ring-rose-300 shadow-md' : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <div
                                                className="w-full h-12 rounded-xl mb-1.5 shadow-inner"
                                                style={{ background: th.previewGradient }}
                                            />
                                            <p className="text-[11px] font-bold text-gray-800 truncate">{th.name}</p>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={generating}
                            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white font-extrabold text-base shadow-xl shadow-rose-200 hover:shadow-rose-300 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] cursor-pointer disabled:opacity-50"
                        >
                            {generating ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Generating Invitation...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    <span>Create Wedding Invitation ✨</span>
                                </>
                            )}
                        </button>
                    </form>
                )}
            </motion.div>
        </motion.div>
    )
}

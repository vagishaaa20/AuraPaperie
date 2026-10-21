import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Heart, Wand2, X, Check, ArrowRight, Eye, Share2, Edit3, Film, Camera } from 'lucide-react'
import { themes } from '@/lib/theme-registry'
import { useAuth } from '@/features/auth/AuthContext'
import { supabase } from '@/lib/supabase'
import {
    generateQuickBirthdayExperience,
    type RelationshipType,
    type BirthdayTone,
    type GiftFormat,
} from '@/lib/quick-create-generator'
import type { ThemeId, BirthdayExperience } from '@/lib/types'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

interface Props {
    onClose: () => void
    onCreated: () => void
}

const RELATIONSHIPS: { id: RelationshipType; label: string; emoji: string }[] = [
    { id: 'best-friend', label: 'Best Friend', emoji: '👯' },
    { id: 'partner', label: 'Partner / Soulmate', emoji: '💑' },
    { id: 'friend', label: 'Friend', emoji: '✨' },
    { id: 'sibling', label: 'Sibling', emoji: '👫' },
    { id: 'parent', label: 'Parent / Elder', emoji: '🏡' },
    { id: 'family', label: 'Family Member', emoji: '💛' },
]

const TONES: { id: BirthdayTone; label: string; desc: string; emoji: string }[] = [
    { id: 'heartfelt', label: 'Heartfelt', desc: 'Warm, sincere & loving', emoji: '💖' },
    { id: 'cute', label: 'Cute & Sweet', desc: 'Soft sparkles & playful charm', emoji: '🌸' },
    { id: 'funny', label: 'Funny & Playful', desc: 'Inside jokes & hearty laughter', emoji: '😂' },
    { id: 'romantic', label: 'Romantic', desc: 'Affectionate & deeply devoted', emoji: '🌹' },
    { id: 'elegant', label: 'Elegant & Classic', desc: 'Polished, timeless & refined', emoji: '💎' },
]

const FORMATS: { id: GiftFormat; label: string; desc: string; icon: any }[] = [
    { id: 'complete', label: 'Complete Experience', desc: 'Scrapbook + Reel + Timeline + Cake + Letter', icon: Sparkles },
    { id: 'scrapbook', label: 'Scrapbook Journal', desc: 'Polaroids, flip notes & handwritten letter', icon: Camera },
    { id: 'cinematic', label: 'Cinematic Reel', desc: 'Slideshow movie with pan/zoom & highlights', icon: Film },
]

export default function QuickCreateModal({ onClose, onCreated }: Props) {
    const { user } = useAuth()
    const navigate = useNavigate()

    const [recipientName, setRecipientName] = useState('')
    const [senderName, setSenderName] = useState('')
    const [relationship, setRelationship] = useState<RelationshipType>('best-friend')
    const [tone, setTone] = useState<BirthdayTone>('heartfelt')
    const [selectedTheme, setSelectedTheme] = useState<ThemeId>('pink-scrapbook')
    const [format, setFormat] = useState<GiftFormat>('complete')

    const [generating, setGenerating] = useState(false)
    const [generationStage, setGenerationStage] = useState('')
    const [createdProject, setCreatedProject] = useState<BirthdayExperience | null>(null)

    const handleQuickCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) {
            toast.error('Please sign in first')
            return
        }

        setGenerating(true)
        setGenerationStage('Generating personalized birthday wishes & letter...')

        await new Promise(r => setTimeout(r, 400))
        setGenerationStage('Curating celebratory photo collection & memory reel...')

        const payload = generateQuickBirthdayExperience({
            recipientName,
            senderName,
            relationship,
            tone,
            themeId: selectedTheme,
            format,
        })

        await new Promise(r => setTimeout(r, 300))
        setGenerationStage('Applying theme styling & setting up cake candles...')

        const { data, error } = await supabase
            .from('birthday_experiences')
            .insert({
                owner_id: user.id,
                ...payload,
                status: 'draft',
                published_at: null,
            })
            .select()
            .single()

        setGenerating(false)

        if (error || !data) {
            toast.error('Failed to create gift. Please try again.')
            return
        }

        toast.success(`Birthday gift for ${payload.recipient_name} is ready! 🎉`)
        onCreated()
        setCreatedProject(data)
    }

    const handlePublishDirect = async () => {
        if (!createdProject) return
        const publishedAt = new Date().toISOString()
        const { error } = await supabase
            .from('birthday_experiences')
            .update({
                status: 'published',
                published_at: publishedAt,
            })
            .eq('id', createdProject.id)

        if (error) {
            toast.error('Could not publish link')
            return
        }

        toast.success('Your birthday gift is live! 🚀')
        window.open(`/birthday/${createdProject.slug}`, '_blank')
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
                className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 relative my-8 overflow-hidden border border-rose-100"
            >
                {/* Close Button */}
                {!generating && (
                    <button
                        onClick={onClose}
                        className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}

                {/* SUCCESS STAGE (After generation) */}
                {createdProject ? (
                    <div className="text-center py-6 space-y-6">
                        <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-4xl shadow-xl shadow-rose-200"
                            style={{ background: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 100%)' }}>
                            🎁
                        </div>

                        <div>
                            <span className="text-xs font-bold uppercase tracking-widest text-rose-500">
                                Gift Created Successfully!
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
                                {createdProject.title}
                            </h2>
                            <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
                                All 10 celebration sections, memory reel, cake candles, and personal letter have been assembled with love!
                            </p>
                        </div>

                        <div className="p-4 bg-rose-50/70 rounded-2xl border border-rose-100 text-left space-y-2 max-w-md mx-auto">
                            <div className="flex items-center justify-between text-xs text-gray-600 font-medium">
                                <span>Theme:</span>
                                <span className="font-bold text-gray-800 capitalize">{createdProject.theme_id.replace('-', ' ')}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-600 font-medium">
                                <span>Recipient:</span>
                                <span className="font-bold text-rose-600">{createdProject.recipient_name}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-600 font-medium">
                                <span>Unique Link:</span>
                                <span className="font-mono text-gray-500 truncate max-w-[200px]">/birthday/{createdProject.slug}</span>
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
                                <span>Personalize in Editor</span>
                            </button>
                        </div>
                    </div>
                ) : (
                    /* CREATION FORM */
                    <form onSubmit={handleQuickCreate} className="space-y-6">
                        {/* Header */}
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-rose-100 to-pink-100 text-rose-700 mb-2">
                                <Wand2 className="w-3.5 h-3.5" />
                                <span>One-Click Magic Generator</span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                                Create a Birthday Gift in Under a Minute ✨
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Enter your loved one's name. We'll automatically curate themed visuals, a heartfelt letter, cake candles, and a memory reel!
                            </p>
                        </div>

                        {/* Recipient & Sender Inputs */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                                    Recipient's Name <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Sarah, Alex, Mom..."
                                    value={recipientName}
                                    onChange={e => setRecipientName(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                                    Your Name / Sign-off <span className="text-gray-400 font-normal">(Optional)</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Liam, Your Bestie..."
                                    value={senderName}
                                    onChange={e => setSenderName(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                                />
                            </div>
                        </div>

                        {/* Relationship Selection */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                                Relationship <span className="text-gray-400 font-normal">(Tailors the wishes)</span>
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {RELATIONSHIPS.map(rel => (
                                    <button
                                        type="button"
                                        key={rel.id}
                                        onClick={() => setRelationship(rel.id)}
                                        className={`px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all text-left cursor-pointer ${
                                            relationship === rel.id
                                                ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-xs'
                                                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        <span className="text-base">{rel.emoji}</span>
                                        <span className="truncate">{rel.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tone Selection */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                                Greeting Tone
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {TONES.map(t => (
                                    <button
                                        type="button"
                                        key={t.id}
                                        onClick={() => setTone(t.id)}
                                        className={`p-3 rounded-2xl text-left border transition-all flex items-start gap-2.5 cursor-pointer ${
                                            tone === t.id
                                                ? 'bg-rose-50/80 border-rose-400 text-rose-900 shadow-xs'
                                                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        <span className="text-xl mt-0.5">{t.emoji}</span>
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold">{t.label}</p>
                                            <p className="text-[11px] text-gray-400 truncate">{t.desc}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Theme Selection */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                                    Select Theme Style ({themes.length} Available)
                                </label>
                                <span className="text-[11px] text-gray-400">Can be changed anytime</span>
                            </div>
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
                                            <span className="text-[9px] uppercase font-semibold text-gray-400">
                                                {th.style}
                                            </span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={generating}
                                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white font-extrabold text-base shadow-xl shadow-rose-200 hover:shadow-rose-300 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-50"
                            >
                                {generating ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>{generationStage}</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        <span>Create My Birthday Gift in 1-Click ✨</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </motion.div>
        </motion.div>
    )
}

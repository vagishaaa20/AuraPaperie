import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { X, Sparkles, ChevronRight, Heart, Palette, Wand2, Calendar, MapPin } from 'lucide-react'
import { useAuth } from '@/features/auth/AuthContext'
import { themes } from '@/lib/theme-registry'
import { generateSlug, generateId } from '@/lib/utils'
import type { ThemeId, SectionConfig, IntroSettings, ThemeSettings, ProjectType } from '@/lib/types'
import { resilientInsertExperience, getDefaultWeddingSections } from '@/lib/project-helpers'
import { generateQuickWeddingExperience } from '@/lib/wedding-quick-generator'

const DEFAULT_BIRTHDAY_SECTIONS: SectionConfig[] = [
    { id: generateId(), type: 'surprise-intro', visible: true, order: 0, config: {} },
    { id: generateId(), type: 'birthday-hero', visible: true, order: 1, config: {} },
    { id: generateId(), type: 'memory-scrapbook', visible: true, order: 2, config: {} },
    { id: generateId(), type: 'our-story', visible: false, order: 3, config: {} },
    { id: generateId(), type: 'things-i-love', visible: true, order: 4, config: {} },
    { id: generateId(), type: 'birthday-letter', visible: true, order: 5, config: {} },
    { id: generateId(), type: 'birthday-cake', visible: true, order: 6, config: {} },
    { id: generateId(), type: 'hidden-surprise', visible: false, order: 7, config: {} },
    { id: generateId(), type: 'music-player', visible: false, order: 8, config: {} },
    { id: generateId(), type: 'cinematic-reel', visible: true, order: 9, config: {} },
    { id: generateId(), type: 'final-message', visible: true, order: 10, config: {} },
]

interface Props {
    onClose: () => void
    onCreated: () => void
}

export default function NewProjectModal({ onClose, onCreated }: Props) {
    const { user } = useAuth()
    const navigate = useNavigate()

    // Step 0: Choose celebration type (Birthday vs Wedding)
    // If Birthday -> Step 1 (Info) -> Step 2 (Theme)
    // If Wedding -> Option A (Quick Create) or Option B (Customize Everything)
    const [projectType, setProjectType] = useState<ProjectType | null>(null)
    const [weddingMode, setWeddingMode] = useState<'quick' | 'custom' | null>(null)

    // Birthday form state
    const [birthdayStep, setBirthdayStep] = useState<1 | 2>(1)
    const [title, setTitle] = useState('')
    const [recipientName, setRecipientName] = useState('')
    const [senderName, setSenderName] = useState('')

    // Wedding form state
    const [partner1, setPartner1] = useState('')
    const [partner2, setPartner2] = useState('')
    const [weddingDate, setWeddingDate] = useState('December 18, 2026')
    const [venueCity, setVenueCity] = useState('Napa Valley, CA')
    const [venueName, setVenueName] = useState('The Grand Heritage Estate')
    const [weddingStarterType, setWeddingStarterType] = useState<'template' | 'blank'>('template')

    // Common theme state
    const [selectedTheme, setSelectedTheme] = useState<ThemeId>('romantic-letterbook')
    const [loading, setLoading] = useState(false)

    // Handle creating Birthday Experience
    const handleCreateBirthday = async () => {
        if (!user || !title.trim() || !recipientName.trim()) return
        setLoading(true)

        const introDefaults: IntroSettings = {
            style: 'gift-box',
            recipient_name: recipientName.trim(),
            teaser_text: 'Something special is waiting for you...',
            greeting: `Happy Birthday, ${recipientName.trim()}! 🎉`,
            animation_speed: 'normal',
            skip_enabled: true,
        }

        const themeDefaults: ThemeSettings = {
            theme_id: selectedTheme,
            animation_intensity: 'normal',
            photo_layout: 'polaroid',
        }

        const { data, error } = await resilientInsertExperience({
            owner_id: user.id,
            project_type: 'birthday',
            title: title.trim(),
            recipient_name: recipientName.trim(),
            sender_name: senderName.trim() || null,
            slug: null,
            theme_id: selectedTheme,
            theme_settings: themeDefaults,
            intro_settings: introDefaults,
            sections: DEFAULT_BIRTHDAY_SECTIONS,
            status: 'draft',
            published_at: null,
        })

        setLoading(false)

        if (error || !data) {
            toast.error('Failed to create project.')
            return
        }

        toast.success('Birthday project created! 🎉')
        onCreated()
        onClose()
        navigate(`/editor/${data.id}`)
    }

    // Handle creating Wedding Experience (Option A: Quick Create)
    const handleCreateWeddingQuick = async () => {
        if (!user) return
        setLoading(true)

        const payload = generateQuickWeddingExperience({
            partner1Name: partner1 || 'Aarav',
            partner2Name: partner2 || 'Meera',
            weddingDate,
            venueName,
            city: venueCity,
            themeId: selectedTheme,
            tone: 'romantic',
        })

        const { data, error } = await resilientInsertExperience({
            owner_id: user.id,
            ...payload,
            status: 'draft',
            published_at: null,
        })

        setLoading(false)

        if (error || !data) {
            toast.error('Failed to create wedding invitation.')
            return
        }

        toast.success('Wedding invitation generated! Opening Studio... 💍')
        onCreated()
        onClose()
        navigate(`/editor/${data.id}`)
    }

    // Handle creating Wedding Experience (Option B: Customize Everything)
    const handleCreateWeddingCustom = async () => {
        if (!user) return
        setLoading(true)

        const p1 = partner1.trim() || 'Partner 1'
        const p2 = partner2.trim() || 'Partner 2'
        const weddingTitle = `${p1} & ${p2}'s Wedding Celebration`
        const slug = `${generateSlug(`${p1}-and-${p2}`)}-wedding-${Math.random().toString(36).slice(2, 6)}`

        const sections = weddingStarterType === 'template'
            ? getDefaultWeddingSections(p1, p2)
            : [
                  {
                      id: generateId(),
                      type: 'wedding-cover' as const,
                      visible: true,
                      order: 0,
                      config: {
                          partner1_name: p1,
                          partner2_name: p2,
                          title: 'Wedding Celebration',
                          wedding_date: weddingDate,
                          venue_city: venueCity,
                      },
                  },
              ]

        const { data, error } = await resilientInsertExperience({
            owner_id: user.id,
            project_type: 'wedding',
            title: weddingTitle,
            recipient_name: `${p1} & ${p2}`,
            sender_name: null,
            slug,
            theme_id: selectedTheme,
            theme_settings: {
                theme_id: selectedTheme,
                animation_intensity: 'normal',
                photo_layout: 'polaroid',
            },
            intro_settings: {
                style: 'simple-intro',
                recipient_name: `${p1} & ${p2}`,
                teaser_text: 'You are cordially invited to celebrate our wedding...',
                greeting: `${p1} & ${p2}`,
                skip_enabled: true,
            },
            sections,
            status: 'draft',
            published_at: null,
        })

        setLoading(false)

        if (error || !data) {
            toast.error('Failed to create wedding canvas.')
            return
        }

        toast.success('Custom wedding studio ready! 🎨')
        onCreated()
        onClose()
        navigate(`/editor/${data.id}`)
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
            onClick={e => { if (e.target === e.currentTarget) onClose() }}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden my-8"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white">
                            {projectType === 'wedding' ? <Heart className="w-4 h-4 fill-current" /> : <Sparkles className="w-4 h-4" />}
                        </div>
                        <div>
                            <h2 className="font-display font-bold text-xl text-gray-900">
                                {!projectType
                                    ? 'Create a Celebration'
                                    : projectType === 'wedding'
                                    ? 'Wedding Invitation Studio'
                                    : 'New Birthday Project'}
                            </h2>
                            <p className="text-xs text-gray-400">
                                {!projectType
                                    ? 'Select celebration type to begin'
                                    : projectType === 'wedding'
                                    ? 'Design an unforgettable digital invitation'
                                    : `Step ${birthdayStep} of 2`}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* ─── SCREEN 1: Choose Celebration Type ──────────────────────── */}
                {!projectType && (
                    <div className="p-7 space-y-6">
                        <p className="text-sm text-gray-600 text-center max-w-md mx-auto">
                            Choose the kind of experience you want to craft for your loved ones today:
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Birthday Card */}
                            <button
                                type="button"
                                onClick={() => {
                                    setProjectType('birthday')
                                    setSelectedTheme('pink-scrapbook')
                                }}
                                className="p-6 rounded-2xl border-2 border-rose-100 bg-gradient-to-b from-rose-50/50 to-white hover:border-rose-400 hover:shadow-lg transition-all text-left group cursor-pointer"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center text-2xl mb-4 shadow-md group-hover:scale-105 transition-transform">
                                    🎂
                                </div>
                                <h3 className="font-bold text-lg text-gray-900 group-hover:text-rose-600">
                                    Birthday Gift
                                </h3>
                                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                                    Personalized gift experience with cinematic reels, photo scrapbook, letters, cakes & interactive surprises.
                                </p>
                            </button>

                            {/* Wedding Card */}
                            <button
                                type="button"
                                onClick={() => {
                                    setProjectType('wedding')
                                    setSelectedTheme('romantic-letterbook')
                                }}
                                className="p-6 rounded-2xl border-2 border-purple-100 bg-gradient-to-b from-purple-50/50 to-white hover:border-purple-400 hover:shadow-lg transition-all text-left group cursor-pointer"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-center text-2xl mb-4 shadow-md group-hover:scale-105 transition-transform">
                                    💍
                                </div>
                                <h3 className="font-bold text-lg text-gray-900 group-hover:text-purple-600">
                                    Wedding Invitation
                                </h3>
                                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                                    Digital wedding suite featuring ceremony schedules, couple story, RSVP form, countdown timer & venue maps.
                                </p>
                            </button>
                        </div>
                    </div>
                )}

                {/* ─── SCREEN 2: Wedding Invitation Flow ──────────────────────── */}
                {projectType === 'wedding' && (
                    <div className="p-7 space-y-6">
                        {/* TWO CLEAR OPTIONS SELECTION */}
                        {!weddingMode ? (
                            <div className="space-y-6">
                                <div className="text-center space-y-1">
                                    <h3 className="text-lg font-bold text-gray-900">How would you like to build it?</h3>
                                    <p className="text-xs text-gray-500">
                                        You can start with Quick Create and still customize everything in the studio anytime!
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Option A: Quick Create */}
                                    <button
                                        type="button"
                                        onClick={() => setWeddingMode('quick')}
                                        className="p-5 rounded-2xl border-2 border-rose-200 bg-gradient-to-b from-rose-50/60 to-white hover:border-rose-500 hover:shadow-xl transition-all text-left group cursor-pointer"
                                    >
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500 text-white mb-3">
                                            <Wand2 className="w-3 h-3" />
                                            <span>Option A</span>
                                        </div>
                                        <h4 className="font-extrabold text-base text-gray-900 group-hover:text-rose-600">
                                            Quick Create ✨
                                        </h4>
                                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                            Automatically generate a complete wedding invitation with multi-events, live RSVP, countdown & love story in 1 minute.
                                        </p>
                                    </button>

                                    {/* Option B: Customize Everything */}
                                    <button
                                        type="button"
                                        onClick={() => setWeddingMode('custom')}
                                        className="p-5 rounded-2xl border-2 border-purple-200 bg-gradient-to-b from-purple-50/60 to-white hover:border-purple-500 hover:shadow-xl transition-all text-left group cursor-pointer"
                                    >
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-600 text-white mb-3">
                                            <Palette className="w-3 h-3" />
                                            <span>Option B</span>
                                        </div>
                                        <h4 className="font-extrabold text-base text-gray-900 group-hover:text-purple-600">
                                            Customize Everything 🎨
                                        </h4>
                                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                            Full creative control. Choose starter or blank canvas, customize sections, typography, colors, animations & RSVP settings.
                                        </p>
                                    </button>
                                </div>

                                <div className="text-center pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setProjectType(null)}
                                        className="text-xs text-gray-400 hover:text-gray-700 underline"
                                    >
                                        ← Change celebration type
                                    </button>
                                </div>
                            </div>
                        ) : weddingMode === 'quick' ? (
                            /* Quick Create Form */
                            <div className="space-y-4">
                                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                                    <span className="text-xs font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1.5">
                                        <Wand2 className="w-3.5 h-3.5" />
                                        Option A: Quick Create
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setWeddingMode(null)}
                                        className="text-xs text-gray-400 hover:text-gray-700"
                                    >
                                        ← Back to choices
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">Partner 1</label>
                                        <input
                                            type="text"
                                            value={partner1}
                                            onChange={e => setPartner1(e.target.value)}
                                            placeholder="e.g. Aarav"
                                            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
                                            autoFocus
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">Partner 2</label>
                                        <input
                                            type="text"
                                            value={partner2}
                                            onChange={e => setPartner2(e.target.value)}
                                            placeholder="e.g. Meera"
                                            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">Wedding Date</label>
                                        <input
                                            type="text"
                                            value={weddingDate}
                                            onChange={e => setWeddingDate(e.target.value)}
                                            placeholder="December 18, 2026"
                                            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">Venue City</label>
                                        <input
                                            type="text"
                                            value={venueCity}
                                            onChange={e => setVenueCity(e.target.value)}
                                            placeholder="Napa Valley, CA"
                                            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Starting Theme */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-2">Invitation Theme</label>
                                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 max-h-36 overflow-y-auto p-1">
                                        {themes.map(th => (
                                            <button
                                                key={th.id}
                                                type="button"
                                                onClick={() => setSelectedTheme(th.id)}
                                                className={`p-1.5 rounded-xl border text-center transition-all ${
                                                    selectedTheme === th.id
                                                        ? 'border-rose-500 ring-2 ring-rose-200 scale-102'
                                                        : 'border-gray-200 hover:scale-101'
                                                }`}
                                            >
                                                <div className="h-6 rounded-lg mb-1" style={{ background: th.previewGradient }} />
                                                <span className="text-[10px] font-bold text-gray-700 truncate block">{th.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleCreateWeddingQuick}
                                    disabled={loading}
                                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold text-sm shadow-lg shadow-rose-200 hover:shadow-rose-300 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] disabled:opacity-50"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4" />
                                            <span>Generate & Open in Studio ✨</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        ) : (
                            /* Customize Everything Form */
                            <div className="space-y-4">
                                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                                    <span className="text-xs font-bold text-purple-600 uppercase tracking-wider flex items-center gap-1.5">
                                        <Palette className="w-3.5 h-3.5" />
                                        Option B: Customize Everything
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setWeddingMode(null)}
                                        className="text-xs text-gray-400 hover:text-gray-700"
                                    >
                                        ← Back to choices
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">Partner 1</label>
                                        <input
                                            type="text"
                                            value={partner1}
                                            onChange={e => setPartner1(e.target.value)}
                                            placeholder="e.g. Partner 1"
                                            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
                                            autoFocus
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">Partner 2</label>
                                        <input
                                            type="text"
                                            value={partner2}
                                            onChange={e => setPartner2(e.target.value)}
                                            placeholder="e.g. Partner 2"
                                            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Starting Canvas</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setWeddingStarterType('template')}
                                            className={`p-3 rounded-xl border text-left transition-all ${
                                                weddingStarterType === 'template'
                                                    ? 'bg-purple-50 border-purple-400 text-purple-900 ring-2 ring-purple-100 font-semibold'
                                                    : 'bg-white border-gray-200 text-gray-700'
                                            }`}
                                        >
                                            <span className="text-xs font-bold block">✨ Starter Wedding Suite</span>
                                            <span className="text-[10px] text-gray-500">Includes cover, schedule, RSVP & countdown ready to edit</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setWeddingStarterType('blank')}
                                            className={`p-3 rounded-xl border text-left transition-all ${
                                                weddingStarterType === 'blank'
                                                    ? 'bg-purple-50 border-purple-400 text-purple-900 ring-2 ring-purple-100 font-semibold'
                                                    : 'bg-white border-gray-200 text-gray-700'
                                            }`}
                                        >
                                            <span className="text-xs font-bold block">📄 Blank Custom Canvas</span>
                                            <span className="text-[10px] text-gray-500">Start with cover only and add pages manually</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Starting Theme */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-2">Starting Aesthetic Theme</label>
                                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 max-h-32 overflow-y-auto p-1">
                                        {themes.map(th => (
                                            <button
                                                key={th.id}
                                                type="button"
                                                onClick={() => setSelectedTheme(th.id)}
                                                className={`p-1.5 rounded-xl border text-center transition-all ${
                                                    selectedTheme === th.id
                                                        ? 'border-purple-500 ring-2 ring-purple-200 scale-102'
                                                        : 'border-gray-200 hover:scale-101'
                                                }`}
                                            >
                                                <div className="h-6 rounded-lg mb-1" style={{ background: th.previewGradient }} />
                                                <span className="text-[10px] font-bold text-gray-700 truncate block">{th.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleCreateWeddingCustom}
                                    disabled={loading}
                                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-purple-200 hover:shadow-purple-300 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] disabled:opacity-50"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Palette className="w-4 h-4" />
                                            <span>Open Wedding Studio 🎨</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* ─── SCREEN 3: Birthday Flow ────────────────────────────────── */}
                {projectType === 'birthday' && (
                    <div>
                        {birthdayStep === 1 && (
                            <div className="p-7 space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Project Title</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                        placeholder="e.g. Maya's 25th Birthday"
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Birthday Person's Name</label>
                                    <input
                                        type="text"
                                        value={recipientName}
                                        onChange={e => setRecipientName(e.target.value)}
                                        placeholder="e.g. Maya"
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Your Name (Optional)</label>
                                    <input
                                        type="text"
                                        value={senderName}
                                        onChange={e => setSenderName(e.target.value)}
                                        placeholder="e.g. Alex"
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
                                    />
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setProjectType(null)}
                                        className="flex-1 py-3 px-4 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setBirthdayStep(2)}
                                        disabled={!title.trim() || !recipientName.trim()}
                                        className="flex-2 py-3 px-6 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-1.5"
                                    >
                                        <span>Next: Choose Theme</span>
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {birthdayStep === 2 && (
                            <div className="p-7 space-y-4">
                                <label className="block text-xs font-bold text-gray-700 mb-2">Choose Theme</label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                                    {themes.map(th => (
                                        <button
                                            key={th.id}
                                            type="button"
                                            onClick={() => setSelectedTheme(th.id)}
                                            className={`h-20 rounded-xl relative overflow-hidden transition-all text-white p-2 flex flex-col justify-end text-left ${
                                                selectedTheme === th.id ? 'ring-3 ring-rose-500 scale-102' : 'hover:scale-101'
                                            }`}
                                            style={{ background: th.previewGradient }}
                                        >
                                            <span className="font-bold text-xs drop-shadow">{th.name}</span>
                                        </button>
                                    ))}
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setBirthdayStep(1)}
                                        className="flex-1 py-3 px-4 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCreateBirthday}
                                        disabled={loading}
                                        className="flex-2 py-3 px-6 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-1.5"
                                    >
                                        {loading ? 'Creating...' : 'Create Birthday Studio 🎉'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </motion.div>
        </motion.div>
    )
}

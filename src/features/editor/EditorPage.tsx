import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
    Save, Eye, Globe, EyeOff, ChevronLeft, Sparkles, Layers,
    Palette, Image, Settings2, Monitor, Tablet, Smartphone, AlertCircle
} from 'lucide-react'
import { useAuth } from '@/features/auth/AuthContext'
import { supabase } from '@/lib/supabase'
import { getTheme } from '@/lib/theme-registry'
import { validateSlug } from '@/lib/utils'
import type { BirthdayExperience, SectionConfig, SectionType, ThemeId } from '@/lib/types'
import SectionManager from './SectionManager'
import SectionEditor from './SectionEditor'
import ThemeSelector from './ThemeSelector'
import ExperiencePreview from './ExperiencePreview'
import PublishModal from './PublishModal'

type ActivePanel = 'sections' | 'theme' | 'media' | 'settings'
type PreviewDevice = 'desktop' | 'tablet' | 'mobile'

export default function EditorPage() {
    const { experienceId } = useParams<{ experienceId: string }>()
    const { user } = useAuth()
    const navigate = useNavigate()

    const [experience, setExperience] = useState<BirthdayExperience | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [dirty, setDirty] = useState(false)
    const [activePanel, setActivePanel] = useState<ActivePanel>('sections')
    const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null)
    const [previewDevice, setPreviewDevice] = useState<PreviewDevice>('desktop')
    const [showPreview, setShowPreview] = useState(false)
    const [showPublishModal, setShowPublishModal] = useState(false)
    const autoSaveTimer = useRef<ReturnType<typeof setTimeout>>()

    useEffect(() => {
        if (!user || !experienceId) return
        setLoading(true)
        supabase
            .from('birthday_experiences')
            .select('*')
            .eq('id', experienceId)
            .eq('owner_id', user.id)
            .single()
            .then(({ data, error }) => {
                if (error || !data) {
                    toast.error('Project not found or access denied')
                    navigate('/dashboard')
                } else {
                    setExperience(data)
                }
                setLoading(false)
            })
    }, [user, experienceId])

    // Warn on unload if dirty
    useEffect(() => {
        const handler = (e: BeforeUnloadEvent) => {
            if (dirty) { e.preventDefault(); e.returnValue = '' }
        }
        window.addEventListener('beforeunload', handler)
        return () => window.removeEventListener('beforeunload', handler)
    }, [dirty])

    const updateExperience = useCallback((updates: Partial<BirthdayExperience>) => {
        setExperience(prev => {
            if (!prev) return prev
            return { ...prev, ...updates }
        })
        setDirty(true)

        // Auto-save after 2s of inactivity
        clearTimeout(autoSaveTimer.current)
        autoSaveTimer.current = setTimeout(() => {
            setExperience(current => {
                if (current) saveExperience(current, false)
                return current
            })
        }, 2000)
    }, [])

    const saveExperience = async (exp: BirthdayExperience, showToast = true) => {
        if (!exp) return
        setSaving(true)
        const { error } = await supabase
            .from('birthday_experiences')
            .update({
                title: exp.title,
                recipient_name: exp.recipient_name,
                sender_name: exp.sender_name,
                slug: exp.slug,
                theme_id: exp.theme_id,
                theme_settings: exp.theme_settings,
                intro_settings: exp.intro_settings,
                sections: exp.sections,
            })
            .eq('id', exp.id)
            .eq('owner_id', user!.id)

        setSaving(false)
        if (error) {
            if (showToast) toast.error('Failed to save')
        } else {
            setDirty(false)
            if (showToast) toast.success('Saved!')
        }
    }

    const handleSave = () => {
        if (experience) saveExperience(experience, true)
    }

    const handlePublish = async () => {
        setShowPublishModal(true)
    }

    const handleUnpublish = async () => {
        if (!experience) return
        const { error } = await supabase
            .from('birthday_experiences')
            .update({ status: 'draft', published_at: null })
            .eq('id', experience.id)
        if (error) toast.error('Failed to unpublish')
        else {
            setExperience(prev => prev ? { ...prev, status: 'draft', published_at: null } : prev)
            toast.success('Unpublished')
        }
    }

    const selectedSection = experience?.sections.find(s => s.id === selectedSectionId)

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-sm text-gray-400">Loading editor...</p>
                </div>
            </div>
        )
    }

    if (!experience) return null

    const currentTheme = getTheme(experience.theme_id)

    return (
        <div className="h-screen flex flex-col bg-gray-100 overflow-hidden">
            {/* ─── Top toolbar ─────────────────────────────────────────────────── */}
            <header className="flex-shrink-0 bg-white border-b border-gray-200 z-40">
                <div className="flex items-center justify-between px-4 h-14 gap-3">
                    {/* Left */}
                    <div className="flex items-center gap-3 min-w-0">
                        <Link to="/dashboard" className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors flex-shrink-0">
                            <ChevronLeft className="w-4 h-4" />
                            <span className="text-sm font-medium hidden sm:block">Dashboard</span>
                        </Link>
                        <div className="w-px h-5 bg-gray-200" />
                        <div className="min-w-0">
                            <input
                                type="text"
                                value={experience.title}
                                onChange={e => updateExperience({ title: e.target.value })}
                                className="font-display font-bold text-gray-900 text-base bg-transparent border-none outline-none focus:bg-gray-50 rounded px-1 -ml-1 truncate max-w-[180px] sm:max-w-xs"
                                aria-label="Project title"
                            />
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className={`w-1.5 h-1.5 rounded-full ${experience.status === 'published' ? 'bg-green-400' : 'bg-gray-300'}`} />
                                <span className="text-xs text-gray-400">
                                    {experience.status === 'published' ? 'Published' : 'Draft'}
                                    {saving && <span className="ml-1 text-blue-400">· Saving…</span>}
                                    {dirty && !saving && <span className="ml-1 text-amber-400">· Unsaved</span>}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Center: device preview toggle (hidden on mobile) */}
                    <div className="hidden md:flex items-center bg-gray-100 rounded-xl p-1 gap-1">
                        {([
                            { id: 'desktop', icon: Monitor },
                            { id: 'tablet', icon: Tablet },
                            { id: 'mobile', icon: Smartphone },
                        ] as const).map(({ id, icon: Icon }) => (
                            <button
                                key={id}
                                onClick={() => { setPreviewDevice(id); setShowPreview(true) }}
                                className={`p-1.5 rounded-lg transition-all ${previewDevice === id && showPreview ? 'bg-white shadow text-gray-900' : 'text-gray-400 hover:text-gray-700'}`}
                                aria-label={`Preview on ${id}`}
                            >
                                <Icon className="w-4 h-4" />
                            </button>
                        ))}
                        <div className="w-px h-5 bg-gray-200 ml-1" />
                        <button
                            onClick={() => setShowPreview(!showPreview)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${showPreview ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-800'}`}
                        >
                            <Eye className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-2">
                        {dirty && (
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                id="editor-save-btn"
                                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
                            >
                                <Save className="w-4 h-4" />
                                <span className="hidden sm:block">Save</span>
                            </button>
                        )}
                        {experience.status === 'draft' ? (
                            <button
                                onClick={handlePublish}
                                id="editor-publish-btn"
                                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-rose-500 to-pink-600 rounded-xl shadow hover:shadow-rose-200 transition-all"
                            >
                                <Globe className="w-4 h-4" />
                                <span>Publish</span>
                            </button>
                        ) : (
                            <button
                                onClick={handleUnpublish}
                                id="editor-unpublish-btn"
                                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
                            >
                                <EyeOff className="w-4 h-4" />
                                <span>Unpublish</span>
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* ─── Body ─────────────────────────────────────────────────────────── */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left panel: icon sidebar */}
                <div className="flex-shrink-0 w-14 bg-white border-r border-gray-200 flex flex-col items-center py-3 gap-2">
                    {([
                        { id: 'sections', icon: Layers, label: 'Sections' },
                        { id: 'theme', icon: Palette, label: 'Theme' },
                        { id: 'media', icon: Image, label: 'Media' },
                        { id: 'settings', icon: Settings2, label: 'Settings' },
                    ] as const).map(({ id, icon: Icon, label }) => (
                        <button
                            key={id}
                            onClick={() => setActivePanel(id)}
                            title={label}
                            aria-label={label}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${activePanel === id
                                    ? 'bg-rose-50 text-rose-600'
                                    : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                        </button>
                    ))}
                </div>

                {/* Left panel: content */}
                <div className="flex-shrink-0 w-72 bg-white border-r border-gray-200 overflow-y-auto">
                    {activePanel === 'sections' && (
                        <SectionManager
                            sections={experience.sections}
                            selectedSectionId={selectedSectionId}
                            onSelectSection={setSelectedSectionId}
                            onUpdateSections={sections => updateExperience({ sections })}
                        />
                    )}
                    {activePanel === 'theme' && (
                        <ThemeSelector
                            currentThemeId={experience.theme_id}
                            themeSettings={experience.theme_settings}
                            onChangeTheme={theme_id => updateExperience({ theme_id })}
                            onChangeSettings={theme_settings => updateExperience({ theme_settings })}
                        />
                    )}
                    {activePanel === 'media' && (
                        <div className="p-5 text-center text-gray-400 pt-12">
                            <Image className="w-10 h-10 mx-auto mb-3 opacity-30" />
                            <p className="text-sm">Open the Memory Library to manage your media</p>
                            <Link to="/memories" className="mt-3 inline-block text-sm text-rose-500 hover:underline">
                                Go to Memories →
                            </Link>
                        </div>
                    )}
                    {activePanel === 'settings' && (
                        <ProjectSettings
                            experience={experience}
                            onUpdate={updateExperience}
                        />
                    )}
                </div>

                {/* Center: section editor */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {selectedSection ? (
                        <SectionEditor
                            section={selectedSection}
                            experience={experience}
                            onChange={updatedSection => {
                                const sections = experience.sections.map(s =>
                                    s.id === updatedSection.id ? updatedSection : s
                                )
                                updateExperience({ sections })
                            }}
                        />
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-center p-8">
                            <div>
                                <Layers className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                <h3 className="font-display text-xl font-bold text-gray-400">Select a section to edit</h3>
                                <p className="text-sm text-gray-300 mt-2">Click any section in the left panel</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right: live preview panel */}
                {showPreview && (
                    <div className="flex-shrink-0 bg-gray-100 border-l border-gray-200 flex flex-col overflow-hidden"
                        style={{ width: previewDevice === 'desktop' ? '480px' : previewDevice === 'tablet' ? '400px' : '375px' }}>
                        <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-2.5 flex items-center justify-between">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Preview</span>
                            <button onClick={() => setShowPreview(false)} className="text-gray-400 hover:text-gray-600 text-xs">✕</button>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            <ExperiencePreview experience={experience} device={previewDevice} />
                        </div>
                    </div>
                )}
            </div>

            {/* Publish modal */}
            <AnimatePresence>
                {showPublishModal && (
                    <PublishModal
                        experience={experience}
                        onClose={() => setShowPublishModal(false)}
                        onPublished={updated => {
                            setExperience(updated)
                            setShowPublishModal(false)
                            toast.success('🎉 Your birthday website is live!')
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}

// ─── Inline settings panel ─────────────────────────────────────────────────────
function ProjectSettings({ experience, onUpdate }: { experience: BirthdayExperience; onUpdate: (u: Partial<BirthdayExperience>) => void }) {
    const [slug, setSlug] = useState(experience.slug ?? '')
    const [slugError, setSlugError] = useState<string | null>(null)

    const handleSlugChange = (value: string) => {
        const normalized = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        setSlug(normalized)
        if (normalized) {
            const { valid, error } = validateSlug(normalized)
            setSlugError(valid ? null : error ?? null)
            if (valid) onUpdate({ slug: normalized })
        }
    }

    return (
        <div className="p-5 space-y-6">
            <h3 className="font-display font-bold text-gray-900">Project Settings</h3>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Birthday person</label>
                <input
                    type="text"
                    value={experience.recipient_name}
                    onChange={e => onUpdate({ recipient_name: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                    placeholder="Recipient name"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your name</label>
                <input
                    type="text"
                    value={experience.sender_name ?? ''}
                    onChange={e => onUpdate({ sender_name: e.target.value || null })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                    placeholder="Sender name (optional)"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug</label>
                <div className="flex items-center gap-1 text-xs text-gray-400 mb-1.5">
                    <span>/birthday/</span>
                    <span className="text-gray-600 font-medium">{slug || '…'}</span>
                </div>
                <input
                    type="text"
                    value={slug}
                    onChange={e => handleSlugChange(e.target.value)}
                    className={`w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 ${slugError ? 'border-red-300' : 'border-gray-200'}`}
                    placeholder="riya-special-day"
                />
                {slugError && (
                    <div className="flex items-center gap-1.5 mt-1.5 text-xs text-red-600">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {slugError}
                    </div>
                )}
            </div>
        </div>
    )
}


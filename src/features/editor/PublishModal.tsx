import React, { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Globe, X, Copy, AlertCircle, CheckCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { validateSlug } from '@/lib/utils'
import { getProjectType } from '@/lib/project-helpers'
import type { BirthdayExperience } from '@/lib/types'

interface Props {
    experience: BirthdayExperience
    onClose: () => void
    onPublished: (updated: BirthdayExperience) => void
}

export default function PublishModal({ experience, onClose, onPublished }: Props) {
    const [slug, setSlug] = useState(experience.slug ?? '')
    const [slugError, setSlugError] = useState<string | null>(null)
    const [checking, setChecking] = useState(false)
    const [publishing, setPublishing] = useState(false)
    const [copied, setCopied] = useState(false)

    const appUrl = import.meta.env.VITE_APP_URL || window.location.origin

    const handleSlugChange = (value: string) => {
        const normalized = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        setSlug(normalized)
        if (normalized) {
            const { valid, error } = validateSlug(normalized)
            setSlugError(valid ? null : error ?? null)
        } else {
            setSlugError('URL slug is required')
        }
    }

    const checkSlugAvailability = async () => {
        if (!slug || slugError) return
        setChecking(true)
        const { data } = await supabase
            .from('birthday_experiences')
            .select('id')
            .eq('slug', slug)
            .neq('id', experience.id)
            .maybeSingle()
        setChecking(false)
        if (data) setSlugError('This URL is already taken. Try another.')
    }

    const handlePublish = async () => {
        if (!slug || slugError) return
        setPublishing(true)

        // Final uniqueness check
        const { data: existing } = await supabase
            .from('birthday_experiences')
            .select('id')
            .eq('slug', slug)
            .neq('id', experience.id)
            .maybeSingle()

        if (existing) {
            setSlugError('This URL is already taken. Try another.')
            setPublishing(false)
            return
        }

        const { data, error } = await supabase
            .from('birthday_experiences')
            .update({ slug, status: 'published', published_at: new Date().toISOString() })
            .eq('id', experience.id)
            .select()
            .single()

        setPublishing(false)
        if (error || !data) {
            toast.error('Failed to publish')
            return
        }
        onPublished(data)
    }

    const isWedding = getProjectType(experience) === 'wedding'
    const publicUrl = `${appUrl}/${isWedding ? 'wedding' : 'birthday'}/${slug || '...'}`

    const copyLink = () => {
        navigator.clipboard.writeText(publicUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        toast.success('Link copied!')
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={e => { if (e.target === e.currentTarget) onClose() }}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-400 to-pink-600 flex items-center justify-center">
                            <Globe className="w-4 h-4 text-white" />
                        </div>
                        <h2 className="font-display font-bold text-xl text-gray-900">{isWedding ? "Publish Wedding Invitation 💍" : "Publish to web 🎉"}</h2>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-7 space-y-6">
                    {/* Slug setter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Choose your URL
                        </label>
                        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-rose-400 focus-within:border-transparent">
                            <span className="pl-4 pr-1 text-sm text-gray-400 whitespace-nowrap">{appUrl}/birthday/</span>
                            <input
                                type="text"
                                value={slug}
                                onChange={e => handleSlugChange(e.target.value)}
                                onBlur={checkSlugAvailability}
                                placeholder="riya-special-day"
                                className="flex-1 py-3 pr-4 bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none font-medium"
                            />
                        </div>
                        {slugError && (
                            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-red-600">
                                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                                {slugError}
                            </div>
                        )}
                        {checking && <p className="text-xs text-gray-400 mt-1.5">Checking availability...</p>}
                    </div>

                    {/* Preview of final URL */}
                    <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-400 mb-0.5">Your birthday website URL</p>
                            <p className="text-sm font-medium text-gray-900 truncate">{publicUrl}</p>
                        </div>
                        <button onClick={copyLink} disabled={!slug || !!slugError}
                            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-40">
                            {copied ? <CheckCircle className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>

                    {/* Publish checklist */}
                    <div className="space-y-2">
                        {[
                            { ok: !!experience.sections.find(s => s.type === 'birthday-hero' && s.visible), label: 'Birthday hero section is visible' },
                            { ok: experience.sections.some(s => s.visible), label: 'At least one section is visible' },
                            { ok: !!slug && !slugError, label: 'URL slug is valid and available' },
                        ].map(check => (
                            <div key={check.label} className="flex items-center gap-2 text-sm">
                                {check.ok
                                    ? <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                    : <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />}
                                <span className={check.ok ? 'text-gray-600' : 'text-amber-600'}>{check.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button onClick={onClose} className="flex-1 py-3 px-4 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all">
                            Cancel
                        </button>
                        <button
                            onClick={handlePublish}
                            disabled={publishing || !slug || !!slugError || checking}
                            id="confirm-publish-btn"
                            className="flex-2 flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-rose-200 transition-all disabled:opacity-50"
                        >
                            {publishing
                                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                : <Globe className="w-4 h-4" />}
                            {publishing ? 'Publishing...' : '🎉 Publish now'}
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}

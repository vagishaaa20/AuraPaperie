import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Image as ImageIcon, Upload, Sparkles } from 'lucide-react'
import { useAuth } from '@/features/auth/AuthContext'
import { supabase, MEMORIES_BUCKET, uploadFile, getPublicUrl } from '@/lib/supabase'
import toast from 'react-hot-toast'
import type { SectionConfig, BirthdayExperience } from '@/lib/types'

interface Props {
    section: SectionConfig
    experience: BirthdayExperience
    config: Record<string, unknown>
    onChange: (config: Record<string, unknown>) => void
}

export default function MemoryScrapbookEditor({ config, onChange }: Props) {
    const { user } = useAuth()
    const update = (key: string, value: unknown) => onChange({ ...config, [key]: value })
    const photos = (config.photos as { url: string; caption?: string; date?: string; location?: string }[]) ?? []

    const [uploading, setUploading] = useState(false)
    const [newUrl, setNewUrl] = useState('')
    const [newCaption, setNewCaption] = useState('')

    const handleFileUpload = async (file: File) => {
        if (!user) {
            toast.error('Sign in to upload files')
            return
        }
        setUploading(true)
        const path = `${user.id}/${Date.now()}_${file.name}`
        const { error } = await uploadFile(MEMORIES_BUCKET, path, file)
        setUploading(false)

        if (error) {
            toast.error('Upload failed')
            return
        }

        const publicUrl = getPublicUrl(MEMORIES_BUCKET, path)
        const updated = [...photos, { url: publicUrl, caption: newCaption.trim() || undefined }]
        onChange({ ...config, photos: updated })
        setNewCaption('')
        toast.success('Photo uploaded!')
    }

    const addManualUrl = () => {
        if (!newUrl.trim()) return
        const updated = [...photos, { url: newUrl.trim(), caption: newCaption.trim() || undefined }]
        onChange({ ...config, photos: updated })
        setNewUrl('')
        setNewCaption('')
    }

    const removePhoto = (index: number) => {
        const updated = photos.filter((_, i) => i !== index)
        onChange({ ...config, photos: updated })
    }

    const updateCaption = (index: number, caption: string) => {
        const updated = photos.map((p, i) => i === index ? { ...p, caption } : p)
        onChange({ ...config, photos: updated })
    }

    return (
        <div className="p-6 space-y-6">
            <div>
                <h2 className="font-display font-bold text-xl text-gray-900 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-rose-500" />
                    Memory Scrapbook
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                    Upload your favorite photographs. Each theme presents them with matching tape, angles, and frames.
                </p>
            </div>

            {/* General Section Settings */}
            <div className="space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                        Section Title
                    </label>
                    <input
                        type="text"
                        value={(config.title as string) ?? 'Our Memories'}
                        onChange={e => update('title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                        Subtitle
                    </label>
                    <input
                        type="text"
                        value={(config.subtitle as string) ?? ''}
                        placeholder="Every moment with you is a treasure"
                        onChange={e => update('subtitle', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />
                </div>
            </div>

            {/* Upload or Add Photo */}
            <div className="border border-rose-100 bg-rose-50/40 p-4 rounded-2xl space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-rose-700">Add Photograph</h3>

                <input
                    type="text"
                    placeholder="Caption for this photo (optional)"
                    value={newCaption}
                    onChange={e => setNewCaption(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-400"
                />

                <div className="flex gap-2">
                    <label className="flex-1 cursor-pointer py-2.5 px-4 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors">
                        <Upload className="w-4 h-4" />
                        <span>{uploading ? 'Uploading...' : 'Upload File (JPG/PNG)'}</span>
                        <input
                            type="file"
                            accept="image/*"
                            disabled={uploading}
                            className="hidden"
                            onChange={e => {
                                const file = e.target.files?.[0]
                                if (file) handleFileUpload(file)
                            }}
                        />
                    </label>
                </div>

                <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-gray-200" />
                    <span className="flex-shrink mx-2 text-[10px] text-gray-400 uppercase font-semibold">or paste URL</span>
                    <div className="flex-grow border-t border-gray-200" />
                </div>

                <div className="flex gap-2">
                    <input
                        type="url"
                        placeholder="https://.../photo.jpg"
                        value={newUrl}
                        onChange={e => setNewUrl(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />
                    <button
                        type="button"
                        onClick={addManualUrl}
                        disabled={!newUrl.trim()}
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-900 disabled:opacity-40 text-white text-xs font-semibold rounded-xl"
                    >
                        Add URL
                    </button>
                </div>
            </div>

            {/* Photos List */}
            <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                    Photos in Scrapbook ({photos.length})
                </label>

                {photos.length === 0 ? (
                    <p className="text-xs text-gray-400 italic text-center py-4">No photos added yet.</p>
                ) : (
                    <div className="space-y-3">
                        {photos.map((photo, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl shadow-xs"
                            >
                                <img
                                    src={photo.url}
                                    alt=""
                                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border"
                                />
                                <div className="flex-1 min-w-0">
                                    <input
                                        type="text"
                                        placeholder="Caption..."
                                        value={photo.caption ?? ''}
                                        onChange={e => updateCaption(i, e.target.value)}
                                        className="w-full text-xs font-medium text-gray-800 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-rose-400 focus:outline-none pb-0.5"
                                    />
                                    <p className="text-[10px] text-gray-400 truncate mt-0.5">{photo.url}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removePhoto(i)}
                                    className="p-1.5 text-gray-400 hover:text-rose-500 cursor-pointer"
                                    aria-label="Remove photo"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

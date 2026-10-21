import React, { useState } from 'react'
import { Plus, Trash2, Film, Image as ImageIcon, Video, ArrowUp, ArrowDown } from 'lucide-react'
import type { SectionConfig, BirthdayExperience } from '@/lib/types'

interface ReelSlide {
    url: string
    type?: 'image' | 'video'
    caption?: string
    title?: string
    duration?: number
}

interface Props {
    section: SectionConfig
    experience: BirthdayExperience
    config: Record<string, unknown>
    onChange: (config: Record<string, unknown>) => void
}

export default function CinematicReelEditor({ config, onChange }: Props) {
    const update = (key: string, value: unknown) => onChange({ ...config, [key]: value })
    const slides = (config.slides as ReelSlide[]) ?? []
    const aspectRatio = (config.aspect_ratio as string) ?? '16:9'
    const slideDuration = (config.slide_duration as number) ?? 4

    const [newUrl, setNewUrl] = useState('')
    const [newTitle, setNewTitle] = useState('')
    const [newCaption, setNewCaption] = useState('')
    const [newType, setNewType] = useState<'image' | 'video'>('image')

    const addSlide = () => {
        if (!newUrl.trim()) return
        const newSlide: ReelSlide = {
            url: newUrl.trim(),
            type: newType,
            title: newTitle.trim() || undefined,
            caption: newCaption.trim() || undefined,
            duration: slideDuration,
        }
        onChange({ ...config, slides: [...slides, newSlide] })
        setNewUrl('')
        setNewTitle('')
        setNewCaption('')
    }

    const removeSlide = (index: number) => {
        onChange({ ...config, slides: slides.filter((_, i) => i !== index) })
    }

    const moveSlide = (index: number, direction: 'up' | 'down') => {
        const target = direction === 'up' ? index - 1 : index + 1
        if (target < 0 || target >= slides.length) return
        const updated = [...slides]
        const temp = updated[index]
        updated[index] = updated[target]
        updated[target] = temp
        onChange({ ...config, slides: updated })
    }

    return (
        <div className="p-6 space-y-6">
            <div>
                <h2 className="font-display font-bold text-xl text-gray-900 flex items-center gap-2">
                    <Film className="w-5 h-5 text-rose-500" />
                    Cinematic Memory Reel
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                    Assemble photographs and videos into a music-synced cinematic montage with pan/zoom effects.
                </p>
            </div>

            {/* General Settings */}
            <div className="space-y-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                        Reel Heading
                    </label>
                    <input
                        type="text"
                        value={(config.title as string) ?? ''}
                        placeholder="Highlight Reel"
                        onChange={e => update('title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                            Aspect Ratio
                        </label>
                        <select
                            value={aspectRatio}
                            onChange={e => update('aspect_ratio', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-400"
                        >
                            <option value="16:9">16:9 (Landscape / Widescreen)</option>
                            <option value="9:16">9:16 (Portrait / Reels)</option>
                            <option value="1:1">1:1 (Square)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                            Slide Duration (sec)
                        </label>
                        <input
                            type="number"
                            min="2"
                            max="10"
                            value={slideDuration}
                            onChange={e => update('slide_duration', Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-400"
                        />
                    </div>
                </div>
            </div>

            {/* Add Slide Form */}
            <div className="border border-rose-100 bg-rose-50/40 p-4 rounded-2xl space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-rose-700">Add Slide / Clip</h3>

                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => setNewType('image')}
                        className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                            newType === 'image' ? 'bg-rose-500 text-white shadow-sm' : 'bg-white text-gray-600 border'
                        }`}
                    >
                        <ImageIcon className="w-3.5 h-3.5" /> Photo
                    </button>
                    <button
                        type="button"
                        onClick={() => setNewType('video')}
                        className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                            newType === 'video' ? 'bg-rose-500 text-white shadow-sm' : 'bg-white text-gray-600 border'
                        }`}
                    >
                        <Video className="w-3.5 h-3.5" /> Video (MP4)
                    </button>
                </div>

                <input
                    type="url"
                    value={newUrl}
                    placeholder={newType === 'video' ? 'https://.../video.mp4' : 'https://.../photo.jpg'}
                    onChange={e => setNewUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-400"
                />

                <div className="grid grid-cols-2 gap-2">
                    <input
                        type="text"
                        value={newTitle}
                        placeholder="Title card (optional)"
                        onChange={e => setNewTitle(e.target.value)}
                        className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />
                    <input
                        type="text"
                        value={newCaption}
                        placeholder="Caption / Subtitle"
                        onChange={e => setNewCaption(e.target.value)}
                        className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />
                </div>

                <button
                    type="button"
                    onClick={addSlide}
                    disabled={!newUrl.trim()}
                    className="w-full py-2 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                    <Plus className="w-4 h-4" /> Add to Reel
                </button>
            </div>

            {/* Slides List */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Clips ({slides.length})
                    </label>
                </div>

                {slides.length === 0 ? (
                    <p className="text-xs text-gray-400 italic text-center py-4">No slides in this reel yet.</p>
                ) : (
                    <div className="space-y-2">
                        {slides.map((slide, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-3 p-2.5 bg-white border border-gray-200 rounded-xl shadow-xs"
                            >
                                <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center border">
                                    {slide.type === 'video' ? (
                                        <Video className="w-5 h-5 text-gray-400" />
                                    ) : (
                                        <img src={slide.url} alt="" className="w-full h-full object-cover" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-gray-800 truncate">
                                        {slide.title || `Clip #${i + 1}`}
                                    </p>
                                    <p className="text-[11px] text-gray-400 truncate">{slide.caption || slide.url}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() => moveSlide(i, 'up')}
                                        disabled={i === 0}
                                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                                    >
                                        <ArrowUp className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => moveSlide(i, 'down')}
                                        disabled={i === slides.length - 1}
                                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                                    >
                                        <ArrowDown className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => removeSlide(i)}
                                        className="p-1 text-rose-500 hover:text-rose-700"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

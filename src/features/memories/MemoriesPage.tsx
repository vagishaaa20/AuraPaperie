import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { Plus, Sparkles, Image, FileText, Music, Video, Search, Trash2, X, Upload, ChevronLeft } from 'lucide-react'
import { useAuth } from '@/features/auth/AuthContext'
import { supabase, MEMORIES_BUCKET, uploadFile, getPublicUrl } from '@/lib/supabase'
import type { MemoryAsset } from '@/lib/types'
import { formatBytes } from '@/lib/utils'

const MEMORY_TYPES = [
    { value: 'photo', label: 'Photo', icon: Image, color: 'text-rose-500 bg-rose-50' },
    { value: 'video', label: 'Video', icon: Video, color: 'text-purple-500 bg-purple-50' },
    { value: 'audio', label: 'Audio', icon: Music, color: 'text-blue-500 bg-blue-50' },
    { value: 'text', label: 'Note', icon: FileText, color: 'text-amber-500 bg-amber-50' },
] as const

// ─── Upload modal ────────────────────────────────────────────────────────────
function UploadModal({ onClose, onUploaded }: { onClose: () => void; onUploaded: () => void }) {
    const { user } = useAuth()
    const [type, setType] = useState<'photo' | 'video' | 'audio' | 'text'>('photo')
    const [title, setTitle] = useState('')
    const [textBody, setTextBody] = useState('')
    const [file, setFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const acceptMap: Record<string, string> = {
        photo: 'image/*',
        video: 'video/*',
        audio: 'audio/*',
        text: '',
    }

    const handleSubmit = async () => {
        if (!user || !title.trim()) { toast.error('Title is required'); return }
        if (type !== 'text' && !file) { toast.error('Please select a file'); return }

        setUploading(true)
        let fileUrl: string | undefined
        let fileSize: number | undefined
        let mimeType: string | undefined

        if (file) {
            const path = `${user.id}/${Date.now()}_${file.name}`
            const { error: uploadError } = await uploadFile(MEMORIES_BUCKET, path, file)
            if (uploadError) { toast.error('Upload failed'); setUploading(false); return }
            fileUrl = getPublicUrl(MEMORIES_BUCKET, path)
            fileSize = file.size
            mimeType = file.type
        }

        const { error } = await supabase.from('memory_assets').insert({
            owner_id: user.id,
            title: title.trim(),
            type,
            file_url: fileUrl ?? null,
            text_content: type === 'text' ? textBody : null,
            file_size: fileSize ?? null,
            mime_type: mimeType ?? null,
            tags: [],
        })

        setUploading(false)
        if (error) { toast.error('Failed to save memory'); return }
        toast.success('Memory saved! ✨')
        onUploaded()
        onClose()
    }

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={e => { if (e.target === e.currentTarget) onClose() }}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="font-display font-bold text-xl text-gray-900">Add to Memory Library</h2>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400"><X className="w-5 h-5" /></button>
                </div>

                <div className="p-6 space-y-5">
                    {/* Type */}
                    <div className="grid grid-cols-4 gap-2">
                        {MEMORY_TYPES.map(t => (
                            <button key={t.value} onClick={() => setType(t.value)}
                                className={`flex flex-col items-center py-3 rounded-xl border-2 text-xs font-semibold gap-1.5 transition-all ${type === t.value ? 'border-rose-400 bg-rose-50 text-rose-700' : 'border-gray-200 text-gray-500'}`}>
                                <t.icon className="w-5 h-5" />
                                {t.label}
                            </button>
                        ))}
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                            placeholder="e.g. Beach holiday 2023"
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400" />
                    </div>

                    {/* File or text */}
                    {type === 'text' ? (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                            <textarea value={textBody} onChange={e => setTextBody(e.target.value)}
                                placeholder="Write your note, quote, or memory here..."
                                rows={5}
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none" />
                        </div>
                    ) : (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">File</label>
                            <div
                                onClick={() => inputRef.current?.click()}
                                className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-rose-300 hover:bg-rose-50 transition-all"
                            >
                                {file ? (
                                    <div>
                                        <p className="font-medium text-sm text-gray-900">{file.name}</p>
                                        <p className="text-xs text-gray-400 mt-1">{formatBytes(file.size)}</p>
                                    </div>
                                ) : (
                                    <>
                                        <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                        <p className="text-sm text-gray-400">Click to upload {type}</p>
                                        <p className="text-xs text-gray-300 mt-1">Max 50MB</p>
                                    </>
                                )}
                            </div>
                            <input ref={inputRef} type="file" accept={acceptMap[type]} onChange={e => setFile(e.target.files?.[0] ?? null)} className="hidden" />
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        <button onClick={onClose} className="flex-1 py-3 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all">
                            Cancel
                        </button>
                        <button onClick={handleSubmit} disabled={uploading}
                            className="flex-2 flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-rose-200 transition-all disabled:opacity-50">
                            {uploading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Plus className="w-4 h-4" />}
                            {uploading ? 'Saving...' : 'Save memory'}
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}

// ─── Memory card ───────────────────────────────────────────────────────────────
function MemoryCard({ memory, onDelete }: { memory: MemoryAsset; onDelete: () => void }) {
    const meta = MEMORY_TYPES.find(t => t.value === memory.type)

    const handleDelete = async () => {
        if (!confirm(`Delete "${memory.title}"?`)) return
        const { error } = await supabase.from('memory_assets').delete().eq('id', memory.id)
        if (error) toast.error('Failed to delete')
        else { toast.success('Deleted'); onDelete() }
    }

    return (
        <motion.div
            layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all overflow-hidden group"
        >
            {/* Preview */}
            <div className="h-36 bg-gray-50 relative overflow-hidden">
                {memory.type === 'photo' && memory.file_url ? (
                    <img src={memory.file_url} alt={memory.title} className="w-full h-full object-cover" />
                ) : memory.type === 'video' && memory.file_url ? (
                    <video src={memory.file_url} className="w-full h-full object-cover" />
                ) : (
                    <div className={`w-full h-full flex items-center justify-center ${meta?.color ?? 'bg-gray-100'}`}>
                        {meta && <meta.icon className="w-10 h-10 opacity-40" />}
                    </div>
                )}
                <button onClick={handleDelete}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-50 text-gray-400 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            <div className="p-4">
                <h3 className="font-semibold text-gray-900 text-sm truncate">{memory.title}</h3>
                {memory.type === 'text' && memory.text_content && (
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{memory.text_content}</p>
                )}
                <div className="flex items-center justify-between mt-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${meta?.color ?? 'bg-gray-100 text-gray-500'}`}>
                        {meta && <meta.icon className="w-3 h-3" />}
                        {memory.type}
                    </span>
                    {memory.file_size && (
                        <span className="text-xs text-gray-300">{formatBytes(memory.file_size)}</span>
                    )}
                </div>
            </div>
        </motion.div>
    )
}

// ─── Memory Library page ───────────────────────────────────────────────────────
export default function MemoriesPage() {
    const { user } = useAuth()
    const [memories, setMemories] = useState<MemoryAsset[]>([])
    const [loading, setLoading] = useState(true)
    const [showUpload, setShowUpload] = useState(false)
    const [search, setSearch] = useState('')
    const [filterType, setFilterType] = useState<string>('all')

    const fetchMemories = async () => {
        if (!user) return
        setLoading(true)
        const { data, error } = await supabase
            .from('memory_assets')
            .select('*')
            .eq('owner_id', user.id)
            .order('created_at', { ascending: false })
        if (!error && data) setMemories(data)
        setLoading(false)
    }

    useEffect(() => { fetchMemories() }, [user])

    const filtered = memories.filter(m => {
        const matchesType = filterType === 'all' || m.type === filterType
        const matchesSearch = !search || m.title.toLowerCase().includes(search.toLowerCase())
        return matchesType && matchesSearch
    })

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link to="/dashboard" className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors">
                            <ChevronLeft className="w-4 h-4" />
                            <span className="text-sm font-medium hidden sm:block">Dashboard</span>
                        </Link>
                        <div className="w-px h-5 bg-gray-200" />
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-400 to-pink-600 flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <h1 className="font-display font-bold text-xl text-gray-900">Memory Library</h1>
                        </div>
                    </div>
                    <button
                        id="upload-memory-btn"
                        onClick={() => setShowUpload(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-rose-200 transition-all hover:scale-[1.02]"
                    >
                        <Plus className="w-4 h-4" />
                        Add memory
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text" value={search} onChange={e => setSearch(e.target.value)}
                            placeholder="Search memories..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        {['all', 'photo', 'video', 'audio', 'text'].map(type => (
                            <button key={type} onClick={() => setFilterType(type)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${filterType === type ? 'bg-rose-100 text-rose-700' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                                <div className="h-36 bg-gray-200" />
                                <div className="p-4 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-24">
                        <div className="text-7xl mb-6">📷</div>
                        <h3 className="font-display text-2xl font-bold text-gray-900 mb-3">
                            {search || filterType !== 'all' ? 'No memories match your filter' : 'Your memory library is empty'}
                        </h3>
                        <p className="text-gray-500 mb-8">Add photos, videos, audio clips, and notes to reuse across any birthday project.</p>
                        <button onClick={() => setShowUpload(true)}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold rounded-2xl shadow-xl shadow-rose-200">
                            <Plus className="w-5 h-5" />
                            Add your first memory
                        </button>
                    </div>
                ) : (
                    <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        <AnimatePresence>
                            {filtered.map(memory => (
                                <MemoryCard key={memory.id} memory={memory} onDelete={fetchMemories} />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </main>

            <AnimatePresence>
                {showUpload && (
                    <UploadModal onClose={() => setShowUpload(false)} onUploaded={fetchMemories} />
                )}
            </AnimatePresence>
        </div>
    )
}

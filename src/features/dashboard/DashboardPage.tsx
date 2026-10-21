import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
    Plus, Sparkles, Edit2, Eye, Copy, Globe, EyeOff, Trash2,
    MoreVertical, Calendar, Clock, LogOut, Brain, ChevronRight
} from 'lucide-react'
import { useAuth } from '@/features/auth/AuthContext'
import { supabase } from '@/lib/supabase'
import { getTheme } from '@/lib/theme-registry'
import { getProjectType } from '@/lib/project-helpers'
import { generateSlug, timeAgo } from '@/lib/utils'
import type { BirthdayExperience, ThemeId } from '@/lib/types'
import NewProjectModal from './NewProjectModal'
import QuickCreateModal from './QuickCreateModal'
import WeddingQuickCreateModal from '../wedding/WeddingQuickCreateModal'
import { Heart, Users } from 'lucide-react'
import { Wand2 } from 'lucide-react'

// ─── Project card ─────────────────────────────────────────────────────────────
function ProjectCard({
    project,
    onRefresh,
}: {
    project: BirthdayExperience
    onRefresh: () => void
}) {
    const navigate = useNavigate()
    const [menuOpen, setMenuOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const theme = getTheme(project.theme_id)
    const isWedding = getProjectType(project) === 'wedding'

    const handleDelete = async () => {
        if (!confirm(`Delete "${project.title}"? This cannot be undone.`)) return
        setLoading(true)
        const { error } = await supabase.from('birthday_experiences').delete().eq('id', project.id)
        setLoading(false)
        if (error) toast.error('Failed to delete project')
        else { toast.success('Project deleted'); onRefresh() }
    }

    const handleDuplicate = async () => {
        setLoading(true)
        const { error } = await supabase.from('birthday_experiences').insert({
            ...project,
            id: undefined as unknown as string,
            title: `${project.title} (copy)`,
            slug: null,
            status: 'draft',
            published_at: null,
        })
        setLoading(false)
        if (error) toast.error('Failed to duplicate project')
        else { toast.success('Project duplicated!'); onRefresh() }
    }

    const handlePublishToggle = async () => {
        if (project.status === 'draft' && !project.slug) {
            toast.error('Set a URL slug before publishing')
            navigate(`/editor/${project.id}`)
            return
        }
        setLoading(true)
        const updates = project.status === 'draft'
            ? { status: 'published' as const, published_at: new Date().toISOString() }
            : { status: 'draft' as const, published_at: null }

        const { error } = await supabase
            .from('birthday_experiences')
            .update(updates)
            .eq('id', project.id)

        setLoading(false)
        if (error) toast.error('Failed to update project')
        else {
            toast.success(project.status === 'draft' ? '🎉 Published!' : 'Unpublished')
            onRefresh()
        }
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
        >
            {/* Thumbnail / theme preview */}
            <div
                className="h-32 relative overflow-hidden"
                style={{ background: theme.previewGradient }}
            >
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                        <p className="font-handwriting text-2xl opacity-80">✨ {project.recipient_name}</p>
                    </div>
                </div>
                <div className="absolute top-3 right-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border ${project.status === 'published'
                            ? 'bg-green-500/20 border-green-300/30 text-green-100'
                            : 'bg-black/20 border-white/20 text-white'
                        }`}>
                        {project.status === 'published' ? '● Live' : '○ Draft'}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        <h3 className="font-display font-bold text-gray-900 text-lg truncate">{project.title}</h3>
                        <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-gray-100 text-gray-600">
                                {isWedding ? '💍 Wedding' : '🎂 Birthday'}
                            </span>
                            <span className="text-xs text-gray-400 truncate">For {project.recipient_name}</span>
                        </div>
                    </div>
                    <div className="relative">
                        <button
                            id={`project-menu-${project.id}`}
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400"
                            aria-label="Project options"
                        >
                            <MoreVertical className="w-4 h-4" />
                        </button>
                        <AnimatePresence>
                            {menuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -8 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -8 }}
                                    onBlur={() => setMenuOpen(false)}
                                    className="absolute right-0 top-8 z-50 bg-white border border-gray-200 rounded-xl shadow-xl min-w-[180px] py-1"
                                >
                                    {[
                                        { label: 'Edit', icon: Edit2, action: () => navigate(`/editor/${project.id}`) },
                                        { label: 'Preview', icon: Eye, action: () => window.open(isWedding ? `/wedding/${project.slug || project.id}` : `/birthday/${project.slug || project.id}`, '_blank') },
                                        { label: 'Duplicate', icon: Copy, action: handleDuplicate },
                                        ...(isWedding ? [{ label: 'View RSVPs', icon: Users, action: () => navigate(`/rsvps/${project.id}`) }] : []),
                                        { label: project.status === 'draft' ? 'Publish' : 'Unpublish', icon: project.status === 'draft' ? Globe : EyeOff, action: handlePublishToggle },
                                    ].map(item => (
                                        <button
                                            key={item.label}
                                            onClick={() => { item.action(); setMenuOpen(false) }}
                                            className="w-full px-4 py-2.5 flex items-center gap-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            <item.icon className="w-4 h-4 text-gray-400" />
                                            {item.label}
                                        </button>
                                    ))}
                                    <div className="border-t border-gray-100 my-1" />
                                    <button
                                        onClick={() => { handleDelete(); setMenuOpen(false) }}
                                        className="w-full px-4 py-2.5 flex items-center gap-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{timeAgo(project.updated_at)}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{theme.name}</span>
                </div>

                {project.slug && (
                    <p className="mt-2 text-xs text-gray-400 truncate">{project.project_type === 'wedding' ? '/wedding/' : '/birthday/'}{project.slug}</p>
                )}

                <div className="flex gap-2 mt-4">
                    <Link
                        to={`/editor/${project.id}`}
                        id={`edit-project-${project.id}`}
                        className="flex-1 py-2.5 px-4 text-sm font-semibold text-center text-white bg-gradient-to-r from-rose-500 to-pink-600 rounded-xl hover:shadow-lg hover:shadow-rose-200 transition-all"
                    >
                        Edit
                    </Link>
                    <button
                        onClick={handlePublishToggle}
                        disabled={loading}
                        className="flex items-center gap-1.5 py-2.5 px-4 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all disabled:opacity-50"
                    >
                        {project.status === 'draft' ? <Globe className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        {project.status === 'draft' ? 'Publish' : 'Unpublish'}
                    </button>
                </div>
            </div>
        </motion.div>
    )
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ onNew, onQuick }: { onNew: () => void; onQuick: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
        >
            <div className="text-7xl mb-6">🎂</div>
            <h3 className="font-display text-2xl font-bold text-gray-900 mb-3">
                Your first birthday website awaits
            </h3>
            <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">
                Create something magical for someone you love. Takes less than 10 minutes.
            </p>
            <button
                id="empty-state-create"
                onClick={onNew}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold rounded-2xl shadow-xl shadow-rose-200 hover:shadow-rose-300 transition-all hover:scale-[1.02]"
            >
                <Plus className="w-5 h-5" />
                Create your first birthday website
            </button>
        </motion.div>
    )
}

// ─── Dashboard page ───────────────────────────────────────────────────────────
export default function DashboardPage() {
    const { user, profile, signOut } = useAuth()
    const [projects, setProjects] = useState<BirthdayExperience[]>([])
    const [loading, setLoading] = useState(true)
    const [showNewModal, setShowNewModal] = useState(false)
    const [showQuickModal, setShowQuickModal] = useState(false)
    const [showWeddingModal, setShowWeddingModal] = useState(false)

    const fetchProjects = async () => {
        if (!user) return
        setLoading(true)
        const { data, error } = await supabase
            .from('birthday_experiences')
            .select('*')
            .eq('owner_id', user.id)
            .order('updated_at', { ascending: false })

        if (!error && data) setProjects(data)
        setLoading(false)
    }

    useEffect(() => { fetchProjects() }, [user])

    const handleSignOut = async () => {
        await signOut()
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-400 to-pink-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-display font-bold text-xl text-gray-900 hidden sm:block">B'Day</span>
                    </Link>

                    <nav className="flex items-center gap-1">
                        <Link
                            to="/memories"
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all"
                        >
                            <Brain className="w-4 h-4" />
                            <span className="hidden sm:block">Memories</span>
                        </Link>
                    </nav>

                    <div className="flex items-center gap-3">
                        <div className="hidden md:block text-right">
                            <p className="text-sm font-semibold text-gray-900">{profile?.display_name ?? user?.email}</p>
                            <p className="text-xs text-gray-400">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
                        </div>
                        <button
                            onClick={handleSignOut}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all"
                            aria-label="Sign out"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="font-display text-3xl font-bold text-gray-900">
                            My Birthday Projects
                        </h1>
                        <p className="text-gray-500 mt-1">Create and manage your birthday websites</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <button
                            id="quick-birthday-btn"
                            onClick={() => setShowQuickModal(true)}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer text-xs sm:text-sm"
                        >
                            <Sparkles className="w-4 h-4" />
                            Birthday in 1-Click
                        </button>
                        <button
                            id="quick-wedding-btn"
                            onClick={() => setShowWeddingModal(true)}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer text-xs sm:text-sm"
                        >
                            <Heart className="w-4 h-4 fill-current" />
                            Wedding in 1-Click ✨
                        </button>
                        <button
                            id="new-project-btn"
                            onClick={() => setShowNewModal(true)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 transition-all cursor-pointer text-xs sm:text-sm shadow-xs"
                        >
                            <Plus className="w-4 h-4" />
                            Customize Studio
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden animate-pulse">
                                <div className="h-32 bg-gray-200" />
                                <div className="p-5 space-y-3">
                                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                                    <div className="h-4 bg-gray-100 rounded w-1/2" />
                                    <div className="h-10 bg-gray-200 rounded-xl mt-4" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : projects.length === 0 ? (
                    <EmptyState onNew={() => setShowNewModal(true)} onQuick={() => setShowQuickModal(true)} />
                ) : (
                    <motion.div
                        layout
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        <AnimatePresence>
                            {projects.map(project => (
                                <ProjectCard key={project.id} project={project} onRefresh={fetchProjects} />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </main>

            <AnimatePresence>
                {showNewModal && (
                    <NewProjectModal
                        onClose={() => setShowNewModal(false)}
                        onCreated={fetchProjects}
                    />
                )}
                {showQuickModal && (
                    <QuickCreateModal
                        onClose={() => setShowQuickModal(false)}
                        onCreated={fetchProjects}
                    />
                )}
                {showWeddingModal && (
                    <WeddingQuickCreateModal
                        onClose={() => setShowWeddingModal(false)}
                        onCreated={fetchProjects}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}





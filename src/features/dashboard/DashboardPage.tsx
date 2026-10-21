import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
    Plus, Sparkles, Edit2, Eye, Copy, Globe, EyeOff, Trash2,
    MoreVertical, Calendar, Clock, LogOut, Brain, ChevronRight,
    Heart, Users, Wand2, Filter
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
import { BrandLogo } from '@/components/BrandLogo'

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
            className="bg-white rounded-3xl border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col justify-between"
        >
            <div>
                {/* Thumbnail / theme preview */}
                <div
                    className="h-36 relative overflow-hidden"
                    style={{ background: theme.previewGradient }}
                >
                    <div className="absolute inset-0 bg-stone-900/20 backdrop-blur-[1px]" />
                    
                    {/* Badge top-left: Project type */}
                    <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-md bg-white/90 text-stone-800 shadow-xs flex items-center gap-1.5">
                            {isWedding ? (
                                <>
                                    <span className="text-purple-600">💍</span>
                                    <span>Wedding Invite</span>
                                </>
                            ) : (
                                <>
                                    <span className="text-[#B4654F]">🎂</span>
                                    <span>Birthday Gift</span>
                                </>
                            )}
                        </span>
                    </div>

                    {/* Status badge top-right */}
                    <div className="absolute top-3 right-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md border ${
                            project.status === 'published'
                                ? 'bg-emerald-500/90 border-emerald-400 text-white'
                                : 'bg-stone-900/60 border-white/20 text-stone-200'
                        }`}>
                            {project.status === 'published' ? '● Published' : '○ Draft'}
                        </span>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center p-4">
                        <div className="text-center text-white drop-shadow-md">
                            <p className="font-serif italic text-2xl font-bold tracking-tight">
                                {project.recipient_name || project.title}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-5">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                            <h3 className="font-serif font-bold text-stone-900 text-lg truncate group-hover:text-[#B4654F] transition-colors">
                                {project.title}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-stone-500 truncate">
                                    Recipient: <strong className="font-medium text-stone-700">{project.recipient_name}</strong>
                                </span>
                            </div>
                        </div>

                        {/* Dropdown Options */}
                        <div className="relative">
                            <button
                                id={`project-menu-${project.id}`}
                                onClick={() => setMenuOpen(!menuOpen)}
                                className="p-1.5 rounded-xl hover:bg-stone-100 transition-colors text-stone-400 hover:text-stone-700"
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
                                        className="absolute right-0 top-8 z-50 bg-white border border-stone-200 rounded-2xl shadow-xl min-w-[190px] py-1.5"
                                    >
                                        {[
                                            { label: 'Edit in Studio', icon: Edit2, action: () => navigate(`/editor/${project.id}`) },
                                            { label: 'Live Guest Preview', icon: Eye, action: () => window.open(isWedding ? `/wedding/${project.slug || project.id}` : `/birthday/${project.slug || project.id}`, '_blank') },
                                            { label: 'Duplicate Project', icon: Copy, action: handleDuplicate },
                                            ...(isWedding ? [{ label: 'Guest RSVPs', icon: Users, action: () => navigate(`/rsvps/${project.id}`) }] : []),
                                            { label: project.status === 'draft' ? 'Publish Website' : 'Unpublish', icon: project.status === 'draft' ? Globe : EyeOff, action: handlePublishToggle },
                                        ].map(item => (
                                            <button
                                                key={item.label}
                                                onClick={() => { item.action(); setMenuOpen(false) }}
                                                className="w-full px-4 py-2 flex items-center gap-2.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
                                            >
                                                <item.icon className="w-4 h-4 text-stone-400" />
                                                {item.label}
                                            </button>
                                        ))}
                                        <div className="border-t border-stone-100 my-1" />
                                        <button
                                            onClick={() => { handleDelete(); setMenuOpen(false) }}
                                            className="w-full px-4 py-2 flex items-center gap-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Delete Project
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mt-3 text-xs text-stone-400">
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{timeAgo(project.updated_at)}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{theme.name}</span>
                    </div>

                    {project.slug && (
                        <p className="mt-2 text-xs text-stone-400 font-mono truncate bg-stone-50 p-1.5 rounded-lg border border-stone-100">
                            {project.project_type === 'wedding' ? '/wedding/' : '/birthday/'}{project.slug}
                        </p>
                    )}
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-5 pt-0 flex gap-2">
                <Link
                    to={`/editor/${project.id}`}
                    id={`edit-project-${project.id}`}
                    className="flex-1 py-2.5 px-4 text-xs font-bold text-center text-white bg-[#1C2230] hover:bg-[#B4654F] rounded-xl shadow-xs transition-all"
                >
                    Edit Studio
                </Link>
                {isWedding ? (
                    <Link
                        to={`/rsvps/${project.id}`}
                        className="flex items-center gap-1.5 py-2.5 px-3.5 text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-all"
                    >
                        <Users className="w-3.5 h-3.5" />
                        <span>RSVPs</span>
                    </Link>
                ) : (
                    <button
                        onClick={handlePublishToggle}
                        disabled={loading}
                        className="flex items-center gap-1.5 py-2.5 px-3.5 text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-all disabled:opacity-50"
                    >
                        {project.status === 'draft' ? <Globe className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        <span>{project.status === 'draft' ? 'Publish' : 'Unpublish'}</span>
                    </button>
                )}
            </div>
        </motion.div>
    )
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ onNew, onQuickBirthday, onQuickWedding }: { onNew: () => void; onQuickBirthday: () => void; onQuickWedding: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 px-4 bg-white rounded-3xl border border-stone-200 shadow-sm max-w-2xl mx-auto"
        >
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-[#F6EBE5] flex items-center justify-center">
                <img src="/brand/symbol.png" alt="" className="w-10 h-10 object-contain" />
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
                Your bespoke celebration awaits
            </h3>
            <p className="text-stone-500 text-sm sm:text-base mb-8 max-w-md mx-auto">
                Create a stunning personalized birthday present or cinematic wedding invitation in minutes.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                    onClick={onQuickBirthday}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-[#B4654F] hover:bg-[#964E3A] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all hover:scale-[1.02] cursor-pointer"
                >
                    <Sparkles className="w-4 h-4" />
                    Quick Birthday Gift
                </button>
                <button
                    onClick={onQuickWedding}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-[#644B78] hover:bg-[#503962] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all hover:scale-[1.02] cursor-pointer"
                >
                    <Heart className="w-4 h-4 fill-current" />
                    Cinematic Wedding Invite
                </button>
                <button
                    onClick={onNew}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    Custom Blank Studio
                </button>
            </div>
        </motion.div>
    )
}

// ─── Dashboard page ───────────────────────────────────────────────────────────
export default function DashboardPage() {
    const { user, profile, signOut } = useAuth()
    const [projects, setProjects] = useState<BirthdayExperience[]>([])
    const [loading, setLoading] = useState(true)
    const [activeFilter, setActiveFilter] = useState<'all' | 'birthday' | 'wedding'>('all')
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

    const filteredProjects = projects.filter(p => {
        if (activeFilter === 'all') return true
        const type = getProjectType(p)
        return type === activeFilter
    })

    return (
        <div className="min-h-screen bg-[#FAF8F5] text-stone-900">
            {/* Top Navigation Bar with Folded Ribbon Logo */}
            <header className="bg-white/95 backdrop-blur-md border-b border-stone-200 sticky top-0 z-40 shadow-xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
                    {/* Left: Brand & Navigation */}
                    <div className="flex items-center gap-6 min-w-0">
                        <BrandLogo size="md" layout="horizontal" theme="light" to="/dashboard" />

                        <div className="hidden lg:block w-px h-6 bg-stone-200" />

                        <nav className="hidden md:flex items-center gap-1.5">
                            <Link
                                to="/dashboard"
                                className="px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-stone-900 bg-stone-100/80 transition-all"
                            >
                                Dashboard
                            </Link>
                            <Link
                                to="/memories"
                                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-stone-500 hover:text-stone-900 hover:bg-stone-50 transition-all"
                            >
                                <Brain className="w-3.5 h-3.5 text-[#A85A44]" />
                                <span>Memory Vault</span>
                            </Link>
                        </nav>
                    </div>

                    {/* Right: User Profile & Actions */}
                    <div className="flex items-center gap-3">
                        <Link
                            to="/memories"
                            className="md:hidden p-2 rounded-xl text-stone-600 hover:bg-stone-100 border border-stone-200"
                            title="Memory Vault"
                        >
                            <Brain className="w-4 h-4 text-[#A85A44]" />
                        </Link>

                        <div className="flex items-center gap-3 bg-stone-50 border border-stone-200 rounded-2xl px-3 py-1.5">
                            <div className="w-8 h-8 rounded-full bg-[#F5E6E0] text-[#A85A44] border border-[#E8D0C5] flex items-center justify-center font-bold text-xs uppercase flex-shrink-0">
                                {(profile?.display_name || user?.email || 'A')[0]}
                            </div>
                            <div className="hidden sm:block text-left">
                                <p className="text-xs font-bold text-stone-900 leading-tight max-w-[140px] truncate">
                                    {profile?.display_name ?? user?.email}
                                </p>
                                <p className="text-[10px] uppercase tracking-wider font-semibold text-stone-400">
                                    {projects.length} keepsake{projects.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleSignOut}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-stone-500 hover:text-rose-600 hover:bg-rose-50 border border-stone-200 transition-all cursor-pointer"
                            aria-label="Sign out"
                            title="Sign out"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Sign out</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Studio View */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C2230]">
                            Celebration Keepsakes
                        </h1>
                        <p className="text-stone-500 text-sm mt-1">
                            Manage and publish your digital birthday gifts &amp; cinematic wedding invitations
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <button
                            id="quick-birthday-btn"
                            onClick={() => setShowQuickModal(true)}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#B4654F] hover:bg-[#9E533F] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer text-xs"
                        >
                            <Sparkles className="w-4 h-4" />
                            <span>1-Click Birthday</span>
                        </button>
                        <button
                            id="quick-wedding-btn"
                            onClick={() => setShowWeddingModal(true)}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#644B78] hover:bg-[#523A65] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer text-xs"
                        >
                            <Heart className="w-4 h-4 fill-current" />
                            <span>1-Click Wedding ✦</span>
                        </button>
                        <button
                            id="new-project-btn"
                            onClick={() => setShowNewModal(true)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white border border-stone-200 text-stone-800 font-semibold rounded-xl hover:bg-stone-50 transition-all cursor-pointer text-xs shadow-xs"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Blank Studio</span>
                        </button>
                    </div>
                </div>

                {/* Filter Tabs */}
                {projects.length > 0 && (
                    <div className="flex items-center gap-2 mb-6 border-b border-stone-200 pb-3">
                        <span className="text-xs uppercase tracking-wider font-bold text-stone-400 mr-2 flex items-center gap-1">
                            <Filter className="w-3.5 h-3.5" /> Filter:
                        </span>
                        {[
                            { id: 'all', label: 'All Projects', count: projects.length },
                            { id: 'birthday', label: '🎂 Birthdays', count: projects.filter(p => getProjectType(p) === 'birthday').length },
                            { id: 'wedding', label: '💍 Weddings', count: projects.filter(p => getProjectType(p) === 'wedding').length },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveFilter(tab.id as any)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                                    activeFilter === tab.id
                                        ? 'bg-[#1C2230] text-white shadow-xs'
                                        : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                                }`}
                            >
                                <span>{tab.label}</span>
                                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                                    activeFilter === tab.id ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500'
                                }`}>
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>
                )}

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden animate-pulse">
                                <div className="h-36 bg-stone-100" />
                                <div className="p-5 space-y-3">
                                    <div className="h-5 bg-stone-200 rounded w-3/4" />
                                    <div className="h-4 bg-stone-100 rounded w-1/2" />
                                    <div className="h-10 bg-stone-200 rounded-xl mt-4" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredProjects.length === 0 ? (
                    projects.length === 0 ? (
                        <EmptyState
                            onNew={() => setShowNewModal(true)}
                            onQuickBirthday={() => setShowQuickModal(true)}
                            onQuickWedding={() => setShowWeddingModal(true)}
                        />
                    ) : (
                        <div className="text-center py-16 bg-white rounded-3xl border border-stone-200">
                            <p className="text-stone-500 text-sm">No projects match the selected filter.</p>
                            <button
                                onClick={() => setActiveFilter('all')}
                                className="mt-3 text-xs font-bold text-[#B4654F] hover:underline"
                            >
                                View all projects
                            </button>
                        </div>
                    )
                ) : (
                    <motion.div
                        layout
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        <AnimatePresence>
                            {filteredProjects.map(project => (
                                <ProjectCard key={project.id} project={project} onRefresh={fetchProjects} />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </main>

            {/* Modals */}
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

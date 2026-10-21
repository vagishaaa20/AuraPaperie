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
            className="bg-white rounded-3xl border border-stone-200/90 shadow-sm hover:shadow-xl hover:border-[#E8C5BA] transition-all duration-300 overflow-hidden group flex flex-col justify-between"
        >
            <div>
                {/* Thumbnail / theme preview */}
                <div
                    className="h-36 relative overflow-hidden"
                    style={{ background: theme.previewGradient }}
                >
                    <div className="absolute inset-0 bg-stone-900/15 backdrop-blur-[1px]" />
                    
                    {/* Badge top-left: Project type */}
                    <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-md bg-white/95 text-stone-800 shadow-xs flex items-center gap-1.5">
                            {isWedding ? (
                                <>
                                    <span className="text-purple-600">💍</span>
                                    <span>Wedding Invite</span>
                                </>
                            ) : (
                                <>
                                    <span className="text-[#C25E48]">🎂</span>
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
                            <h3 className="font-serif font-bold text-[#4A251D] text-lg truncate group-hover:text-[#C25E48] transition-colors">
                                {project.title}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-stone-500 truncate">
                                    Recipient: <strong className="font-medium text-[#7A2E1F]">{project.recipient_name}</strong>
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
                                                className="w-full px-4 py-2 flex items-center gap-2.5 text-xs font-semibold text-stone-700 hover:bg-[#FAF0EB] hover:text-[#C25E48] transition-colors"
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
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-[#B85D43]" />{timeAgo(project.updated_at)}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{theme.name}</span>
                    </div>

                    {project.slug && (
                        <p className="mt-2 text-xs text-stone-500 font-mono truncate bg-[#FAF6F2] p-1.5 rounded-lg border border-[#EFE5DB]">
                            {project.project_type === 'wedding' ? '/wedding/' : '/birthday/'}{project.slug}
                        </p>
                    )}
                </div>
            </div>

            {/* Bottom Actions - Warm Vibrant Button */}
            <div className="p-5 pt-0 flex gap-2">
                <Link
                    to={`/editor/${project.id}`}
                    id={`edit-project-${project.id}`}
                    className="flex-1 py-2.5 px-4 text-xs font-bold text-center text-white bg-gradient-to-r from-[#C25E48] to-[#9E452D] hover:from-[#B85D43] hover:to-[#84382B] rounded-xl shadow-md shadow-[#C25E48]/20 transition-all hover:scale-[1.01]"
                >
                    Edit Studio
                </Link>
                {isWedding ? (
                    <Link
                        to={`/rsvps/${project.id}`}
                        className="flex items-center gap-1.5 py-2.5 px-3.5 text-xs font-bold text-[#7A2E1F] bg-[#FAF0EB] hover:bg-[#F5E2DA] border border-[#EAD5CC] rounded-xl transition-all"
                    >
                        <Users className="w-3.5 h-3.5 text-[#C25E48]" />
                        <span>RSVPs</span>
                    </Link>
                ) : (
                    <button
                        onClick={handlePublishToggle}
                        disabled={loading}
                        className="flex items-center gap-1.5 py-2.5 px-3.5 text-xs font-bold text-stone-600 bg-stone-100 hover:bg-[#FAF0EB] hover:text-[#7A2E1F] border border-stone-200 rounded-xl transition-all disabled:opacity-50"
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
            className="text-center py-20 px-4 bg-white rounded-3xl border border-[#EFE3D8] shadow-sm max-w-2xl mx-auto"
        >
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-[#FAF0EB] border border-[#E8D0C5] flex items-center justify-center">
                <BrandLogo size="xs" layout="icon-only" to="/dashboard" />
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#6D2719] mb-2">
                Your bespoke celebration awaits
            </h3>
            <p className="text-stone-500 text-sm sm:text-base mb-8 max-w-md mx-auto">
                Create a stunning personalized birthday present or cinematic wedding invitation in minutes.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                    onClick={onQuickBirthday}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#D96144] to-[#BD482B] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-[#D96144]/25 hover:scale-[1.02] transition-all cursor-pointer"
                >
                    <Sparkles className="w-4 h-4" />
                    Quick Birthday Gift
                </button>
                <button
                    onClick={onQuickWedding}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#9B51E0] to-[#7B2CBF] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-[#9B51E0]/25 hover:scale-[1.02] transition-all cursor-pointer"
                >
                    <Heart className="w-4 h-4 fill-current" />
                    Cinematic Wedding Invite
                </button>
                <button
                    onClick={onNew}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-white hover:bg-[#FAF0EB] text-[#7A2E1F] border border-[#E8D0C5] font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-xs"
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
            {/* Top Navigation Bar with Folded Ribbon Logo & Warm Styling */}
            <header className="bg-white/95 backdrop-blur-md border-b border-[#EFE3D8] sticky top-0 z-40 shadow-xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
                    {/* Left: Brand & Navigation */}
                    <div className="flex items-center gap-6 min-w-0">
                        <BrandLogo size="md" layout="horizontal" theme="warm" to="/dashboard" />

                        <div className="hidden lg:block w-px h-6 bg-[#EFE3D8]" />

                        <nav className="hidden md:flex items-center gap-2">
                            <Link
                                to="/dashboard"
                                className="px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-[#9E452D] bg-[#FBF1EC] border border-[#EACFC3] transition-all"
                            >
                                Dashboard
                            </Link>
                            <Link
                                to="/memories"
                                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-stone-500 hover:text-[#9E452D] hover:bg-[#FBF1EC] transition-all"
                            >
                                <Brain className="w-3.5 h-3.5 text-[#C25E48]" />
                                <span>Memory Vault</span>
                            </Link>
                        </nav>
                    </div>

                    {/* Right: User Profile & Actions */}
                    <div className="flex items-center gap-3">
                        <Link
                            to="/memories"
                            className="md:hidden p-2 rounded-xl text-stone-600 hover:bg-[#FBF1EC] border border-[#EFE3D8]"
                            title="Memory Vault"
                        >
                            <Brain className="w-4 h-4 text-[#C25E48]" />
                        </Link>

                        <div className="flex items-center gap-3 bg-[#FAF6F2] border border-[#EFE3D8] rounded-2xl px-3 py-1.5">
                            <div className="w-8 h-8 rounded-full bg-[#F5E2DA] text-[#9E452D] border border-[#E8C5BA] flex items-center justify-center font-bold text-xs uppercase flex-shrink-0">
                                {(profile?.display_name || user?.email || 'A')[0]}
                            </div>
                            <div className="hidden sm:block text-left">
                                <p className="text-xs font-bold text-[#4A251D] leading-tight max-w-[140px] truncate">
                                    {profile?.display_name ?? user?.email}
                                </p>
                                <p className="text-[10px] uppercase tracking-wider font-semibold text-[#B85D43]">
                                    {projects.length} keepsake{projects.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleSignOut}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-stone-500 hover:text-[#9E452D] hover:bg-[#FAF0EB] border border-[#EFE3D8] transition-all cursor-pointer"
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
                        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#6D2719] tracking-tight">
                            Celebration Keepsakes
                        </h1>
                        <p className="text-stone-500 text-sm mt-1">
                            Manage and publish your digital birthday gifts &amp; cinematic wedding invitations
                        </p>
                    </div>

                    {/* Warm Vibrant Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <button
                            id="quick-birthday-btn"
                            onClick={() => setShowQuickModal(true)}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#D96144] to-[#BD482B] hover:from-[#BD482B] hover:to-[#A33B21] text-white font-bold rounded-xl shadow-md shadow-[#D96144]/25 transition-all hover:scale-[1.02] cursor-pointer text-xs uppercase tracking-wider"
                        >
                            <Sparkles className="w-4 h-4" />
                            <span>1-Click Birthday</span>
                        </button>
                        <button
                            id="quick-wedding-btn"
                            onClick={() => setShowWeddingModal(true)}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#9B51E0] to-[#7B2CBF] hover:from-[#8B41D0] hover:to-[#6B1CAF] text-white font-bold rounded-xl shadow-md shadow-[#9B51E0]/25 transition-all hover:scale-[1.02] cursor-pointer text-xs uppercase tracking-wider"
                        >
                            <Heart className="w-4 h-4 fill-current" />
                            <span>1-Click Wedding ✦</span>
                        </button>
                        <button
                            id="new-project-btn"
                            onClick={() => setShowNewModal(true)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white border border-[#E8D0C5] text-[#7A2E1F] font-bold rounded-xl hover:bg-[#FAF0EB] transition-all cursor-pointer text-xs shadow-xs uppercase tracking-wider"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Blank Studio</span>
                        </button>
                    </div>
                </div>

                {/* Filter Tabs with Warm Accent Colors */}
                {projects.length > 0 && (
                    <div className="flex items-center gap-2 mb-6 border-b border-[#EFE3D8] pb-3">
                        <span className="text-xs uppercase tracking-wider font-bold text-[#B85D43] mr-2 flex items-center gap-1">
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
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                                    activeFilter === tab.id
                                        ? 'bg-gradient-to-r from-[#C25E48] to-[#9E452D] text-white shadow-sm'
                                        : 'bg-white text-stone-600 hover:bg-[#FAF0EB] hover:text-[#9E452D] border border-stone-200'
                                }`}
                            >
                                <span>{tab.label}</span>
                                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                                    activeFilter === tab.id ? 'bg-white/25 text-white' : 'bg-stone-100 text-stone-500'
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
                        <div className="text-center py-16 bg-white rounded-3xl border border-[#EFE3D8]">
                            <p className="text-stone-500 text-sm">No projects match the selected filter.</p>
                            <button
                                onClick={() => setActiveFilter('all')}
                                className="mt-3 text-xs font-bold text-[#C25E48] hover:underline"
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

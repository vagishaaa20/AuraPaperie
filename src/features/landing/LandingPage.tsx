import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Heart, Camera, Music, Gift, ChevronRight, Star, Play, ArrowRight } from 'lucide-react'
import { useAuth } from '@/features/auth/AuthContext'
import { themes, scrapbookThemes, cinematicThemes } from '@/lib/theme-registry'

// ─── Animated floating particle ──────────────────────────────────────────────
function Particle({ emoji, x, y, delay }: { emoji: string; x: number; y: number; delay: number }) {
    return (
        <motion.span
            className="absolute text-2xl pointer-events-none select-none"
            style={{ left: `${x}%`, top: `${y}%` }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: [0, 0.6, 0], y: [20, -20, -60] }}
            transition={{ duration: 4, delay, repeat: Infinity, repeatDelay: 2 }}
        >
            {emoji}
        </motion.span>
    )
}

// ─── Theme preview card ───────────────────────────────────────────────────────
function ThemeCard({ theme }: { theme: typeof themes[0] }) {
    return (
        <motion.div
            whileHover={{ scale: 1.04, y: -4 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="relative rounded-2xl overflow-hidden shadow-xl cursor-pointer group"
            style={{ background: theme.previewGradient }}
        >
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
            <div className="relative p-6 h-40 flex flex-col justify-between">
                <div>
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm
            ${theme.style === 'scrapbook' ? 'bg-white/30 text-white' : 'bg-black/30 text-white'}`}>
                        {theme.style === 'scrapbook' ? '📒 Scrapbook' : '🎬 Cinematic'}
                    </span>
                </div>
                <div>
                    <h3 className="font-display font-bold text-xl text-white drop-shadow">{theme.name}</h3>
                    <p className="text-white/80 text-xs mt-1 line-clamp-2 leading-snug">{theme.description}</p>
                </div>
            </div>
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-1.5">
                    <ChevronRight className="w-4 h-4 text-white" />
                </div>
            </div>
        </motion.div>
    )
}

// ─── Feature card ─────────────────────────────────────────────────────────────
function FeatureCard({ icon, title, description, color }: {
    icon: React.ReactNode
    title: string
    description: string
    color: string
}) {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-100 border border-gray-50 hover:border-gray-100 transition-all"
        >
            <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4`}>
                {icon}
            </div>
            <h3 className="font-display font-bold text-gray-900 text-lg mb-2">{title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
        </motion.div>
    )
}

// ─── Scrapbook mini-preview ───────────────────────────────────────────────────
function ScrapbookPreview() {
    const photos = ['🌸', '🎂', '🎉', '💕']
    return (
        <div className="relative w-full h-64 bg-rose-50 rounded-2xl overflow-hidden p-4">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(244,114,182,0.1)_0%,transparent_60%)]" />
            {photos.map((emoji, i) => (
                <motion.div
                    key={i}
                    className="absolute bg-white p-2 pb-6 shadow-polaroid"
                    style={{
                        left: `${10 + i * 22}%`,
                        top: `${20 + (i % 2) * 20}%`,
                        rotate: `${-8 + i * 5}deg`,
                    }}
                    initial={{ opacity: 0, y: 20, rotate: (-8 + i * 5) }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15, duration: 0.5 }}
                >
                    <div className="w-14 h-14 bg-gradient-to-br from-rose-100 to-pink-200 flex items-center justify-center text-3xl rounded">
                        {emoji}
                    </div>
                    <p className="text-center mt-1 font-handwriting text-xs text-gray-500">memory</p>
                </motion.div>
            ))}
            <div className="absolute bottom-3 right-3">
                <span className="font-handwriting text-rose-400 text-lg rotate-[-5deg] block">our story ✨</span>
            </div>
        </div>
    )
}

// ─── Cinematic mini-preview ───────────────────────────────────────────────────
function CinematicPreview() {
    return (
        <div className="relative w-full h-64 bg-slate-900 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.2)_0%,transparent_70%)]" />
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 70}%` }}
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
                />
            ))}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-indigo-300 text-xs uppercase tracking-[0.2em] mb-3"
                >
                    A message for you
                </motion.p>
                <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="font-serif text-white text-2xl font-light leading-snug"
                >
                    Happy Birthday,<br />
                    <span className="italic text-indigo-300">Riya ✨</span>
                </motion.h3>
            </div>
        </div>
    )
}

// ─── Step card for How it Works ───────────────────────────────────────────────
function StepCard({ num, title, description }: { num: string; title: string; description: string }) {
    return (
        <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                {num}
            </div>
            <div>
                <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
            </div>
        </div>
    )
}

// ─── Main Landing Page ────────────────────────────────────────────────────────
export default function LandingPage() {
    const { user } = useAuth()
    const [activeStyle, setActiveStyle] = useState<'scrapbook' | 'cinematic'>('scrapbook')

    const particles = [
        { emoji: '✨', x: 5, y: 20, delay: 0 },
        { emoji: '💕', x: 15, y: 60, delay: 0.8 },
        { emoji: '🎀', x: 85, y: 15, delay: 0.4 },
        { emoji: '🌸', x: 90, y: 55, delay: 1.2 },
        { emoji: '⭐', x: 50, y: 5, delay: 0.6 },
        { emoji: '🎂', x: 75, y: 80, delay: 1.4 },
        { emoji: '🎉', x: 25, y: 85, delay: 1.0 },
    ]

    return (
        <div className="min-h-screen bg-white overflow-hidden">
            {/* ─── Navbar ─────────────────────────────────────────────────────── */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-400 to-pink-600 flex items-center justify-center shadow-glow-pink group-hover:scale-105 transition-transform">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-display font-bold text-xl text-gray-900">B'Day <span className="text-rose-500 font-normal">Made With Love</span></span>
                    </Link>

                    <div className="hidden md:flex items-center gap-6">
                        <a href="#themes" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Themes</a>
                        <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">How it works</a>
                        <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Features</a>
                    </div>

                    <div className="flex items-center gap-3">
                        {user ? (
                            <Link
                                to="/dashboard"
                                className="px-5 py-2.5 bg-gradient-to-r from-rose-500 to-pink-600 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-rose-200 transition-all hover:scale-[1.02]"
                            >
                                My Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link to="/auth/signin" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-4 py-2">
                                    Sign in
                                </Link>
                                <Link
                                    to="/auth/signup"
                                    className="px-5 py-2.5 bg-gradient-to-r from-rose-500 to-pink-600 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-rose-200 transition-all hover:scale-[1.02]"
                                >
                                    Get started free
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* ─── Hero ────────────────────────────────────────────────────────── */}
            <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-white to-purple-50" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-20%,rgba(244,114,182,0.15)_0%,transparent_100%)]" />

                {/* Floating particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {particles.map((p, i) => <Particle key={i} {...p} />)}
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 border border-rose-200 rounded-full text-rose-600 text-sm font-medium mb-8">
                            <Star className="w-4 h-4 fill-rose-400 text-rose-400" />
                            Create magical birthday experiences
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-gray-900 leading-[1.1] max-w-4xl mb-8"
                    >
                        Turn your memories into a{' '}
                        <span className="gradient-text-rose">magical birthday website</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl text-gray-500 max-w-2xl mb-10 leading-relaxed"
                    >
                        Choose a beautiful theme, add your photos, memories, inside jokes and a heartfelt letter — then share a link that feels like a digital gift.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center gap-4"
                    >
                        <Link
                            to={user ? '/dashboard' : '/auth/signup'}
                            id="hero-cta"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold text-lg rounded-2xl shadow-xl shadow-rose-200 hover:shadow-rose-300 transition-all hover:scale-[1.03] active:scale-[0.98]"
                        >
                            <Gift className="w-5 h-5" />
                            Create a Birthday Website
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <a
                            href="#themes"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-700 font-semibold text-lg rounded-2xl border border-gray-200 shadow-md hover:shadow-lg transition-all hover:scale-[1.01]"
                        >
                            <Play className="w-5 h-5 text-rose-400" />
                            Explore themes
                        </a>
                    </motion.div>

                    {/* Hero preview */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="mt-20 w-full max-w-4xl"
                    >
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
                            <div className="flex items-center gap-2 bg-gray-50 px-4 py-3 border-b border-gray-200">
                                <div className="flex gap-1.5">
                                    {['bg-red-400', 'bg-yellow-400', 'bg-green-400'].map((c, i) => (
                                        <div key={i} className={`w-3 h-3 rounded-full ${c}`} />
                                    ))}
                                </div>
                                <div className="flex-1 bg-white rounded-md px-3 py-1 text-center text-xs text-gray-400 font-mono">
                                    bday.love/birthday/riya-special-day
                                </div>
                            </div>
                            {/* Mini birthday experience preview */}
                            <div className="bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 h-80 flex items-center justify-center px-8 relative overflow-hidden">
                                <div className="absolute inset-0">
                                    {['✨', '💕', '🌸', '⭐', '🎀'].map((e, i) => (
                                        <span key={i} className="absolute text-xl animate-float opacity-40" style={{
                                            left: `${10 + i * 18}%`, top: `${15 + (i % 3) * 20}%`, animationDelay: `${i * 0.8}s`
                                        }}>{e}</span>
                                    ))}
                                </div>
                                <div className="text-center relative z-10">
                                    <div className="inline-block bg-white p-3 pb-8 shadow-polaroid rotate-[-2deg] mb-6">
                                        <div className="w-24 h-24 bg-gradient-to-br from-rose-200 to-pink-300 rounded flex items-center justify-center text-5xl">
                                            🥳
                                        </div>
                                    </div>
                                    <div>
                                        <p className="font-handwriting text-rose-400 text-lg">Happy Birthday,</p>
                                        <h2 className="font-serif text-4xl font-bold text-gray-900">Riya ✨</h2>
                                        <p className="text-gray-500 text-sm mt-2">Made with love, just for you</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ─── Style showcase ──────────────────────────────────────────────── */}
            <section id="features" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="font-display text-4xl font-bold text-gray-900 mb-4">
                            Two distinct styles — one magical experience
                        </h2>
                        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                            Choose a warm and playful scrapbook, or an immersive cinematic experience. Both feel personal and beautiful.
                        </p>
                    </div>

                    <div className="flex justify-center mb-10">
                        <div className="inline-flex bg-gray-100 rounded-xl p-1">
                            {(['scrapbook', 'cinematic'] as const).map(style => (
                                <button
                                    key={style}
                                    onClick={() => setActiveStyle(style)}
                                    className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeStyle === style
                                            ? 'bg-white text-gray-900 shadow-md'
                                            : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {style === 'scrapbook' ? '📒 Scrapbook' : '🎬 Cinematic'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <AnimatePresence mode="wait">
                                {activeStyle === 'scrapbook' ? (
                                    <motion.div key="scrapbook" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                                        <ScrapbookPreview />
                                    </motion.div>
                                ) : (
                                    <motion.div key="cinematic" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                                        <CinematicPreview />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        <div className="space-y-6">
                            {activeStyle === 'scrapbook' ? (
                                <>
                                    <h3 className="font-display text-3xl font-bold text-gray-900">Cute. Personal. Handmade.</h3>
                                    <p className="text-gray-500 leading-relaxed">Polaroid photos, paper tape, handwritten captions, floating sparkles, and Polaroid layouts. Every scrapbook theme feels like a gift someone crafted themselves.</p>
                                    {['Polaroid photo frames with captions', 'Paper tape and sticker decorations', 'Handwriting fonts and doodles', 'Floating sparkle animations', 'Pastel color palettes'].map(f => (
                                        <div key={f} className="flex items-center gap-3 text-sm text-gray-600">
                                            <div className="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
                                                <Heart className="w-3 h-3 text-rose-500" />
                                            </div>
                                            {f}
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <>
                                    <h3 className="font-display text-3xl font-bold text-gray-900">Immersive. Emotional. Atmospheric.</h3>
                                    <p className="text-gray-500 leading-relaxed">Dramatic reveals, particle effects, editorial typography, and rich dark backgrounds. Your memories become a cinematic experience.</p>
                                    {['Cinematic text and image reveals', 'Atmospheric particle effects', 'Rich dark color palettes', 'Smooth, emotional transitions', 'Editorial-quality layouts'].map(f => (
                                        <div key={f} className="flex items-center gap-3 text-sm text-gray-600">
                                            <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                                <Star className="w-3 h-3 text-indigo-500" />
                                            </div>
                                            {f}
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Feature grid ────────────────────────────────────────────────── */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="font-display text-4xl font-bold text-gray-900 mb-4">
                            Everything you need to create something special
                        </h2>
                        <p className="text-gray-500 text-lg max-w-xl mx-auto">
                            No design skills needed. Just your love, your memories, and a few minutes.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FeatureCard
                            icon={<Camera className="w-6 h-6 text-rose-600" />}
                            title="Memory Library"
                            description="Upload photos, videos, and audio. Reuse your memories across multiple birthday projects without uploading again."
                            color="bg-rose-50"
                        />
                        <FeatureCard
                            icon={<Gift className="w-6 h-6 text-purple-600" />}
                            title="Surprise Opening"
                            description="Gift box, sealed letter, polaroid reveal — 7 ways to make the recipient gasp before they see the full experience."
                            color="bg-purple-50"
                        />
                        <FeatureCard
                            icon={<Heart className="w-6 h-6 text-pink-600" />}
                            title="10 Beautiful Themes"
                            description="From blush scrapbooks to midnight constellations. Switch themes anytime without losing any content."
                            color="bg-pink-50"
                        />
                        <FeatureCard
                            icon={<Music className="w-6 h-6 text-amber-600" />}
                            title="Music & Memories"
                            description="Add a favourite song, voice message, or playlist link. Audio plays on user interaction, respecting browser policies."
                            color="bg-amber-50"
                        />
                        <FeatureCard
                            icon={<Sparkles className="w-6 h-6 text-indigo-600" />}
                            title="Interactive Birthday Cake"
                            description="An animated cake with real candles! Tap or click to blow them out and trigger a confetti celebration."
                            color="bg-indigo-50"
                        />
                        <FeatureCard
                            icon={<Star className="w-6 h-6 text-green-600" />}
                            title="Share Instantly"
                            description="Publish to a shareable link like /birthday/your-name. Anyone with the link can view it — no account needed."
                            color="bg-green-50"
                        />
                    </div>
                </div>
            </section>

            {/* ─── Themes gallery ──────────────────────────────────────────────── */}
            <section id="themes" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="font-display text-4xl font-bold text-gray-900 mb-4">
                            10 themes. One for every story.
                        </h2>
                        <p className="text-gray-500 text-lg max-w-xl mx-auto">
                            Each theme has its own personality — palette, typography, photo frames, and animations.
                        </p>
                    </div>

                    <div className="mb-8">
                        <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-4">📒 Scrapbook Themes</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                            {scrapbookThemes.map(theme => <ThemeCard key={theme.id} theme={theme} />)}
                        </div>
                    </div>

                    <div>
                        <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-4">🎬 Cinematic Themes</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {cinematicThemes.map(theme => <ThemeCard key={theme.id} theme={theme} />)}
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── How it Works ────────────────────────────────────────────────── */}
            <section id="how-it-works" className="py-24 bg-rose-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="font-display text-4xl font-bold text-gray-900 mb-4">
                            Create one in under 10 minutes
                        </h2>
                        <p className="text-gray-500 text-lg">
                            No design experience needed. Just fill in the blanks and publish.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-10">
                        <div className="space-y-8">
                            <StepCard num="1" title="Pick a theme" description="Choose from 6 scrapbook or 4 cinematic themes. You can change it anytime without losing your content." />
                            <StepCard num="2" title="Add your memories" description="Upload photos, write a letter, add inside jokes, create a timeline of your shared story." />
                            <StepCard num="3" title="Choose an opening surprise" description="Pick how your person will discover the experience — a gift box, sealed envelope, or polaroid reveal." />
                            <StepCard num="4" title="Publish and share" description="Get a beautiful shareable URL. Send it in a message or add it to a card." />
                        </div>
                        <div className="flex items-center">
                            <div className="w-full bg-white rounded-2xl shadow-xl p-6 space-y-4">
                                <div className="flex items-center gap-3 text-sm text-gray-700">
                                    <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-base">🎂</div>
                                    <div>
                                        <p className="font-semibold">Riya's Special Day</p>
                                        <p className="text-gray-400 text-xs">Pink Scrapbook · Published</p>
                                    </div>
                                    <span className="ml-auto px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">Live</span>
                                </div>
                                <div className="border-t pt-4 space-y-2">
                                    {['Surprise Intro', 'Birthday Hero', 'Memory Scrapbook', 'Our Story', 'Birthday Cake', 'Birthday Letter'].map((s, i) => (
                                        <div key={s} className="flex items-center gap-2 text-sm text-gray-600">
                                            <div className="w-2 h-2 rounded-full bg-rose-300" />
                                            {s}
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t pt-4 flex items-center justify-between text-xs text-gray-400">
                                    <span>bday.love/birthday/riya-special-day</span>
                                    <span className="text-rose-400 font-medium">Copy link →</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── CTA ─────────────────────────────────────────────────────────── */}
            <section className="py-24 bg-gradient-to-br from-rose-500 via-pink-500 to-purple-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {['🎂', '🎉', '✨', '💕', '🎀', '⭐'].map((e, i) => (
                        <span key={i} className="absolute text-3xl opacity-20 animate-float" style={{
                            left: `${5 + i * 16}%`, top: `${20 + (i % 2) * 40}%`, animationDelay: `${i * 0.6}s`
                        }}>{e}</span>
                    ))}
                </div>
                <div className="relative max-w-3xl mx-auto text-center px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-6">
                            Make this birthday unforgettable
                        </h2>
                        <p className="text-rose-100 text-lg mb-10">
                            It takes just minutes. The joy it creates lasts forever.
                        </p>
                        <Link
                            to={user ? '/dashboard' : '/auth/signup'}
                            id="footer-cta"
                            className="inline-flex items-center gap-2 px-10 py-4 bg-white text-rose-600 font-bold text-lg rounded-2xl shadow-2xl hover:shadow-white/20 transition-all hover:scale-[1.03]"
                        >
                            <Gift className="w-5 h-5" />
                            Start creating — it's free
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* ─── Footer ──────────────────────────────────────────────────────── */}
            <footer className="bg-gray-900 text-gray-400 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-400 to-pink-600 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-display font-bold text-white">B'Day Made With Love</span>
                    </div>
                    <p className="text-sm text-gray-500">
                        Made with 💕 for birthdays, always.
                    </p>
                    <div className="flex items-center gap-6 text-sm">
                        <Link to="/auth/signup" className="hover:text-white transition-colors">Sign up</Link>
                        <Link to="/auth/signin" className="hover:text-white transition-colors">Sign in</Link>
                    </div>
                </div>
            </footer>
        </div>
    )
}

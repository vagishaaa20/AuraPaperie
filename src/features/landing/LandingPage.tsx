import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Heart, Camera, Music, Gift, ChevronRight, Star, Play, ArrowRight, Calendar, Users, Volume2 } from 'lucide-react'
import { useAuth } from '@/features/auth/AuthContext'
import { themes, scrapbookThemes, cinematicThemes } from '@/lib/theme-registry'
import { BrandLogo } from '@/components/BrandLogo'

// ─── Floating decorative element ──────────────────────────────────────────────
function Particle({ emoji, x, y, delay }: { emoji: string; x: number; y: number; delay: number }) {
    return (
        <motion.span
            className="absolute text-2xl pointer-events-none select-none"
            style={{ left: `${x}%`, top: `${y}%` }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: [0, 0.6, 0], y: [20, -20, -60] }}
            transition={{ duration: 4.5, delay, repeat: Infinity, repeatDelay: 2 }}
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
            className="relative rounded-3xl overflow-hidden shadow-lg cursor-pointer group border border-stone-200/40"
            style={{ background: theme.previewGradient }}
        >
            <div className="absolute inset-0 bg-stone-900/20 group-hover:bg-stone-900/10 transition-colors" />
            <div className="relative p-6 h-44 flex flex-col justify-between">
                <div>
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider backdrop-blur-md
                        ${theme.style === 'scrapbook' ? 'bg-white/30 text-white' : 'bg-black/40 text-stone-100'}`}>
                        {theme.style === 'scrapbook' ? '📒 Scrapbook' : '🎬 Cinematic'}
                    </span>
                </div>
                <div>
                    <h3 className="font-serif font-bold text-xl text-white drop-shadow-md">{theme.name}</h3>
                    <p className="text-white/85 text-xs mt-1 line-clamp-2 leading-relaxed">{theme.description}</p>
                </div>
            </div>
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-white/30 backdrop-blur-md rounded-full p-1.5">
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
            className="bg-white rounded-3xl p-7 shadow-sm border border-stone-200/70 hover:shadow-xl hover:border-stone-300 transition-all flex flex-col justify-between"
        >
            <div>
                <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center mb-5`}>
                    {icon}
                </div>
                <h3 className="font-serif font-bold text-stone-900 text-lg mb-2">{title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{description}</p>
            </div>
        </motion.div>
    )
}

// ─── Scrapbook mini-preview ───────────────────────────────────────────────────
function ScrapbookPreview() {
    const photos = ['🌸', '🎂', '🎉', '💕']
    return (
        <div className="relative w-full h-72 bg-[#FBF6F0] rounded-3xl overflow-hidden p-6 border border-[#EAE2D5] shadow-inner">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(174,104,80,0.08)_0%,transparent_60%)]" />
            {photos.map((emoji, i) => (
                <motion.div
                    key={i}
                    className="absolute bg-white p-2.5 pb-7 shadow-xl rounded-sm border border-stone-100"
                    style={{
                        left: `${10 + i * 21}%`,
                        top: `${18 + (i % 2) * 18}%`,
                        rotate: `${-8 + i * 5}deg`,
                    }}
                    initial={{ opacity: 0, y: 20, rotate: (-8 + i * 5) }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15, duration: 0.5 }}
                >
                    <div className="w-16 h-16 bg-gradient-to-br from-[#F5E6E0] to-[#EBD2C8] flex items-center justify-center text-3xl rounded">
                        {emoji}
                    </div>
                    <p className="text-center mt-1.5 font-handwriting text-xs text-stone-400">cherished memory</p>
                </motion.div>
            ))}
            <div className="absolute bottom-4 right-5">
                <span className="font-serif italic text-[#B4654F] text-lg rotate-[-4deg] block font-bold">our story ✨</span>
            </div>
        </div>
    )
}

// ─── Wedding & Cinematic mini-preview ─────────────────────────────────────────
function WeddingCinematicPreview() {
    return (
        <div className="relative w-full h-72 bg-[#1C2230] rounded-3xl overflow-hidden p-6 border border-stone-800 shadow-2xl flex flex-col items-center justify-center text-center">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.15)_0%,transparent_75%)]" />
            
            {/* Wax seal symbol */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-0.5 shadow-xl mb-3 flex items-center justify-center"
            >
                <div className="w-full h-full rounded-full bg-[#1C2230] flex items-center justify-center text-amber-300 font-serif font-bold text-lg border border-amber-300/40">
                    💍
                </div>
            </motion.div>

            <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-amber-200/90 text-[10px] uppercase tracking-[0.25em] font-medium mb-1"
            >
                Royal Wedding Invitation
            </motion.p>
            <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-serif text-white text-3xl font-light leading-snug tracking-tight"
            >
                Yash &amp; Laxmi
            </motion.h3>
            <p className="text-stone-400 text-xs mt-2 font-light">
                Sound-Enabled ✦ Wax-Seal Unfold ✦ Interactive RSVP
            </p>
            <div className="mt-4 flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/15 text-[11px] text-amber-100">
                <Volume2 className="w-3.5 h-3.5 text-amber-300" />
                <span>Plays Shehnai &amp; Piano Melody</span>
            </div>
        </div>
    )
}

// ─── Step card for How it Works ───────────────────────────────────────────────
function StepCard({ num, title, description }: { num: string; title: string; description: string }) {
    return (
        <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-[#1C2230] text-white flex items-center justify-center font-serif font-bold text-sm shadow-md">
                {num}
            </div>
            <div>
                <h4 className="font-serif font-bold text-stone-900 text-base mb-1">{title}</h4>
                <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">{description}</p>
            </div>
        </div>
    )
}

// ─── Main Landing Page ────────────────────────────────────────────────────────
export default function LandingPage() {
    const { user } = useAuth()
    const [activeStyle, setActiveStyle] = useState<'scrapbook' | 'wedding'>('wedding')

    const particles = [
        { emoji: '✨', x: 8, y: 22, delay: 0 },
        { emoji: '💌', x: 18, y: 65, delay: 0.8 },
        { emoji: '🌸', x: 86, y: 18, delay: 0.4 },
        { emoji: '💍', x: 90, y: 62, delay: 1.2 },
        { emoji: '⭐', x: 50, y: 8, delay: 0.6 },
        { emoji: '🎂', x: 78, y: 82, delay: 1.4 },
        { emoji: '🌿', x: 28, y: 88, delay: 1.0 },
    ]

    return (
        <div className="min-h-screen bg-[#FAF8F5] text-stone-900 overflow-hidden font-sans">
            {/* ─── Navbar ─────────────────────────────────────────────────────── */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
                    <BrandLogo size="md" layout="horizontal" to="/" />

                    <div className="hidden md:flex items-center gap-7">
                        <a href="#themes" className="text-xs uppercase tracking-widest font-bold text-stone-600 hover:text-[#B4654F] transition-colors">Themes</a>
                        <a href="#features" className="text-xs uppercase tracking-widest font-bold text-stone-600 hover:text-[#B4654F] transition-colors">Features</a>
                        <a href="#how-it-works" className="text-xs uppercase tracking-widest font-bold text-stone-600 hover:text-[#B4654F] transition-colors">How It Works</a>
                    </div>

                    <div className="flex items-center gap-3">
                        {user ? (
                            <Link
                                to="/dashboard"
                                className="px-5 py-2.5 bg-[#1C2230] hover:bg-[#B4654F] text-white text-xs uppercase tracking-wider font-bold rounded-xl shadow-md transition-all hover:scale-[1.02]"
                            >
                                My Studio
                            </Link>
                        ) : (
                            <>
                                <Link to="/auth/signin" className="text-xs uppercase tracking-wider font-bold text-stone-600 hover:text-stone-900 transition-colors px-3 py-2">
                                    Sign in
                                </Link>
                                <Link
                                    to="/auth/signup"
                                    className="px-5 py-2.5 bg-[#B4654F] hover:bg-[#964E3A] text-white text-xs uppercase tracking-wider font-bold rounded-xl shadow-md hover:shadow-stone-300 transition-all hover:scale-[1.02]"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* ─── Hero Section ─────────────────────────────────────────────────── */}
            <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16 overflow-hidden">
                {/* Paper texture and subtle ambient backdrop */}
                <div className="absolute inset-0 bg-[#FAF8F5] bg-[radial-gradient(#E8DFC8_1px,transparent_1px)] [background-size:24px_24px]" />
                <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#E5B899]/25 blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#A3B899]/20 blur-3xl" />

                {/* Floating particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {particles.map((p, i) => <Particle key={i} {...p} />)}
                </div>

                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center text-center z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#F4EDE2] border border-[#E3D4C1] rounded-full text-[#B4654F] text-xs font-bold uppercase tracking-widest mb-8 shadow-xs">
                            <Sparkles className="w-3.5 h-3.5 text-[#B4654F]" />
                            Bespoke Digital Celebrations &amp; Invites
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold text-[#1C2230] leading-[1.1] max-w-4xl mb-6 tracking-tight"
                    >
                        Craft heartfelt wishes &amp;{' '}
                        <span className="text-[#B4654F] italic">cinematic invitations</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-base sm:text-xl text-stone-600 max-w-2xl mb-10 leading-relaxed font-normal"
                    >
                        AuraPaperie transforms milestones into interactive digital keepsakes. Design enchanting birthday websites with candle blowouts or royal wedding invitations with wax seals, music, and RSVP tracking.
                    </motion.p>

                    {/* Dual Action CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center gap-4"
                    >
                        <Link
                            to={user ? '/dashboard' : '/auth/signup'}
                            id="hero-birthday-cta"
                            className="inline-flex items-center gap-2 px-7 py-4 bg-[#B4654F] hover:bg-[#9A503C] text-white font-bold text-sm uppercase tracking-wider rounded-2xl shadow-xl shadow-[#AE6850]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <Gift className="w-4 h-4" />
                            <span>Create a Birthday Gift</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link
                            to={user ? '/dashboard' : '/auth/signup'}
                            id="hero-wedding-cta"
                            className="inline-flex items-center gap-2 px-7 py-4 bg-[#1C2230] hover:bg-[#2C344A] text-white font-bold text-sm uppercase tracking-wider rounded-2xl shadow-xl shadow-stone-800/15 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <Heart className="w-4 h-4 text-rose-300 fill-current" />
                            <span>Design Wedding Invite ✦</span>
                        </Link>
                    </motion.div>

                    {/* Hero Preview Browser Frame */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="mt-16 w-full max-w-4xl"
                    >
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-stone-200 bg-white">
                            <div className="flex items-center gap-2 bg-[#F7F3EC] px-5 py-3.5 border-b border-stone-200">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-[#E58872]" />
                                    <div className="w-3 h-3 rounded-full bg-[#E5BE72]" />
                                    <div className="w-3 h-3 rounded-full bg-[#72B488]" />
                                </div>
                                <div className="flex-1 bg-white rounded-lg px-4 py-1 text-center text-xs text-stone-500 font-mono border border-stone-200/60 max-w-md mx-auto">
                                    aurapaperie.com/celebrate/riya-special-day
                                </div>
                            </div>

                            {/* Mini Experience Mockup */}
                            <div className="bg-gradient-to-br from-[#FAF7F2] via-[#F4EDE4] to-[#ECE3D6] h-88 flex items-center justify-center px-8 relative overflow-hidden">
                                <div className="absolute inset-0">
                                    {['✨', '🌸', '💍', '💌', '⭐'].map((e, i) => (
                                        <span key={i} className="absolute text-xl animate-float opacity-30 select-none" style={{
                                            left: `${12 + i * 20}%`, top: `${15 + (i % 3) * 22}%`, animationDelay: `${i * 0.9}s`
                                        }}>{e}</span>
                                    ))}
                                </div>
                                <div className="text-center relative z-10 max-w-md">
                                    <div className="inline-block bg-white p-3.5 pb-8 shadow-2xl rotate-[-2deg] mb-4 rounded-sm border border-stone-100">
                                        <div className="w-28 h-28 bg-[#F6EDE6] rounded flex items-center justify-center text-5xl">
                                            💌
                                        </div>
                                    </div>
                                    <p className="font-serif italic text-[#B4654F] text-lg font-bold">Personalized Wishes &amp; Invites</p>
                                    <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mt-1">Made With Love</h2>
                                    <p className="text-stone-500 text-xs mt-1.5">Interactive wax seals, photo scrapbooks, music, and celebration cakes</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ─── Showcase: Two Bespoke Celebration Formats ────────────────────── */}
            <section id="features" className="py-24 bg-white border-y border-stone-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-xs uppercase tracking-widest font-bold text-[#B4654F] mb-2 block">Versatile Formats</span>
                        <h2 className="font-serif text-4xl sm:text-5xl font-bold text-stone-900 mb-4">
                            Two distinct celebration experiences
                        </h2>
                        <p className="text-stone-500 text-base sm:text-lg max-w-2xl mx-auto">
                            Switch between playful handmade birthday scrapbooks and sound-enabled royal wedding invitations. Both crafted to leave loved ones speechless.
                        </p>
                    </div>

                    <div className="flex justify-center mb-12">
                        <div className="inline-flex bg-stone-100 p-1.5 rounded-2xl border border-stone-200">
                            <button
                                onClick={() => setActiveStyle('wedding')}
                                className={`px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold transition-all ${
                                    activeStyle === 'wedding'
                                        ? 'bg-[#1C2230] text-white shadow-md'
                                        : 'text-stone-600 hover:text-stone-900'
                                }`}
                            >
                                💍 Cinematic Wedding Invite
                            </button>
                            <button
                                onClick={() => setActiveStyle('scrapbook')}
                                className={`px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold transition-all ${
                                    activeStyle === 'scrapbook'
                                        ? 'bg-[#B4654F] text-white shadow-md'
                                        : 'text-stone-600 hover:text-stone-900'
                                }`}
                            >
                                🎂 Birthday Scrapbook Gift
                            </button>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <AnimatePresence mode="wait">
                                {activeStyle === 'wedding' ? (
                                    <motion.div key="wedding" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                                        <WeddingCinematicPreview />
                                    </motion.div>
                                ) : (
                                    <motion.div key="scrapbook" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                                        <ScrapbookPreview />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        <div className="space-y-6">
                            {activeStyle === 'wedding' ? (
                                <>
                                    <h3 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 leading-tight">
                                        Royal. Sound-Enabled. Cinematic.
                                    </h3>
                                    <p className="text-stone-600 leading-relaxed text-sm sm:text-base">
                                        Inspired by timeless wedding stationery, guests unlock a royal gatefold envelope with an interactive wax seal, accompanied by synthesized flourishes and background raags or piano melodies.
                                    </p>
                                    <div className="space-y-3 pt-2">
                                        {[
                                            'Royal wax-seal envelope unfold with Web Audio SFX',
                                            'Guided Cinematic Auto-Play and manual scroll modes',
                                            'Multi-event itinerary with Google Maps & Calendar (.ics) export',
                                            'Interactive RSVP collection with celebratory confetti',
                                            'Atmospheric petals (Roses, Marigolds, Olive Leaves)',
                                        ].map(f => (
                                            <div key={f} className="flex items-center gap-3 text-xs sm:text-sm text-stone-700 font-medium">
                                                <div className="w-5 h-5 rounded-full bg-stone-900 text-white flex items-center justify-center flex-shrink-0 text-[10px]">
                                                    ✦
                                                </div>
                                                {f}
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h3 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 leading-tight">
                                        Playful. Heartfelt. Handmade.
                                    </h3>
                                    <p className="text-stone-600 leading-relaxed text-sm sm:text-base">
                                        Polaroid photo layouts, paper tape, handwritten letters, floating sparkles, and interactive cakes with candles you can actually blow out.
                                    </p>
                                    <div className="space-y-3 pt-2">
                                        {[
                                            'Polaroid photo frames with custom washi tape',
                                            'Interactive Birthday Cake with blowout candles & confetti',
                                            'Secret letters with seal reveal',
                                            'Cinematic memory reels and music player',
                                            '1-Click Auto-Generate in under 60 seconds',
                                        ].map(f => (
                                            <div key={f} className="flex items-center gap-3 text-xs sm:text-sm text-stone-700 font-medium">
                                                <div className="w-5 h-5 rounded-full bg-[#B4654F] text-white flex items-center justify-center flex-shrink-0 text-[10px]">
                                                    ♥
                                                </div>
                                                {f}
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Feature Grid ─────────────────────────────────────────────────── */}
            <section className="py-24 bg-[#FAF8F5]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-xs uppercase tracking-widest font-bold text-[#B4654F] mb-2 block">Studio Capabilities</span>
                        <h2 className="font-serif text-4xl sm:text-5xl font-bold text-stone-900 mb-4">
                            Everything for unforgettable celebrations
                        </h2>
                        <p className="text-stone-500 text-base sm:text-lg max-w-xl mx-auto">
                            No coding or design experience required. Just your photos, words, and 60 seconds.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FeatureCard
                            icon={<Camera className="w-6 h-6 text-[#B4654F]" />}
                            title="Memory Vault"
                            description="Upload high-res photos, videos, and love notes. Reuse assets across multiple presents and invites seamlessly."
                            color="bg-[#F5E6E0]"
                        />
                        <FeatureCard
                            icon={<Music className="w-6 h-6 text-indigo-600" />}
                            title="Sound Design & Music"
                            description="Synthesized wax-seal sounds, celebratory chimes, and curated royalty-free Shehnai, Canon in D, and gentle piano tracks."
                            color="bg-indigo-50"
                        />
                        <FeatureCard
                            icon={<Heart className="w-6 h-6 text-rose-600" />}
                            title="10 Designer Themes"
                            description="From Lavender & Rose Gold to Midnight Navy & Emerald Forest. Switch anytime without losing project contents."
                            color="bg-rose-50"
                        />
                        <FeatureCard
                            icon={<Calendar className="w-6 h-6 text-emerald-600" />}
                            title="Calendar & Directions"
                            description="Guests can add ceremonies directly to Google Calendar, Apple Calendar, or Outlook with one tap, plus Google Maps navigation."
                            color="bg-emerald-50"
                        />
                        <FeatureCard
                            icon={<Users className="w-6 h-6 text-purple-600" />}
                            title="Guest RSVP Dashboard"
                            description="Collect attendance, dietary restrictions, and well wishes with live stats and instant CSV export for event planning."
                            color="bg-purple-50"
                        />
                        <FeatureCard
                            icon={<Sparkles className="w-6 h-6 text-amber-600" />}
                            title="1-Click Quick Generation"
                            description="Need it in a hurry? Pre-fill intelligent themes, touching wishes, and animations in under 60 seconds with Quick Create."
                            color="bg-amber-50"
                        />
                    </div>
                </div>
            </section>

            {/* ─── Themes Gallery ──────────────────────────────────────────────── */}
            <section id="themes" className="py-24 bg-white border-y border-stone-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-xs uppercase tracking-widest font-bold text-[#B4654F] mb-2 block">Aesthetic Variety</span>
                        <h2 className="font-serif text-4xl sm:text-5xl font-bold text-stone-900 mb-4">
                            10 handcrafted themes
                        </h2>
                        <p className="text-stone-500 text-base sm:text-lg max-w-xl mx-auto">
                            Every theme carries its own distinct typography, palette, photo borders, and atmospheric animations.
                        </p>
                    </div>

                    <div className="mb-10">
                        <p className="text-xs uppercase tracking-widest text-stone-400 font-bold mb-4">📒 Scrapbook Palettes</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                            {scrapbookThemes.map(theme => <ThemeCard key={theme.id} theme={theme} />)}
                        </div>
                    </div>

                    <div>
                        <p className="text-xs uppercase tracking-widest text-stone-400 font-bold mb-4">🎬 Cinematic &amp; Royal Palettes</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {cinematicThemes.map(theme => <ThemeCard key={theme.id} theme={theme} />)}
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── How it Works ────────────────────────────────────────────────── */}
            <section id="how-it-works" className="py-24 bg-[#FAF8F5]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-xs uppercase tracking-widest font-bold text-[#B4654F] mb-2 block">Simple Workflow</span>
                        <h2 className="font-serif text-4xl sm:text-5xl font-bold text-stone-900 mb-4">
                            Ready to share in minutes
                        </h2>
                        <p className="text-stone-500 text-base sm:text-lg">
                            Design a bespoke digital keepsake from your laptop or phone.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <StepCard num="1" title="Choose format &amp; theme" description="Select Birthday Gift or Wedding Invitation, then pick from 10 signature themes tailored to your celebration." />
                            <StepCard num="2" title="Personalize your story" description="Upload photos, customize the opening surprise, adjust soundscapes, and set event schedules." />
                            <StepCard num="3" title="Preview in real-time" description="Experience exactly what your recipient or guests will see on desktop, tablet, and mobile devices." />
                            <StepCard num="4" title="Publish &amp; send" description="Get an instant shareable link to send via WhatsApp, Instagram, or email. No guest app required." />
                        </div>
                        <div className="bg-white rounded-3xl shadow-xl p-7 border border-stone-200 space-y-4">
                            <div className="flex items-center gap-3 text-sm text-stone-700">
                                <div className="w-10 h-10 rounded-xl bg-[#F6EDE6] flex items-center justify-center text-lg">
                                    💍
                                </div>
                                <div>
                                    <p className="font-serif font-bold text-stone-900 text-base">Yash &amp; Laxmi's Wedding</p>
                                    <p className="text-stone-400 text-xs">Royal Burgundy · Published</p>
                                </div>
                                <span className="ml-auto px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs rounded-full font-bold">Live</span>
                            </div>
                            <div className="border-t border-stone-100 pt-4 space-y-2.5">
                                {['Wax-Seal Opening Gatefold', 'Couple Love Story Timeline', 'Multi-Ceremony Schedule & Maps', 'Interactive Guest RSVP Form'].map((s, i) => (
                                    <div key={s} className="flex items-center gap-2.5 text-xs text-stone-600 font-medium">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#B4654F]" />
                                        <span>{s}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-stone-100 pt-4 flex items-center justify-between text-xs text-stone-400">
                                <span className="font-mono text-[11px]">aurapaperie.com/wedding/yash-laxmi</span>
                                <span className="text-[#B4654F] font-bold">Copy Link →</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Bottom CTA Banner ───────────────────────────────────────────── */}
            <section className="py-24 bg-[#1C2230] text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(180,101,79,0.2)_0%,transparent_75%)]" />
                <div className="relative max-w-3xl mx-auto text-center px-4 z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="text-xs uppercase tracking-widest text-amber-200 font-bold mb-3 block">Start Creating Today</span>
                        <h2 className="font-serif text-4xl sm:text-5xl font-bold mb-6 tracking-tight">
                            Create a memory they will never forget
                        </h2>
                        <p className="text-stone-300 text-base sm:text-lg mb-10 max-w-xl mx-auto">
                            Whether celebrating someone's milestone birthday or inviting cherished friends to your vows, make it extraordinary.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                to={user ? '/dashboard' : '/auth/signup'}
                                id="footer-birthday-cta"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-[#B4654F] hover:bg-[#9E533F] text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-xl transition-all hover:scale-[1.02]"
                            >
                                <Gift className="w-4 h-4" />
                                <span>Create Birthday Gift</span>
                            </Link>
                            <Link
                                to={user ? '/dashboard' : '/auth/signup'}
                                id="footer-wedding-cta"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs uppercase tracking-wider rounded-2xl shadow-xl transition-all hover:scale-[1.02]"
                            >
                                <Heart className="w-4 h-4 text-rose-300 fill-current" />
                                <span>Design Wedding Invite</span>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ─── Footer with Folded Ribbon Logo ──────────────────────────────── */}
            <footer className="bg-[#141822] text-stone-400 py-14 border-t border-stone-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
                    <BrandLogo size="md" layout="horizontal" theme="dark" to="/" />
                    <p className="text-xs text-stone-500">
                        &copy; {new Date().getFullYear()} AuraPaperie. Personalized Wishes &amp; Bespoke Digital Invitations.
                    </p>
                    <div className="flex items-center gap-6 text-xs font-semibold uppercase tracking-wider">
                        <Link to="/auth/signup" className="hover:text-white transition-colors">Sign up</Link>
                        <Link to="/auth/signin" className="hover:text-white transition-colors">Sign in</Link>
                        <Link to="/dashboard" className="hover:text-white transition-colors">Studio</Link>
                    </div>
                </div>
            </footer>
        </div>
    )
}

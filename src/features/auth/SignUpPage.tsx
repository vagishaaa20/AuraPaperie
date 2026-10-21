import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useAuth } from './AuthContext'
import { cn } from '@/lib/utils'
import { BrandLogo } from '@/components/BrandLogo'

export default function SignUpPage() {
    const { signUp } = useAuth()
    const navigate = useNavigate()
    const [displayName, setDisplayName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        if (password.length < 8) {
            setError('Password must be at least 8 characters')
            return
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }
        setLoading(true)
        const { error } = await signUp(email, password, displayName)
        setLoading(false)
        if (error) {
            setError(error)
        } else {
            setSuccess(true)
            setTimeout(() => navigate('/dashboard'), 2000)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4">
                <div className="text-center bg-white/90 backdrop-blur-md p-10 rounded-3xl border border-[#EBE3D5] shadow-xl max-w-sm">
                    <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                        <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h2 className="font-serif text-3xl font-bold text-[#1C2230] mb-2">Welcome to AuraPaperie!</h2>
                    <p className="text-stone-500 text-sm">Setting up your celebration studio...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#FAF7F2] bg-[radial-gradient(#E8DFC8_1px,transparent_1px)] [background-size:24px_24px] flex items-center justify-center p-4">
            {/* Ambient paper glows */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#E5B899]/20 blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#A3B899]/20 blur-3xl" />
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl shadow-stone-200/60 border border-[#EBE3D5] p-8 sm:p-10">
                    {/* Brand Header */}
                    <div className="text-center mb-8 flex flex-col items-center">
                        <BrandLogo size="lg" layout="stacked" to="/" />
                        <h1 className="mt-5 font-serif text-2xl sm:text-3xl font-bold text-[#1C2230]">Create your account</h1>
                        <p className="mt-1.5 text-stone-500 text-sm">Design bespoke wishes &amp; wedding invitations</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="displayName" className="block text-xs uppercase tracking-wider font-semibold text-stone-600 mb-1.5">Your Name</label>
                            <div className="relative">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                                <input
                                    id="displayName"
                                    type="text"
                                    value={displayName}
                                    onChange={e => setDisplayName(e.target.value)}
                                    placeholder="Jane Doe"
                                    className="w-full pl-10 pr-4 py-2.5 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#AE6850]/40 focus:border-[#AE6850] bg-stone-50/50 text-stone-900 placeholder-stone-400 transition text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-xs uppercase tracking-wider font-semibold text-stone-600 mb-1.5">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                    className="w-full pl-10 pr-4 py-2.5 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#AE6850]/40 focus:border-[#AE6850] bg-stone-50/50 text-stone-900 placeholder-stone-400 transition text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-xs uppercase tracking-wider font-semibold text-stone-600 mb-1.5">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                    autoComplete="new-password"
                                    placeholder="At least 8 characters"
                                    className="w-full pl-10 pr-10 py-2.5 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#AE6850]/40 focus:border-[#AE6850] bg-stone-50/50 text-stone-900 placeholder-stone-400 transition text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-xs uppercase tracking-wider font-semibold text-stone-600 mb-1.5">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                                <input
                                    id="confirmPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    required
                                    autoComplete="new-password"
                                    placeholder="Repeat password"
                                    className="w-full pl-10 pr-4 py-2.5 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#AE6850]/40 focus:border-[#AE6850] bg-stone-50/50 text-stone-900 placeholder-stone-400 transition text-sm"
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                id="signup-btn"
                                className={cn(
                                    'w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide text-white shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer',
                                    'bg-gradient-to-r from-[#B4654F] to-[#924C38] hover:shadow-[#AE6850]/25 hover:scale-[1.01] active:scale-[0.99]',
                                    loading && 'opacity-60 cursor-not-allowed'
                                )}
                            >
                                {loading ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span>Create Free Account</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center border-t border-stone-100 pt-6">
                        <p className="text-stone-500 text-sm">
                            Already have an account?{' '}
                            <Link to="/auth/signin" className="text-[#AE6850] font-semibold hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

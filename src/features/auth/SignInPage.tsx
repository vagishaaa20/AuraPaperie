import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useAuth } from './AuthContext'
import { cn } from '@/lib/utils'
import { BrandLogo } from '@/components/BrandLogo'

export default function SignInPage() {
    const { signIn } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)
        const { error } = await signIn(email, password)
        setLoading(false)
        if (error) {
            setError(error)
        } else {
            navigate('/dashboard')
        }
    }

    return (
        <div className="min-h-screen bg-[#FAF7F2] bg-[radial-gradient(#E8DFC8_1px,transparent_1px)] [background-size:24px_24px] flex items-center justify-center p-4">
            {/* Ambient paper glows */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#E5B899]/20 blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#A3B899]/20 blur-3xl" />
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Card */}
                <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl shadow-stone-200/60 border border-[#EBE3D5] p-8 sm:p-10">
                    {/* Logo Header */}
                    <div className="text-center mb-8 flex flex-col items-center">
                        <BrandLogo size="lg" layout="stacked" to="/" />
                        <h1 className="mt-5 font-serif text-2xl sm:text-3xl font-bold text-[#1C2230]">Welcome back</h1>
                        <p className="mt-1.5 text-stone-500 text-sm">Sign in to your celebration studio</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
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
                                    className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#AE6850]/40 focus:border-[#AE6850] bg-stone-50/50 text-stone-900 placeholder-stone-400 transition text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label htmlFor="password" className="block text-xs uppercase tracking-wider font-semibold text-stone-600">Password</label>
                                <Link to="/auth/forgot-password" className="text-xs font-medium text-[#AE6850] hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-10 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#AE6850]/40 focus:border-[#AE6850] bg-stone-50/50 text-stone-900 placeholder-stone-400 transition text-sm"
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

                        <button
                            type="submit"
                            disabled={loading}
                            id="signin-btn"
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
                                    <span>Sign in to Studio</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center border-t border-stone-100 pt-6">
                        <p className="text-stone-500 text-sm">
                            Don't have an account?{' '}
                            <Link to="/auth/signup" className="text-[#AE6850] font-semibold hover:underline">
                                Create an account free
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

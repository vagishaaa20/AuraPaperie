import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react'
import { useAuth } from './AuthContext'
import { cn } from '@/lib/utils'

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
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
            {/* Floating decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {['✨', '💕', '🎀', '⭐', '🌸'].map((emoji, i) => (
                    <span
                        key={i}
                        className="absolute text-2xl animate-float opacity-30"
                        style={{
                            left: `${10 + i * 20}%`,
                            top: `${15 + (i % 3) * 25}%`,
                            animationDelay: `${i * 1.2}s`,
                        }}
                    >{emoji}</span>
                ))}
            </div>

            <div className="w-full max-w-md relative">
                {/* Card */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl shadow-rose-100 border border-rose-100 p-8">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <Link to="/" className="inline-flex items-center gap-2 group">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-600 flex items-center justify-center shadow-glow-pink group-hover:scale-110 transition-transform">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <span className="font-display font-bold text-2xl text-gray-900">B'Day</span>
                        </Link>
                        <h1 className="mt-6 font-display text-3xl font-bold text-gray-900">Welcome back 🎉</h1>
                        <p className="mt-2 text-gray-500 text-sm">Sign in to manage your birthday projects</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent bg-white text-gray-900 placeholder-gray-400 transition"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                <Link to="/auth/forgot-password" className="text-sm text-rose-600 hover:text-rose-700 transition-colors">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
                                    placeholder="Your password"
                                    className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent bg-white text-gray-900 placeholder-gray-400 transition"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            aria-busy={loading}
                            className={cn(
                                'w-full py-3.5 px-6 rounded-xl font-semibold text-white',
                                'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700',
                                'shadow-lg shadow-rose-200 hover:shadow-rose-300',
                                'transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]',
                                'flex items-center justify-center gap-2',
                                'disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100'
                            )}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>Sign in <ArrowRight className="w-4 h-4" /></>
                            )}
                        </button>
                    </form>

                    <p className="text-center mt-6 text-sm text-gray-500">
                        Don't have an account?{' '}
                        <Link to="/auth/signup" className="text-rose-600 hover:text-rose-700 font-medium transition-colors">
                            Sign up free
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

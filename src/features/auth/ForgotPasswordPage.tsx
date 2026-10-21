import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Sparkles, ArrowLeft, CheckCircle } from 'lucide-react'
import { useAuth } from './AuthContext'
import { cn } from '@/lib/utils'

export default function ForgotPasswordPage() {
    const { sendPasswordReset } = useAuth()
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [sent, setSent] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)
        const { error } = await sendPasswordReset(email)
        setLoading(false)
        if (error) setError(error)
        else setSent(true)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl shadow-rose-100 border border-rose-100 p-8">
                    <div className="text-center mb-8">
                        <Link to="/" className="inline-flex items-center gap-2 group">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <span className="font-display font-bold text-2xl text-gray-900">B'Day</span>
                        </Link>
                        <h1 className="mt-6 font-display text-3xl font-bold text-gray-900">Reset password</h1>
                        <p className="mt-2 text-gray-500 text-sm">We'll email you a link to reset your password</p>
                    </div>

                    {sent ? (
                        <div className="text-center py-6">
                            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Email sent!</h3>
                            <p className="text-sm text-gray-500 mb-6">Check your inbox for a password reset link.</p>
                            <Link to="/auth/signin" className="text-rose-600 hover:text-rose-700 font-medium text-sm transition-colors">
                                ← Back to sign in
                            </Link>
                        </div>
                    ) : (
                        <>
                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>
                            )}
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
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
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={cn(
                                        'w-full py-3.5 px-6 rounded-xl font-semibold text-white',
                                        'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700',
                                        'shadow-lg shadow-rose-200 transition-all duration-200 hover:scale-[1.01]',
                                        'flex items-center justify-center gap-2',
                                        'disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100'
                                    )}
                                >
                                    {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Send reset link'}
                                </button>
                            </form>
                            <div className="mt-6 text-center">
                                <Link to="/auth/signin" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                                    <ArrowLeft className="w-4 h-4" /> Back to sign in
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

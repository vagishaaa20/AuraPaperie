import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { useAuth } from './AuthContext'
import { cn } from '@/lib/utils'
import { BrandLogo } from '@/components/BrandLogo'

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
        <div className="min-h-screen bg-[#FAF7F2] bg-[radial-gradient(#E8DFC8_1px,transparent_1px)] [background-size:24px_24px] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl shadow-stone-200/60 border border-[#EBE3D5] p-8 sm:p-10">
                    <div className="text-center mb-8 flex flex-col items-center">
                        <BrandLogo size="lg" layout="stacked" to="/" />
                        <h1 className="mt-5 font-serif text-2xl sm:text-3xl font-bold text-[#1C2230]">Reset password</h1>
                        <p className="mt-1.5 text-stone-500 text-sm">We'll email you a recovery link</p>
                    </div>

                    {sent ? (
                        <div className="text-center py-6">
                            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8" />
                            </div>
                            <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">Check your inbox</h3>
                            <p className="text-sm text-stone-500 mb-6">We sent password reset instructions to your email address.</p>
                            <Link to="/auth/signin" className="text-[#AE6850] font-semibold text-sm hover:underline">
                                ← Back to sign in
                            </Link>
                        </div>
                    ) : (
                        <>
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

                                <button
                                    type="submit"
                                    disabled={loading}
                                    id="reset-btn"
                                    className={cn(
                                        'w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide text-white shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer',
                                        'bg-gradient-to-r from-[#B4654F] to-[#924C38] hover:shadow-[#AE6850]/25 hover:scale-[1.01] active:scale-[0.99]',
                                        loading && 'opacity-60 cursor-not-allowed'
                                    )}
                                >
                                    {loading ? (
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        'Send Reset Link'
                                    )}
                                </button>
                            </form>

                            <div className="mt-8 text-center border-t border-stone-100 pt-6">
                                <Link to="/auth/signin" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-500 hover:text-stone-800 transition">
                                    <ArrowLeft className="w-3.5 h-3.5" />
                                    <span>Back to sign in</span>
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

import React from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, Sparkles } from 'lucide-react'

export default function NotFoundPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center p-4">
            <div className="text-center max-w-md">
                <div className="text-8xl mb-6">🎂</div>
                <div className="flex items-center justify-center gap-2 mb-4">
                    <AlertTriangle className="w-6 h-6 text-rose-400" />
                    <span className="text-rose-400 font-semibold text-lg">404</span>
                </div>
                <h1 className="font-display text-3xl font-bold text-gray-900 mb-3">
                    This page doesn't exist
                </h1>
                <p className="text-gray-500 mb-8">
                    This birthday experience may have been unpublished or the link might be incorrect.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-rose-200 transition-all hover:scale-105"
                    >
                        <Sparkles className="w-4 h-4" />
                        Create your own birthday website
                    </Link>
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 shadow hover:shadow-md transition-all hover:scale-105"
                    >
                        Go to dashboard
                    </Link>
                </div>
            </div>
        </div>
    )
}

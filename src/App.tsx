import React, { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './features/auth/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

// Lazy-loaded pages
const LandingPage = lazy(() => import('./features/landing/LandingPage'))
const SignInPage = lazy(() => import('./features/auth/SignInPage'))
const SignUpPage = lazy(() => import('./features/auth/SignUpPage'))
const ForgotPasswordPage = lazy(() => import('./features/auth/ForgotPasswordPage'))
const DashboardPage = lazy(() => import('./features/dashboard/DashboardPage'))
const EditorPage = lazy(() => import('./features/editor/EditorPage'))
const MemoriesPage = lazy(() => import('./features/memories/MemoriesPage'))
const BirthdayPage = lazy(() => import('./features/birthday/BirthdayPage'))
const WeddingPage = lazy(() => import('./features/wedding/WeddingPage'))
const RsvpManagementPage = lazy(() => import('./features/wedding/RsvpManagementPage'))
const NotFoundPage = lazy(() => import('./components/NotFoundPage'))

function PageLoader() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50">
            <div className="text-center">
                <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm text-gray-400">Loading...</p>
            </div>
        </div>
    )
}

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        className: '!rounded-xl !shadow-lg !font-sans !text-sm',
                        success: { className: '!bg-green-50 !border !border-green-200 !text-green-800' },
                        error: { className: '!bg-red-50 !border !border-red-200 !text-red-800' },
                    }}
                />
                <Suspense fallback={<PageLoader />}>
                    <Routes>
                        {/* Public routes */}
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/auth/signin" element={<SignInPage />} />
                        <Route path="/auth/signup" element={<SignUpPage />} />
                        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />

                        {/* Public birthday experience */}
                        <Route path="/birthday/:slug" element={<BirthdayPage />} />
                        <Route path="/wedding/:slug" element={<WeddingPage />} />

                        {/* Protected creator routes */}
                        <Route
                            path="/dashboard"
                            element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}
                        />
                        <Route
                            path="/editor/:experienceId"
                            element={<ProtectedRoute><EditorPage /></ProtectedRoute>}
                        />
                        <Route
                            path="/rsvps/:experienceId"
                            element={<ProtectedRoute><RsvpManagementPage /></ProtectedRoute>}
                        />
                        <Route
                            path="/memories"
                            element={<ProtectedRoute><MemoriesPage /></ProtectedRoute>}
                        />

                        {/* Fallbacks */}
                        <Route path="/404" element={<NotFoundPage />} />
                        <Route path="*" element={<Navigate to="/404" replace />} />
                    </Routes>
                </Suspense>
            </AuthProvider>
        </BrowserRouter>
    )
}





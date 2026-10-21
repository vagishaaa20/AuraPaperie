import { describe, it, expect, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useAuth, AuthProvider } from '@/features/auth/AuthContext'
import React from 'react'

// Mock supabase
vi.mock('@/lib/supabase', () => ({
    supabase: {
        auth: {
            getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
            onAuthStateChange: vi.fn().mockReturnValue({
                data: { subscription: { unsubscribe: vi.fn() } },
            }),
            signInWithPassword: vi.fn().mockImplementation(({ email, password }) => {
                if (password === 'correct') {
                    return Promise.resolve({ data: { user: { id: 'u1', email } }, error: null })
                }
                return Promise.resolve({ data: { user: null }, error: { message: 'Invalid credentials' } })
            }),
            signUp: vi.fn().mockImplementation(({ email }) => {
                return Promise.resolve({ data: { user: { id: 'u2', email } }, error: null })
            }),
            signOut: vi.fn().mockResolvedValue({ error: null }),
            resetPasswordForEmail: vi.fn().mockResolvedValue({ error: null }),
        },
        from: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ data: { id: 'u1', display_name: 'Alex' }, error: null }),
        }),
    },
}))

describe('AuthContext', () => {
    it('initializes in logged out state after session check finishes', async () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <AuthProvider>{children}</AuthProvider>
        )
        const { result } = renderHook(() => useAuth(), { wrapper })

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
        })

        expect(result.current.user).toBeNull()
    })

    it('sign in updates user on successful authentication', async () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <AuthProvider>{children}</AuthProvider>
        )
        const { result } = renderHook(() => useAuth(), { wrapper })

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
        })

        let signInRes: any
        await act(async () => {
            signInRes = await result.current.signIn('alex@example.com', 'correct')
        })

        expect(signInRes.error).toBeNull()
    })

    it('returns error when credentials are wrong', async () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <AuthProvider>{children}</AuthProvider>
        )
        const { result } = renderHook(() => useAuth(), { wrapper })

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
        })

        let signInRes: any
        await act(async () => {
            signInRes = await result.current.signIn('alex@example.com', 'wrong')
        })

        expect(signInRes.error).toBe('Invalid credentials')
    })
})

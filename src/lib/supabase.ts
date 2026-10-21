import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
        'Missing Supabase environment variables. ' +
        'Please copy .env.example to .env and fill in your Supabase project URL and anon key.'
    )
}

export const supabase = createClient<any>(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
    },
})

// ─── Storage Bucket Names ─────────────────────────────────────────────────────

export const STORAGE_BUCKETS = {
    /** Private bucket for creator uploads — access controlled by RLS */
    PRIVATE: 'private-media',
    /** Public bucket for published experience media — publicly readable */
    PUBLIC: 'public-media',
    /** Memories library bucket */
    MEMORIES: 'memories',
} as const

/** Shorthand for the memories storage bucket name */
export const MEMORIES_BUCKET = STORAGE_BUCKETS.MEMORIES

// ─── Helper: Get a public URL for a given storage path ───────────────────────

export function getPublicUrl(bucket: string, path: string): string {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    return data.publicUrl
}

// ─── Helper: Upload a file to a storage bucket ───────────────────────────────

export async function uploadFile(
    bucket: string,
    path: string,
    file: File,
    onProgress?: (progress: number) => void
): Promise<{ error: Error | null }> {
    onProgress?.(10)

    const { error } = await supabase.storage.from(bucket).upload(path, file, {
        cacheControl: '3600',
        upsert: false,
    })

    onProgress?.(100)
    return { error: error as Error | null }
}

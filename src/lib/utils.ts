import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Tailwind-safe class merger */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/** Generate a URL-safe slug from a string */
export function generateSlug(text: string): string {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')  // Remove diacritics
        .replace(/[^a-z0-9\s-]/g, '')     // Remove non-alphanumeric
        .trim()
        .replace(/\s+/g, '-')             // Spaces to hyphens
        .replace(/-+/g, '-')              // Collapse multiple hyphens
        .slice(0, 60)                     // Max 60 chars
}

/** List of reserved application route slugs */
const RESERVED_SLUGS = new Set([
    'dashboard', 'editor', 'auth', 'login', 'signup', 'sign-up', 'sign-in',
    'forgot-password', 'reset-password', 'memories', 'profile', 'settings',
    'admin', 'api', 'help', 'support', 'about', 'terms', 'privacy',
    'new', 'edit', 'create', 'preview', 'publish',
])

/** Check if a slug is syntactically valid and not reserved */
export function validateSlug(slug: string): { valid: boolean; error?: string } {
    if (!slug) return { valid: false, error: 'Slug is required' }
    if (slug.length < 3) return { valid: false, error: 'Slug must be at least 3 characters' }
    if (slug.length > 60) return { valid: false, error: 'Slug must be 60 characters or less' }
    if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(slug)) {
        return { valid: false, error: 'Slug may only contain lowercase letters, numbers, and hyphens, and must start and end with a letter or number' }
    }
    if (RESERVED_SLUGS.has(slug)) {
        return { valid: false, error: `"${slug}" is reserved and cannot be used as a slug` }
    }
    return { valid: true }
}

/** Format a date string to a human-readable format */
export function formatDate(date: string | null | undefined): string {
    if (!date) return ''
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

/** Format a timestamp as a relative time string */
export function timeAgo(date: string): string {
    const now = new Date()
    const then = new Date(date)
    const diff = now.getTime() - then.getTime()
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 30) return then.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    if (days > 1) return `${days} days ago`
    if (days === 1) return 'yesterday'
    if (hours > 1) return `${hours} hours ago`
    if (hours === 1) return '1 hour ago'
    if (minutes > 1) return `${minutes} minutes ago`
    return 'just now'
}

/** Format file size in human-readable form */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

/** Alias for formatFileSize — used in MemoriesPage */
export const formatBytes = formatFileSize

/** Accepted MIME types per category */
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
export const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/webm']
export const ACCEPTED_AUDIO_TYPES = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/m4a']

export const MAX_IMAGE_SIZE = 10 * 1024 * 1024   // 10 MB
export const MAX_VIDEO_SIZE = 50 * 1024 * 1024   // 50 MB
export const MAX_AUDIO_SIZE = 20 * 1024 * 1024   // 20 MB

/** Validate an uploaded file */
export function validateFile(
    file: File,
    type: 'image' | 'video' | 'audio'
): { valid: boolean; error?: string } {
    const accepted = type === 'image' ? ACCEPTED_IMAGE_TYPES
        : type === 'video' ? ACCEPTED_VIDEO_TYPES
            : ACCEPTED_AUDIO_TYPES

    const maxSize = type === 'image' ? MAX_IMAGE_SIZE
        : type === 'video' ? MAX_VIDEO_SIZE
            : MAX_AUDIO_SIZE

    if (!accepted.includes(file.type)) {
        return { valid: false, error: `Invalid file type. Accepted: ${accepted.join(', ')}` }
    }

    if (file.size > maxSize) {
        return { valid: false, error: `File too large. Maximum size: ${formatFileSize(maxSize)}` }
    }

    return { valid: true }
}

/** Generate a random unique ID for client-side objects */
export function generateId(): string {
    return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

/** Truncate text with ellipsis */
export function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength - 3) + '...'
}

/** Check if the user prefers reduced motion */
export function prefersReducedMotion(): boolean {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

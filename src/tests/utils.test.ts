import { describe, it, expect } from 'vitest'
import { generateSlug, validateSlug, formatFileSize, truncate } from '@/lib/utils'

describe('utils', () => {
    describe('generateSlug', () => {
        it('generates a clean slug from a title', () => {
            expect(generateSlug("Happy Birthday Sarah!!")).toBe('happy-birthday-sarah')
            expect(generateSlug("Alex's 30th Extravaganza 🎉")).toBe('alexs-30th-extravaganza')
        })

        it('handles accents and special characters', () => {
            expect(generateSlug("Joyeux Anniversaire Chloë")).toBe('joyeux-anniversaire-chloe')
        })
    })

    describe('validateSlug', () => {
        it('accepts valid slugs', () => {
            expect(validateSlug('sarah-birthday-2026').valid).toBe(true)
            expect(validateSlug('alex30').valid).toBe(true)
        })

        it('rejects too short or too long slugs', () => {
            expect(validateSlug('ab').valid).toBe(false)
            expect(validateSlug('a'.repeat(61)).valid).toBe(false)
        })

        it('rejects reserved route slugs', () => {
            expect(validateSlug('dashboard').valid).toBe(false)
            expect(validateSlug('editor').valid).toBe(false)
            expect(validateSlug('login').valid).toBe(false)
        })

        it('rejects slugs starting or ending with hyphens', () => {
            expect(validateSlug('-invalid-').valid).toBe(false)
        })
    })

    describe('formatFileSize', () => {
        it('formats byte numbers properly', () => {
            expect(formatFileSize(0)).toBe('0 B')
            expect(formatFileSize(1024)).toBe('1 KB')
            expect(formatFileSize(1024 * 1024 * 3.5)).toBe('3.5 MB')
        })
    })

    describe('truncate', () => {
        it('truncates text beyond max length with ellipsis', () => {
            expect(truncate('Hello world', 5)).toBe('He...')
            expect(truncate('Hello', 10)).toBe('Hello')
        })
    })
})

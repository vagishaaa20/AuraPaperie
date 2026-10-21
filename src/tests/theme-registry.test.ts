import { describe, it, expect } from 'vitest'
import { themes, getThemeById, getThemesByStyle } from '@/lib/theme-registry'

describe('Theme Registry', () => {
    it('has exactly 10 production themes defined', () => {
        expect(themes).toHaveLength(10)
    })

    it('has 6 scrapbook themes and 4 cinematic themes', () => {
        const scrapbook = getThemesByStyle('scrapbook')
        const cinematic = getThemesByStyle('cinematic')

        expect(scrapbook).toHaveLength(6)
        expect(cinematic).toHaveLength(4)
    })

    it('all themes have required properties and distinct ids', () => {
        const ids = new Set<string>()
        themes.forEach(theme => {
            expect(ids.has(theme.id)).toBe(false)
            ids.add(theme.id)

            expect(theme.name).toBeTruthy()
            expect(theme.palette.primary).toMatch(/^#/)
            expect(theme.palette.background).toMatch(/^#/)
            expect(theme.typography.headingFont).toBeTruthy()
            expect(theme.typography.bodyFont).toBeTruthy()
            expect(theme.animation).toBeDefined()
        })
    })

    it('getThemeById retrieves the correct theme or falls back gracefully', () => {
        const theme = getThemeById('pink-scrapbook')
        expect(theme.id).toBe('pink-scrapbook')
        expect(theme.style).toBe('scrapbook')

        const fallback = getThemeById('non-existent-theme' as any)
        expect(fallback.id).toBe('pink-scrapbook')
    })
})

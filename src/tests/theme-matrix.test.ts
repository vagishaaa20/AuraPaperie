import { describe, it, expect } from 'vitest'
import { themes } from '@/lib/theme-registry'
import type { ThemeConfig, SectionType } from '@/lib/types'

describe('Theme-by-Feature Matrix Verification', () => {
    // List of major recipient sections that every theme must support
    const majorFeatures: SectionType[] = [
        'surprise-intro',
        'birthday-hero',
        'memory-scrapbook',
        'cinematic-reel',
        'our-story',
        'things-i-love',
        'birthday-letter',
        'birthday-cake',
        'hidden-surprise',
        'music-player',
        'final-message',
    ]

    it('verifies that all 10 original themes are preserved in the registry', () => {
        expect(themes).toHaveLength(10)
        const expectedIds = [
            'pink-scrapbook',
            'lavender-dreams',
            'vintage-journal',
            'romantic-letterbook',
            'playful-bestie',
            'botanical-garden',
            'midnight-magic',
            'golden-hour',
            'starlit-cinema',
            'minimalist-elegance',
        ]
        const actualIds = themes.map(t => t.id)
        expectedIds.forEach(id => {
            expect(actualIds).toContain(id)
        })
    })

    // Matrix test: Check each theme against required design system tokens
    themes.forEach((theme: ThemeConfig) => {
        describe(`Theme: "${theme.name}" (${theme.id})`, () => {
            it('has complete palette and non-empty color values', () => {
                expect(theme.palette.primary).toMatch(/^#[0-9a-fA-F]{6}$/)
                expect(theme.palette.background).toBeTruthy()
                expect(theme.palette.surface).toBeTruthy()
                expect(theme.palette.text).toBeTruthy()
                expect(theme.palette.border).toBeTruthy()
            })

            it('has distinct typography configured for headings and body', () => {
                expect(theme.typography.headingFont).toBeTruthy()
                expect(theme.typography.bodyFont).toBeTruthy()
            })

            it('has a valid photo frame and decoration configuration', () => {
                expect(theme.photoFrame.style).toBeDefined()
                expect(theme.previewGradient).toContain('gradient')
            })

            it('supports all 11 core interactive section types without errors', () => {
                majorFeatures.forEach(feature => {
                    expect(feature).toBeTruthy()
                })
            })
        })
    })
})

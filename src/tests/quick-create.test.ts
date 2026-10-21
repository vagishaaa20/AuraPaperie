import { describe, it, expect } from 'vitest'
import { generateQuickBirthdayExperience } from '@/lib/quick-create-generator'
import { themes } from '@/lib/theme-registry'

describe('One-Click Auto-Create Birthday Generator', () => {
    it('generates a complete experience with only a recipient name provided', () => {
        const exp = generateQuickBirthdayExperience({ recipientName: 'Emma' })

        expect(exp.recipient_name).toBe('Emma')
        expect(exp.title).toContain('Emma')
        expect(exp.slug).toContain('emma')
        expect(exp.sections.length).toBeGreaterThanOrEqual(10)

        // Verifies all core sections have pre-populated content
        const hero = exp.sections.find(s => s.type === 'birthday-hero')
        expect(hero?.config).toHaveProperty('heading')
        expect((hero?.config as any).heading).toContain('Emma')

        const scrapbook = exp.sections.find(s => s.type === 'memory-scrapbook')
        expect((scrapbook?.config as any).photos.length).toBeGreaterThan(0)

        const reel = exp.sections.find(s => s.type === 'cinematic-reel')
        expect((reel?.config as any).slides.length).toBeGreaterThan(0)

        const letter = exp.sections.find(s => s.type === 'birthday-letter')
        expect((letter?.config as any).body).toBeTruthy()
        expect((letter?.config as any).salutation).toContain('Emma')

        const cake = exp.sections.find(s => s.type === 'birthday-cake')
        expect((cake?.config as any).candle_count).toBe(5)
    })

    it('adapts tone and relationship context', () => {
        const funnyExp = generateQuickBirthdayExperience({
            recipientName: 'Dave',
            relationship: 'friend',
            tone: 'funny',
        })
        const letter = funnyExp.sections.find(s => s.type === 'birthday-letter')
        expect((letter?.config as any).body).toContain('quirks')

        const romanticExp = generateQuickBirthdayExperience({
            recipientName: 'Sophia',
            relationship: 'partner',
            tone: 'romantic',
        })
        const romanticLetter = romanticExp.sections.find(s => s.type === 'birthday-letter')
        expect((romanticLetter?.config as any).body).toContain('love of my life')
    })

    it('works across all 10 themes seamlessly without content degradation', () => {
        themes.forEach(theme => {
            const exp = generateQuickBirthdayExperience({
                recipientName: 'Alex',
                themeId: theme.id,
            })
            expect(exp.theme_id).toBe(theme.id)
            expect(exp.sections.length).toBe(11)
        })
    })

    it('falls back gracefully when recipient name is omitted', () => {
        const fallback = generateQuickBirthdayExperience({})
        expect(fallback.recipient_name).toBe('My Favorite Human')
        expect(fallback.title).toContain('My Favorite Human')
    })
})

import { describe, it, expect } from 'vitest'
import { generateQuickWeddingExperience } from '@/lib/wedding-quick-generator'
import { themes } from '@/lib/theme-registry'

describe('Wedding Invitation Quick-Create Builder', () => {
    it('generates a complete wedding invitation with required details', () => {
        const wedding = generateQuickWeddingExperience({
            partner1Name: 'Aarav',
            partner2Name: 'Meera',
            weddingDate: 'December 18, 2026',
            venueName: 'The Grand Heritage Estate',
            city: 'Napa Valley, CA',
        })

        expect(wedding.project_type).toBe('wedding')
        expect(wedding.recipient_name).toBe('Aarav & Meera')
        expect(wedding.title).toContain('Aarav & Meera')
        expect(wedding.slug).toContain('wedding')

        // Verify core wedding modules exist
        const types = wedding.sections.map(s => s.type)
        expect(types).toContain('wedding-cover')
        expect(types).toContain('wedding-couple')
        expect(types).toContain('wedding-events')
        expect(types).toContain('wedding-countdown')
        expect(types).toContain('wedding-rsvp')
        expect(types).toContain('wedding-venue')
        expect(types).toContain('wedding-cta')
    })

    it('populates multiple cultural events by default', () => {
        const wedding = generateQuickWeddingExperience({
            partner1Name: 'Rohan',
            partner2Name: 'Priya',
            weddingDate: 'November 20, 2026',
        })

        const eventsSection = wedding.sections.find(s => s.type === 'wedding-events')
        const events = (eventsSection?.config as any)?.events
        expect(events).toBeDefined()
        expect(events.length).toBeGreaterThanOrEqual(2)
        expect(events[0]).toHaveProperty('venue_name')
        expect(events[0]).toHaveProperty('date')
    })

    it('adapts across all 10 platform themes without losing structure', () => {
        themes.forEach(theme => {
            const wedding = generateQuickWeddingExperience({
                partner1Name: 'Michael',
                partner2Name: 'Emma',
                themeId: theme.id,
            })
            expect(wedding.theme_id).toBe(theme.id)
            expect(wedding.sections.length).toBeGreaterThanOrEqual(8)
        })
    })
})

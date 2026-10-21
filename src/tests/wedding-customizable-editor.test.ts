import { describe, it, expect } from 'vitest'
import { getProjectType, getDefaultWeddingSections } from '../lib/project-helpers'

describe('Customizable Wedding Invitation System', () => {
    it('generates a full suite of default wedding sections', () => {
        const sections = getDefaultWeddingSections('Kavya', 'Rohan')
        expect(sections.length).toBeGreaterThanOrEqual(7)

        const types = sections.map(s => s.type)
        expect(types).toContain('wedding-cover')
        expect(types).toContain('wedding-couple')
        expect(types).toContain('wedding-message')
        expect(types).toContain('wedding-events')
        expect(types).toContain('wedding-countdown')
        expect(types).toContain('wedding-venue')
        expect(types).toContain('wedding-rsvp')
        expect(types).toContain('wedding-cta')

        const cover = sections.find(s => s.type === 'wedding-cover')
        expect((cover?.config as any)?.partner1_name).toBe('Kavya')
        expect((cover?.config as any)?.partner2_name).toBe('Rohan')
    })

    it('correctly determines project type from multiple fallbacks', () => {
        // Explicit column
        expect(getProjectType({ project_type: 'wedding' })).toBe('wedding')
        expect(getProjectType({ project_type: 'birthday' })).toBe('birthday')

        // Inside theme_settings
        expect(getProjectType({ theme_settings: { project_type: 'wedding' } as any })).toBe('wedding')

        // Inside intro_settings
        expect(getProjectType({ intro_settings: { project_type: 'wedding' } as any })).toBe('wedding')

        // Inferred from section types
        expect(getProjectType({
            sections: [
                { id: '1', type: 'wedding-events', visible: true, order: 0, config: {} }
            ]
        })).toBe('wedding')

        // Default birthday
        expect(getProjectType({})).toBe('birthday')
        expect(getProjectType(null)).toBe('birthday')
    })

    it('ensures each wedding section has valid visibility and order properties', () => {
        const sections = getDefaultWeddingSections('Priya', 'Dev')
        sections.forEach((sec, idx) => {
            expect(sec.id).toBeDefined()
            expect(sec.visible).toBe(true)
            expect(sec.order).toBe(idx)
            expect(sec.config).toBeDefined()
        })
    })
})

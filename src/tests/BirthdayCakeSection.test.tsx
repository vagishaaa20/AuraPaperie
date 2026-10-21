import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import React from 'react'
import { BirthdayCakeSection } from '@/features/birthday/sections/BirthdayCakeSection'
import { getThemeById } from '@/lib/theme-registry'
import type { BirthdayExperience, SectionConfig } from '@/lib/types'

describe('BirthdayCakeSection Component', () => {
    const mockTheme = getThemeById('pink-scrapbook')
    const mockSection: SectionConfig = {
        id: 'cake-1',
        type: 'birthday-cake',
        visible: true,
        order: 5,
        config: {
            candle_count: 3,
            blowout_message: 'Make a wish!',
        },
    }

    const mockExperience: BirthdayExperience = {
        id: 'exp-123',
        owner_id: 'user-1',
        title: "Emma's Birthday",
        recipient_name: 'Emma',
        sender_name: 'Liam',
        slug: 'emma-2026',
        theme_id: 'pink-scrapbook',
        theme_settings: { theme_id: 'pink-scrapbook' },
        intro_settings: {
            style: 'gift-box',
            recipient_name: 'Emma',
            teaser_text: 'Surprise!',
            greeting: 'Happy Birthday!',
        },
        sections: [mockSection],
        status: 'published',
        published_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    }

    it('renders the cake and candles count according to config', () => {
        render(
            <BirthdayCakeSection
                section={mockSection}
                experience={mockExperience}
                theme={mockTheme}
            />
        )

        expect(screen.getByText(/Make a wish/i)).toBeInTheDocument()
        const candles = screen.getAllByRole('button', { name: /candle/i })
        expect(candles.length).toBe(3)
    })

    it('triggers onCakeDone when all candles are blown out', () => {
        const onCakeDone = vi.fn()
        render(
            <BirthdayCakeSection
                section={mockSection}
                experience={mockExperience}
                theme={mockTheme}
                onCakeDone={onCakeDone}
            />
        )

        const candles = screen.getAllByRole('button', { name: /candle/i })
        candles.forEach(candle => {
            fireEvent.click(candle)
        })

        expect(onCakeDone).toHaveBeenCalled()
    })
})

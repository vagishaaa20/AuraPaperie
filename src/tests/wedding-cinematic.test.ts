import { describe, it, expect } from 'vitest'
import { soundEngine, CURATED_MUSIC_TRACKS } from '../lib/sound-system'
import { generateGoogleCalendarUrl } from '../lib/calendar-helpers'

describe('Wedding Sound & Cinematic System', () => {
    it('provides a curated library of wedding music tracks', () => {
        expect(CURATED_MUSIC_TRACKS.length).toBeGreaterThanOrEqual(4)
        const trackIds = CURATED_MUSIC_TRACKS.map(t => t.id)
        expect(trackIds).toContain('shehnai-sitar')
        expect(trackIds).toContain('canon-in-d')
        expect(trackIds).toContain('piano-romance')
        expect(trackIds).toContain('acoustic-vows')
    })

    it('controls sound engine volumes and mute toggles', () => {
        soundEngine.setMusicVolume(0.8)
        expect(soundEngine.musicVolume).toBe(0.8)

        soundEngine.setSfxVolume(0.5)
        expect(soundEngine.sfxVolume).toBe(0.5)

        const prevMute = soundEngine.isMuted
        soundEngine.toggleMute()
        expect(soundEngine.isMuted).toBe(!prevMute)
        soundEngine.toggleMute() // restore

        const prevSfxMute = soundEngine.isSfxMuted
        soundEngine.toggleSfxMute()
        expect(soundEngine.isSfxMuted).toBe(!prevSfxMute)
        soundEngine.toggleSfxMute() // restore
    })

    it('generates accurate Google Calendar URLs for wedding events', () => {
        const url = generateGoogleCalendarUrl({
            title: 'Aarav & Meera Wedding Ceremony',
            startDateStr: 'December 18, 2026',
            startTimeStr: '11:00 AM',
            location: 'The Grand Pavilion, Napa Valley, CA',
            description: 'Vows and sacred ceremonies.',
        })

        expect(url).toContain('https://calendar.google.com/calendar/render')
        expect(url).toContain('Aarav+%26+Meera+Wedding+Ceremony')
        expect(url).toContain('The+Grand+Pavilion%2C+Napa+Valley%2C+CA')
    })
})

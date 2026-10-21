import React from 'react'
import type { SectionConfig, BirthdayExperience } from '@/lib/types'

interface Props { section: SectionConfig; experience: BirthdayExperience; config: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }

export default function MusicPlayerEditor({ config, onChange }: Props) {
    const update = (k: string, v: unknown) => onChange({ ...config, [k]: v })
    return (
        <div className="p-6 space-y-6">
            <div>
                <h2 className="font-display font-bold text-xl text-gray-900">🎵 Music Player</h2>
                <p className="text-sm text-gray-400 mt-1">Add a special song that plays during the experience</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Source type</label>
                <div className="flex gap-2">
                    {([
                        { value: 'youtube', label: '▶ YouTube' },
                        { value: 'spotify', label: '🎧 Spotify' },
                        { value: 'url', label: '🎶 Audio URL' },
                    ]).map(s => (
                        <button key={s.value} onClick={() => update('source_type', s.value)}
                            className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${config.source_type === s.value ? 'bg-rose-50 border-rose-300 text-rose-700' : 'border-gray-200 text-gray-500'}`}>
                            {s.label}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {config.source_type === 'youtube' ? 'YouTube video URL' : config.source_type === 'spotify' ? 'Spotify track URL' : 'Audio file URL (.mp3, .ogg)'}
                </label>
                <input type="url" value={(config.url as string) ?? ''}
                    onChange={e => update('url', e.target.value)}
                    placeholder={config.source_type === 'spotify' ? 'https://open.spotify.com/track/...' : config.source_type === 'youtube' ? 'https://youtube.com/watch?v=...' : 'https://...song.mp3'}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400" />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Song title (shown in player)</label>
                <input type="text" value={(config.title as string) ?? ''}
                    onChange={e => update('title', e.target.value)}
                    placeholder="e.g. Perfect — Ed Sheeran"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400" />
            </div>

            <div className="flex items-center justify-between py-3 border-t border-gray-100">
                <div>
                    <p className="text-sm font-medium text-gray-700">Autoplay on page load</p>
                    <p className="text-xs text-gray-400">Subject to browser autoplay policy — may require user interaction</p>
                </div>
                <button onClick={() => update('autoplay', !(config.autoplay ?? false))}
                    className={`relative w-11 h-6 rounded-full transition-colors ${(config.autoplay ?? false) ? 'bg-rose-500' : 'bg-gray-200'}`}
                    role="switch" aria-checked={(config.autoplay ?? false) as boolean}>
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${(config.autoplay ?? false) ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
            </div>

            <div className="flex items-center justify-between py-3 border-t border-gray-100">
                <div>
                    <p className="text-sm font-medium text-gray-700">Loop music</p>
                    <p className="text-xs text-gray-400">Repeat the song continuously</p>
                </div>
                <button onClick={() => update('loop', !(config.loop ?? false))}
                    className={`relative w-11 h-6 rounded-full transition-colors ${(config.loop ?? false) ? 'bg-rose-500' : 'bg-gray-200'}`}
                    role="switch" aria-checked={(config.loop ?? false) as boolean}>
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${(config.loop ?? false) ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
            </div>
        </div>
    )
}

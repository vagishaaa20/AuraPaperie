import React, { useState } from 'react'
import type { SectionConfig, BirthdayExperience } from '@/lib/types'

interface Props { section: SectionConfig; experience: BirthdayExperience; config: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }

export default function BirthdayCakeEditor({ experience, config, onChange }: Props) {
    const update = (k: string, v: unknown) => onChange({ ...config, [k]: v })
    const candles = (config.candle_count as number) ?? 1

    return (
        <div className="p-6 space-y-6">
            <div>
                <h2 className="font-display font-bold text-xl text-gray-900">🎂 Interactive Birthday Cake</h2>
                <p className="text-sm text-gray-400 mt-1">The recipient can blow out candles with a click or tap</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Birthday age / candle count</label>
                <div className="flex items-center gap-3">
                    <input type="range" min={1} max={30} value={candles}
                        onChange={e => update('candle_count', Number(e.target.value))}
                        className="flex-1 accent-rose-500" />
                    <span className="w-10 text-center font-bold text-gray-800 text-lg">{candles}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Set to 1 for a simpler look when you don't want to show age</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cake style</label>
                <div className="grid grid-cols-3 gap-2">
                    {[
                        { value: 'classic', emoji: '🎂', label: 'Classic' },
                        { value: 'layered', emoji: '🍰', label: 'Layered' },
                        { value: 'magical', emoji: '✨', label: 'Magical' },
                    ].map(style => (
                        <button key={style.value}
                            onClick={() => update('cake_style', style.value)}
                            className={`flex flex-col items-center py-3 rounded-xl border-2 text-sm gap-1 font-medium transition-all ${config.cake_style === style.value ? 'border-rose-400 bg-rose-50 text-rose-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                            <span className="text-2xl">{style.emoji}</span>
                            {style.label}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Candle blow-out message</label>
                <input type="text" value={(config.blowout_message as string) ?? '🎉 Make a wish!'}
                    onChange={e => update('blowout_message', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                    placeholder="🎉 Make a wish!" />
            </div>

            <div className="flex items-center justify-between py-3 border-t border-gray-100">
                <div>
                    <p className="text-sm font-medium text-gray-700">Confetti explosion</p>
                    <p className="text-xs text-gray-400">Trigger confetti after blowing candles</p>
                </div>
                <button onClick={() => update('confetti', !(config.confetti ?? true))}
                    className={`relative w-11 h-6 rounded-full transition-colors ${(config.confetti ?? true) ? 'bg-rose-500' : 'bg-gray-200'}`}
                    role="switch" aria-checked={(config.confetti ?? true) as boolean}>
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${(config.confetti ?? true) ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
            </div>

            <div className="flex items-center justify-between py-3 border-t border-gray-100">
                <div>
                    <p className="text-sm font-medium text-gray-700">Happy Birthday song</p>
                    <p className="text-xs text-gray-400">Plays a short melody on candle blow</p>
                </div>
                <button onClick={() => update('play_song', !(config.play_song ?? false))}
                    className={`relative w-11 h-6 rounded-full transition-colors ${(config.play_song ?? false) ? 'bg-rose-500' : 'bg-gray-200'}`}
                    role="switch" aria-checked={(config.play_song ?? false) as boolean}>
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${(config.play_song ?? false) ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
            </div>
        </div>
    )
}

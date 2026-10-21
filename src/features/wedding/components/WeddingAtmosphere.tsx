import React, { useMemo } from 'react'
import type { ThemeId } from '@/lib/types'

interface Props {
    themeId?: ThemeId
    effectType?: 'petals' | 'marigold' | 'gold-dust' | 'leaves' | 'stars' | 'none'
    intensity?: 'minimal' | 'normal' | 'full'
}

export function WeddingAtmosphere({ themeId = 'romantic-letterbook', effectType, intensity = 'normal' }: Props) {
    if (effectType === 'none' || intensity === 'minimal') return null

    // Choose default particle by theme if not explicitly chosen
    const activeEffect = useMemo(() => {
        if (effectType) return effectType
        if (themeId === 'golden-hour') return 'marigold'
        if (themeId === 'botanical-garden') return 'leaves'
        if (themeId === 'midnight-magic') return 'stars'
        if (themeId === 'minimalist-elegance') return 'gold-dust'
        return 'petals'
    }, [themeId, effectType])

    const particleSymbols = useMemo(() => {
        switch (activeEffect) {
            case 'marigold':
                return ['🌼', '🏵️', '✨', '🪔']
            case 'leaves':
                return ['🌿', '🍃', '🕊️', '✨']
            case 'stars':
                return ['⭐', '✨', '✦', '💫']
            case 'gold-dust':
                return ['✨', '✦', '•']
            case 'petals':
            default:
                return ['🌸', '🌹', '💕', '✨']
        }
    }, [activeEffect])

    // Generate fixed randomized particle positions
    const count = intensity === 'full' ? 18 : 10
    const particles = useMemo(() => {
        return Array.from({ length: count }).map((_, i) => ({
            id: i,
            symbol: particleSymbols[i % particleSymbols.length],
            left: `${(i * 100) / count + (Math.sin(i) * 5)}%`,
            animationDelay: `${(i * 1.3) % 7}s`,
            animationDuration: `${7 + (i % 6) * 1.5}s`,
            fontSize: `${14 + (i % 4) * 5}px`,
            opacity: 0.25 + (i % 3) * 0.2,
        }))
    }, [count, particleSymbols])

    return (
        <div
            className="pointer-events-none fixed inset-0 z-30 overflow-hidden"
            aria-hidden="true"
        >
            {/* Subtle Vignette & Light leak overlay */}
            <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/10 mix-blend-multiply" />

            {/* Falling particles */}
            {particles.map(p => (
                <div
                    key={p.id}
                    className="absolute animate-float-petal select-none"
                    style={{
                        left: p.left,
                        top: '-10%',
                        fontSize: p.fontSize,
                        opacity: p.opacity,
                        animationDelay: p.animationDelay,
                        animationDuration: p.animationDuration,
                    }}
                >
                    {p.symbol}
                </div>
            ))}

            <style>{`
                @keyframes floatPetal {
                    0% {
                        transform: translateY(0) rotate(0deg) translateX(0);
                        opacity: 0;
                    }
                    15% {
                        opacity: 0.7;
                    }
                    50% {
                        transform: translateY(50vh) rotate(180deg) translateX(30px);
                    }
                    85% {
                        opacity: 0.6;
                    }
                    100% {
                        transform: translateY(115vh) rotate(360deg) translateX(-20px);
                        opacity: 0;
                    }
                }
                .animate-float-petal {
                    animation-name: floatPetal;
                    animation-timing-function: linear;
                    animation-iteration-count: infinite;
                }
                @media (prefers-reduced-motion: reduce) {
                    .animate-float-petal {
                        display: none !important;
                    }
                }
            `}</style>
        </div>
    )
}

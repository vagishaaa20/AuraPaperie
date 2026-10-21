/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                serif: ['Playfair Display', 'Georgia', 'serif'],
                handwriting: ['Caveat', 'cursive'],
                display: ['Outfit', 'system-ui', 'sans-serif'],
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'sparkle': 'sparkle 1.5s ease-in-out infinite',
                'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
                'fade-in': 'fadeIn 0.5s ease-out forwards',
                'scale-in': 'scaleIn 0.4s ease-out forwards',
                'wiggle': 'wiggle 0.5s ease-in-out',
                'confetti': 'confetti 1s ease-out forwards',
                'candle-flicker': 'candleFlicker 1.5s ease-in-out infinite',
                'envelope-open': 'envelopeOpen 0.8s ease-out forwards',
                'polaroid-reveal': 'polaroidReveal 0.6s ease-out forwards',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                sparkle: {
                    '0%, 100%': { opacity: '1', transform: 'scale(1)' },
                    '50%': { opacity: '0.5', transform: 'scale(0.8)' },
                },
                fadeInUp: {
                    from: { opacity: '0', transform: 'translateY(24px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                fadeIn: {
                    from: { opacity: '0' },
                    to: { opacity: '1' },
                },
                scaleIn: {
                    from: { opacity: '0', transform: 'scale(0.9)' },
                    to: { opacity: '1', transform: 'scale(1)' },
                },
                wiggle: {
                    '0%, 100%': { transform: 'rotate(-3deg)' },
                    '50%': { transform: 'rotate(3deg)' },
                },
                confetti: {
                    '0%': { transform: 'translateY(-20px) rotate(0deg)', opacity: '1' },
                    '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
                },
                candleFlicker: {
                    '0%, 100%': { transform: 'scaleY(1) scaleX(1)' },
                    '25%': { transform: 'scaleY(1.1) scaleX(0.9)' },
                    '75%': { transform: 'scaleY(0.9) scaleX(1.1)' },
                },
                envelopeOpen: {
                    from: { transform: 'rotateX(0deg)' },
                    to: { transform: 'rotateX(-180deg)' },
                },
                polaroidReveal: {
                    from: { opacity: '0', transform: 'rotateY(90deg)' },
                    to: { opacity: '1', transform: 'rotateY(0deg)' },
                },
            },
            backgroundImage: {
                'paper-texture': "url('data:image/svg+xml,...')",
                'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
            },
            boxShadow: {
                'polaroid': '0 4px 6px -1px rgba(0,0,0,0.3), 0 2px 4px -2px rgba(0,0,0,0.2)',
                'polaroid-hover': '0 20px 25px -5px rgba(0,0,0,0.3), 0 8px 10px -6px rgba(0,0,0,0.2)',
                'paper': '2px 2px 8px rgba(0,0,0,0.15)',
                'glow': '0 0 20px rgba(255,255,255,0.3)',
                'glow-pink': '0 0 30px rgba(244,114,182,0.4)',
                'glow-purple': '0 0 30px rgba(167,139,250,0.4)',
                'glow-gold': '0 0 30px rgba(251,191,36,0.4)',
            },
        },
    },
    plugins: [],
}

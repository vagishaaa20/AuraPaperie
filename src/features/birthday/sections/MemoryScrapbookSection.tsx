import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { PhotoLightbox } from '@/components/PhotoLightbox'
import type { SectionProps } from './SurpriseIntroSection'

export function MemoryScrapbookSection({ section, experience, theme }: SectionProps) {
    const config = section.config as Record<string, unknown>
    const title = (config.title as string) ?? 'Our Memories 📸'
    const subtitle = (config.subtitle as string) ?? 'Every moment with you is a treasure'
    const photos = (config.photos as { url: string; caption?: string; date?: string; location?: string }[]) ?? []
    const isCinematic = theme.style === 'cinematic'
    const layout = theme.photoLayout ?? (isCinematic ? 'filmstrip' : 'polaroid')

    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

    const openLightbox = (index: number) => setLightboxIndex(index)
    const closeLightbox = () => setLightboxIndex(null)
    const nextPhoto = () => setLightboxIndex(prev => prev !== null ? (prev + 1) % photos.length : null)
    const prevPhoto = () => setLightboxIndex(prev => prev !== null ? (prev - 1 + photos.length) % photos.length : null)

    return (
        <section
            className="py-20 px-6 relative overflow-hidden"
            style={{
                background: isCinematic
                    ? 'radial-gradient(ellipse at top, #141126 0%, #090714 100%)'
                    : `linear-gradient(180deg, ${theme.palette.background} 0%, ${theme.palette.surface} 100%)`,
                color: theme.palette.text,
            }}
        >
            {/* Header */}
            <div className="max-w-4xl mx-auto text-center mb-14">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-4xl font-bold mb-3"
                    style={{
                        color: isCinematic ? theme.palette.text : theme.palette.primary,
                        fontFamily: theme.typography.headingFont,
                    }}
                >
                    {title}
                </motion.h2>
                {subtitle && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-sm md:text-base max-w-lg mx-auto"
                        style={{ color: theme.palette.textMuted, fontFamily: theme.typography.bodyFont }}
                    >
                        {subtitle}
                    </motion.p>
                )}
            </div>

            {photos.length === 0 ? (
                <div
                    className="max-w-md mx-auto text-center py-12 px-6 rounded-3xl border-2 border-dashed"
                    style={{
                        borderColor: `${theme.palette.primary}40`,
                        background: `${theme.palette.surface}60`,
                    }}
                >
                    <p className="text-4xl mb-3">📷</p>
                    <p className="text-sm font-medium" style={{ color: theme.palette.textMuted }}>
                        No photographs added yet. Open the editor to add your favorite memories!
                    </p>
                </div>
            ) : (
                <div className="max-w-6xl mx-auto">
                    {/* Masonry / Scattered Collage */}
                    <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
                        {photos.map((photo, i) => {
                            const rotation = (i % 5 === 0 ? -3 : i % 5 === 1 ? 2 : i % 5 === 2 ? -1.5 : i % 5 === 3 ? 3 : -2)

                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30, rotate: rotation }}
                                    whileInView={{ opacity: 1, y: 0, rotate: layout === 'polaroid' ? rotation : 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.08, duration: 0.5 }}
                                    whileHover={{ scale: 1.05, rotate: 0, zIndex: 20 }}
                                    onClick={() => openLightbox(i)}
                                    className={`relative cursor-pointer transition-shadow group ${
                                        layout === 'polaroid'
                                            ? 'bg-white p-3 pb-8 rounded-sm shadow-xl'
                                            : 'rounded-2xl overflow-hidden shadow-lg p-2 border'
                                    }`}
                                    style={{
                                        borderColor: isCinematic ? `${theme.palette.border}` : `${theme.palette.border}`,
                                        backgroundColor: layout === 'polaroid' ? '#ffffff' : theme.palette.surface,
                                    }}
                                >
                                    {/* Washi Tape for Scrapbook Themes */}
                                    {layout === 'polaroid' && !isCinematic && (
                                        <div
                                            className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 opacity-80 shadow-xs z-10"
                                            style={{
                                                background: `${theme.palette.primary}50`,
                                                clipPath: 'polygon(5% 0%, 95% 0%, 100% 100%, 0% 100%)',
                                            }}
                                        />
                                    )}

                                    {/* Photo Image */}
                                    <div className="overflow-hidden rounded-xs w-48 h-48 sm:w-56 sm:h-56 bg-gray-100 flex items-center justify-center">
                                        <img
                                            src={photo.url}
                                            alt={photo.caption ?? `Memory #${i + 1}`}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                    </div>

                                    {/* Caption */}
                                    {photo.caption && (
                                        <p
                                            className="mt-3 text-center text-xs sm:text-sm px-1 truncate max-w-[220px]"
                                            style={{
                                                fontFamily: layout === 'polaroid' ? theme.typography.accentFont : theme.typography.bodyFont,
                                                color: layout === 'polaroid' ? '#374151' : theme.palette.text,
                                            }}
                                        >
                                            {photo.caption}
                                        </p>
                                    )}
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Lightbox Modal */}
            {lightboxIndex !== null && (
                <PhotoLightbox
                    photos={photos}
                    currentIndex={lightboxIndex}
                    onClose={closeLightbox}
                    onNext={nextPhoto}
                    onPrev={prevPhoto}
                    themePrimary={theme.palette.primary}
                    fontFamily={theme.typography.bodyFont}
                />
            )}
        </section>
    )
}

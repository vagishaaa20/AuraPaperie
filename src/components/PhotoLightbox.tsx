import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Calendar, MapPin } from 'lucide-react'

export interface LightboxPhoto {
    url: string
    caption?: string
    date?: string
    location?: string
}

interface LightboxProps {
    photos: LightboxPhoto[]
    currentIndex: number
    onClose: () => void
    onNext: () => void
    onPrev: () => void
    themePrimary?: string
    fontFamily?: string
}

export function PhotoLightbox({
    photos,
    currentIndex,
    onClose,
    onNext,
    onPrev,
    themePrimary = '#e11d48',
    fontFamily = 'inherit',
}: LightboxProps) {
    const current = photos[currentIndex]
    if (!current) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-8"
                onClick={e => { if (e.target === e.currentTarget) onClose() }}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 text-white/70 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50 cursor-pointer"
                    aria-label="Close Lightbox"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Left Arrow */}
                {photos.length > 1 && (
                    <button
                        onClick={onPrev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50 cursor-pointer"
                        aria-label="Previous Photo"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                )}

                {/* Photo & Caption Container */}
                <motion.div
                    key={currentIndex}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="max-w-4xl max-h-[85vh] flex flex-col items-center select-none"
                    style={{ fontFamily }}
                >
                    <img
                        src={current.url}
                        alt={current.caption || 'Memory photo'}
                        className="max-h-[70vh] max-w-full rounded-2xl object-contain shadow-2xl"
                    />

                    {(current.caption || current.date || current.location) && (
                        <div className="mt-4 text-center max-w-xl px-4 text-white">
                            {current.caption && (
                                <p className="text-base sm:text-lg font-medium drop-shadow-sm mb-1">
                                    {current.caption}
                                </p>
                            )}
                            <div className="flex items-center justify-center gap-4 text-xs text-white/70">
                                {current.date && (
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {current.date}
                                    </span>
                                )}
                                {current.location && (
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-3.5 h-3.5" />
                                        {current.location}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="mt-2 text-xs font-mono text-white/50">
                        {currentIndex + 1} / {photos.length}
                    </div>
                </motion.div>

                {/* Right Arrow */}
                {photos.length > 1 && (
                    <button
                        onClick={onNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50 cursor-pointer"
                        aria-label="Next Photo"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                )}
            </motion.div>
        </AnimatePresence>
    )
}

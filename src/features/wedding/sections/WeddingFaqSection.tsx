import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HelpCircle, ChevronDown } from 'lucide-react'
import type { SectionProps } from '../../birthday/sections/SurpriseIntroSection'

interface FaqItem {
    id: string
    question: string
    answer: string
}

export function WeddingFaqSection({ section, theme }: SectionProps) {
    const config = (section.config || {}) as Record<string, unknown>
    const title = (config.title as string) ?? 'Frequently Asked Questions'
    const subtitle = (config.subtitle as string) ?? 'Everything you need to know about celebrating with us'
    const faqs = (config.faqs as FaqItem[]) ?? [
        {
            id: '1',
            question: 'Can I bring a plus one or additional guest?',
            answer: 'Due to venue capacity, we can only accommodate guests formally listed on your invitation and RSVP options. If you have questions, please reach out to us!',
        },
        {
            id: '2',
            question: 'Are children invited?',
            answer: 'We love your little ones! However, unless specifically mentioned on your invitation, our evening celebrations and reception will be an adults-only affair so parents can enjoy an evening of dancing.',
        },
        {
            id: '3',
            question: 'Is there a gift registry?',
            answer: 'Your presence and blessings at our wedding are truly the greatest gift! If you wish to honor us with a token of love, a contribution toward our honeymoon fund would be deeply appreciated.',
        },
        {
            id: '4',
            question: 'Can I take photos during the ceremony?',
            answer: 'We kindly request an unplugged ceremony during the sacred vows so everyone can be fully present. Our professional photographers will capture every angle! Feel free to click pictures during the reception.',
        },
    ]

    const [openIndex, setOpenIndex] = useState<number | null>(0)
    const isCinematic = theme.style === 'cinematic'

    return (
        <section
            className="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden"
            style={{
                background: isCinematic ? '#0e0d18' : 'transparent',
                fontFamily: theme.typography.bodyFont,
            }}
        >
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-10">
                    <span
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2"
                        style={{ background: theme.previewGradient, color: '#fff' }}
                    >
                        <HelpCircle className="w-3.5 h-3.5" />
                        Guest Info
                    </span>
                    <h2
                        className="text-2xl sm:text-3xl font-extrabold"
                        style={{
                            fontFamily: theme.typography.headingFont,
                            color: isCinematic ? '#fff' : theme.palette.text || '#1e1b4b',
                        }}
                    >
                        {title}
                    </h2>
                    {subtitle && <p className="text-xs sm:text-sm text-gray-500 mt-1">{subtitle}</p>}
                </div>

                <div className="space-y-3">
                    {faqs.map((faq, idx) => {
                        const isOpen = openIndex === idx
                        return (
                            <motion.div
                                key={faq.id || idx}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="rounded-2xl border overflow-hidden shadow-xs transition-all"
                                style={{
                                    background: isCinematic ? 'rgba(255,255,255,0.03)' : '#ffffff',
                                    borderColor: isOpen ? theme.palette.primary : '#e2e8f0',
                                }}
                            >
                                <button
                                    type="button"
                                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                                    className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-3 cursor-pointer"
                                >
                                    <span
                                        className="text-sm sm:text-base font-bold"
                                        style={{ color: isCinematic ? '#fff' : '#1e293b' }}
                                    >
                                        {faq.question}
                                    </span>
                                    <ChevronDown
                                        className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-300 ${
                                            isOpen ? 'rotate-180 text-rose-500' : ''
                                        }`}
                                    />
                                </button>
                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <div
                                                className="px-4 pb-5 sm:px-5 sm:pb-6 text-xs sm:text-sm leading-relaxed border-t border-gray-100 pt-3"
                                                style={{ color: isCinematic ? '#cbd5e1' : '#64748b' }}
                                            >
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

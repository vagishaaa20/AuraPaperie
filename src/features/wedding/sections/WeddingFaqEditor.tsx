import React from 'react'
import type { SectionConfig, BirthdayExperience } from '@/lib/types'
import { HelpCircle, Plus, Trash2 } from 'lucide-react'
import { generateId } from '@/lib/utils'

interface Props {
    section: SectionConfig
    experience: BirthdayExperience
    config: Record<string, unknown>
    onChange: (config: Record<string, unknown>) => void
}

interface FaqItem {
    id: string
    question: string
    answer: string
}

export default function WeddingFaqEditor({ config, onChange }: Props) {
    const update = (key: string, val: unknown) => {
        onChange({ ...config, [key]: val })
    }

    const faqs: FaqItem[] = (config.faqs as FaqItem[]) ?? [
        {
            id: generateId(),
            question: 'Can I bring a plus one?',
            answer: 'Due to limited venue capacity, we can only accommodate guests named on the invitation.',
        },
        {
            id: generateId(),
            question: 'Are kids invited?',
            answer: 'Our reception is an adults-only celebration so all guests can relax and enjoy the evening.',
        },
    ]

    const handleAdd = () => {
        const next: FaqItem = {
            id: generateId(),
            question: 'New Question',
            answer: 'Answer goes here...',
        }
        update('faqs', [...faqs, next])
    }

    const handleUpdate = (id: string, field: 'question' | 'answer', val: string) => {
        update(
            'faqs',
            faqs.map(f => (f.id === id ? { ...f, [field]: val } : f))
        )
    }

    const handleDelete = (id: string) => {
        update('faqs', faqs.filter(f => f.id !== id))
    }

    return (
        <div className="p-6 space-y-6 max-w-xl mx-auto">
            <div>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-rose-500" />
                    Frequently Asked Questions (FAQ)
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                    Answer common guest questions regarding kids, gifts, plus-ones, and timings.
                </p>
            </div>

            <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Section Title</label>
                <input
                    type="text"
                    value={(config.title as string) ?? 'Frequently Asked Questions'}
                    onChange={e => update('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none"
                />
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-gray-700">Questions & Answers ({faqs.length})</label>
                    <button
                        type="button"
                        onClick={handleAdd}
                        className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        Add Question
                    </button>
                </div>

                {faqs.map((faq, idx) => (
                    <div key={faq.id} className="p-4 rounded-2xl border border-gray-200 bg-gray-50/60 space-y-2 relative group">
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Q{idx + 1}</span>
                            <button
                                type="button"
                                onClick={() => handleDelete(faq.id)}
                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                aria-label="Delete question"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                        <input
                            type="text"
                            value={faq.question}
                            onChange={e => handleUpdate(faq.id, 'question', e.target.value)}
                            placeholder="Question..."
                            className="w-full px-3 py-1.5 border border-gray-200 bg-white rounded-lg text-xs font-bold focus:outline-none focus:ring-1 focus:ring-rose-400"
                        />
                        <textarea
                            rows={2}
                            value={faq.answer}
                            onChange={e => handleUpdate(faq.id, 'answer', e.target.value)}
                            placeholder="Answer..."
                            className="w-full px-3 py-1.5 border border-gray-200 bg-white rounded-lg text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-rose-400"
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

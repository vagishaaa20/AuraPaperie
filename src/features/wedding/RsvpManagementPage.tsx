import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, CheckCircle, XCircle, ArrowLeft, Download, Mail, Phone, Calendar } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { fetchWeddingRsvps } from '@/lib/project-helpers'
import type { BirthdayExperience, WeddingRsvpSubmission } from '@/lib/types'
import toast from 'react-hot-toast'

export default function RsvpManagementPage() {
    const { experienceId } = useParams<{ experienceId: string }>()
    const [experience, setExperience] = useState<BirthdayExperience | null>(null)
    const [rsvps, setRsvps] = useState<WeddingRsvpSubmission[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<'all' | 'attending' | 'declined'>('all')

    useEffect(() => {
        if (!experienceId) return

        Promise.all([
            supabase.from('birthday_experiences').select('*').eq('id', experienceId).single(),
            fetchWeddingRsvps(experienceId),
        ]).then(([expRes, rsvpsList]) => {
            if (expRes.data) setExperience(expRes.data)
            if (rsvpsList) setRsvps(rsvpsList)
            setLoading(false)
        })
    }, [experienceId])

    const totalAttending = rsvps
        .filter(r => r.attendance === 'attending')
        .reduce((sum, r) => sum + (r.guest_count || 1), 0)

    const totalDeclined = rsvps.filter(r => r.attendance === 'declined').length

    const filtered = rsvps.filter(r => {
        if (filter === 'all') return true
        return r.attendance === filter
    })

    const exportCsv = () => {
        if (rsvps.length === 0) return
        const headers = ['Guest Name', 'Attendance', 'Guest Count', 'Email', 'Phone', 'Dietary Notes', 'Message', 'Date']
        const rows = rsvps.map(r => [
            `"${r.guest_name.replace(/"/g, '""')}"`,
            r.attendance,
            r.guest_count,
            `"${(r.email || '').replace(/"/g, '""')}"`,
            `"${(r.phone || '').replace(/"/g, '""')}"`,
            `"${(r.dietary_notes || '').replace(/"/g, '""')}"`,
            `"${(r.message || '').replace(/"/g, '""')}"`,
            new Date(r.created_at).toLocaleDateString(),
        ])
        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
        const encodedUri = encodeURI(csvContent)
        const link = document.createElement('a')
        link.setAttribute('href', encodedUri)
        link.setAttribute('download', `rsvps-${experience?.slug || 'wedding'}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-8">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link
                            to="/dashboard"
                            className="p-2.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-100 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </Link>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                                Guest RSVPs & Attendance
                            </h1>
                            <p className="text-sm text-gray-500">
                                {experience?.title || 'Wedding Invitation Guestbook'}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={exportCsv}
                        disabled={rsvps.length === 0}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 font-bold text-xs shadow-xs hover:bg-gray-50 cursor-pointer disabled:opacity-40"
                    >
                        <Download className="w-4 h-4" />
                        <span>Export CSV</span>
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Responses</p>
                        <p className="text-3xl font-extrabold text-gray-900 mt-2">{rsvps.length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">Guests Attending</p>
                        <p className="text-3xl font-extrabold text-emerald-600 mt-2">{totalAttending}</p>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <p className="text-xs font-bold uppercase tracking-wider text-rose-500">Regretfully Declined</p>
                        <p className="text-3xl font-extrabold text-rose-500 mt-2">{totalDeclined}</p>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 border-b pb-4">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                            filter === 'all' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        All ({rsvps.length})
                    </button>
                    <button
                        onClick={() => setFilter('attending')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                            filter === 'attending' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        Attending ({rsvps.filter(r => r.attendance === 'attending').length})
                    </button>
                    <button
                        onClick={() => setFilter('declined')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                            filter === 'declined' ? 'bg-rose-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        Declined ({totalDeclined})
                    </button>
                </div>

                {/* Submissions List */}
                <div className="space-y-3">
                    {filtered.length === 0 ? (
                        <div className="bg-white rounded-3xl p-12 text-center border border-gray-200">
                            <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                            <p className="text-sm font-semibold text-gray-500">No RSVP responses in this view yet.</p>
                        </div>
                    ) : (
                        filtered.map(rsvp => (
                            <div
                                key={rsvp.id}
                                className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                            >
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-base text-gray-900">{rsvp.guest_name}</h3>
                                        <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                                            rsvp.attendance === 'attending' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                                        }`}>
                                            {rsvp.attendance === 'attending' ? `Attending (${rsvp.guest_count} guests)` : 'Declined'}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap gap-4 text-xs text-gray-400 pt-1">
                                        {rsvp.email && (
                                            <span className="flex items-center gap-1">
                                                <Mail className="w-3.5 h-3.5" />
                                                {rsvp.email}
                                            </span>
                                        )}
                                        {rsvp.phone && (
                                            <span className="flex items-center gap-1">
                                                <Phone className="w-3.5 h-3.5" />
                                                {rsvp.phone}
                                            </span>
                                        )}
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {new Date(rsvp.created_at).toLocaleDateString()}
                                        </span>
                                    </div>

                                    {rsvp.dietary_notes && (
                                        <p className="text-xs text-amber-700 bg-amber-50 inline-block px-2 py-0.5 rounded-md mt-1">
                                            Dietary: {rsvp.dietary_notes}
                                        </p>
                                    )}

                                    {rsvp.message && (
                                        <p className="text-xs sm:text-sm text-gray-600 italic pt-2">
                                            "{rsvp.message}"
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

/**
 * Helper to generate Google Calendar links and downloadable .ics files
 * for wedding events.
 */

export interface CalendarEventDetails {
    title: string
    description?: string
    location?: string
    startDateStr?: string
    startTimeStr?: string
    endDateStr?: string
    endTimeStr?: string
}

function parseDateTimeToISO(dateStr?: string, timeStr?: string): Date {
    if (!dateStr) return new Date()
    try {
        const cleanedDate = dateStr.replace(/,/g, '')
        const combined = timeStr ? `${cleanedDate} ${timeStr}` : cleanedDate
        const d = new Date(combined)
        if (!isNaN(d.getTime())) return d
    } catch {}
    return new Date()
}

function formatToICSDate(date: Date): string {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
}

/**
 * Generate a direct Google Calendar add event URL
 */
export function generateGoogleCalendarUrl(event: CalendarEventDetails): string {
    const start = parseDateTimeToISO(event.startDateStr, event.startTimeStr)
    // Default 3 hours if no end time
    const end = event.endDateStr ? parseDateTimeToISO(event.endDateStr, event.endTimeStr) : new Date(start.getTime() + 3 * 3600 * 1000)

    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: event.title,
        dates: `${formatToICSDate(start)}/${formatToICSDate(end)}`,
        details: event.description || '',
        location: event.location || '',
    })

    return `https://calendar.google.com/calendar/render?${params.toString()}`
}

/**
 * Trigger download of an iCalendar (.ics) file
 */
export function downloadIcsFile(event: CalendarEventDetails) {
    const start = parseDateTimeToISO(event.startDateStr, event.startTimeStr)
    const end = event.endDateStr ? parseDateTimeToISO(event.endDateStr, event.endTimeStr) : new Date(start.getTime() + 3 * 3600 * 1000)

    const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Celebrations Studio//Wedding Invitation//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        `SUMMARY:${event.title}`,
        `DESCRIPTION:${(event.description || '').replace(/\n/g, '\\n')}`,
        `LOCATION:${(event.location || '').replace(/\n/g, '\\n')}`,
        `DTSTART:${formatToICSDate(start)}`,
        `DTEND:${formatToICSDate(end)}`,
        `DTSTAMP:${formatToICSDate(new Date())}`,
        `UID:${Math.random().toString(36).slice(2)}@celebrations.wedding`,
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR',
    ].join('\r\n')

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${event.title.replace(/\s+/g, '_')}.ics`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
}

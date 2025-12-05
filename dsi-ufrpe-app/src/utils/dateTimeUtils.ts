// Date formatting utilities
export function formatDate(date: string | Date, format: string = 'DD/MM/YYYY'): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return '-';

    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');

    const formats: Record<string, string> = {
        'DD/MM/YYYY': `${day}/${month}/${year}`,
        'DD/MM/YYYY HH:mm': `${day}/${month}/${year} ${hours}:${minutes}`,
        'YYYY-MM-DD': `${year}-${month}-${day}`,
        'MMM DD, YYYY': dateObj.toLocaleDateString('pt-BR'),
    };

    return formats[format] || formats['DD/MM/YYYY'];
}

// Get date difference
export function getDateDifference(
    startDate: string | Date,
    endDate: string | Date = new Date()
): { days: number; hours: number; minutes: number } {
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

    const diffMs = Math.abs(end.getTime() - start.getTime());
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return { days, hours, minutes };
}

// Check if date is today
export function isToday(date: string | Date): boolean {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const today = new Date();
    return (
        dateObj.getDate() === today.getDate() &&
        dateObj.getMonth() === today.getMonth() &&
        dateObj.getFullYear() === today.getFullYear()
    );
}

// Check if date is in the past
export function isPastDate(date: string | Date): boolean {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.getTime() < new Date().getTime();
}

// Check if date is in the future
export function isFutureDate(date: string | Date): boolean {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.getTime() > new Date().getTime();
}

// Get formatted relative time (e.g., "2 days ago")
export function getRelativeTime(date: string | Date): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) return 'Agora mesmo';
    if (diffMinutes < 60) return `${diffMinutes} minuto${diffMinutes > 1 ? 's' : ''} atrás`;
    if (diffHours < 24) return `${diffHours} hora${diffHours > 1 ? 's' : ''} atrás`;
    if (diffDays < 30) return `${diffDays} dia${diffDays > 1 ? 's' : ''} atrás`;

    return formatDate(dateObj, 'DD/MM/YYYY');
}

// Add days to date
export function addDays(date: string | Date, days: number): Date {
    const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);
    dateObj.setDate(dateObj.getDate() + days);
    return dateObj;
}

// Get start of day
export function getStartOfDay(date: string | Date = new Date()): Date {
    const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);
    dateObj.setHours(0, 0, 0, 0);
    return dateObj;
}

// Get end of day
export function getEndOfDay(date: string | Date = new Date()): Date {
    const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);
    dateObj.setHours(23, 59, 59, 999);
    return dateObj;
}

// Check if date is within range
export function isDateInRange(
    date: string | Date,
    startDate: string | Date,
    endDate: string | Date
): boolean {
    const dateTime = (typeof date === 'string' ? new Date(date) : date).getTime();
    const startTime = (typeof startDate === 'string' ? new Date(startDate) : startDate).getTime();
    const endTime = (typeof endDate === 'string' ? new Date(endDate) : endDate).getTime();

    return dateTime >= startTime && dateTime <= endTime;
}

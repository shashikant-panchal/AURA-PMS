import { format, addDays, parseISO, differenceInCalendarDays, isWithinInterval, startOfDay } from 'date-fns';

export function getTodayStr(): string {
  // Use today's calendar date
  return format(new Date(), 'yyyy-MM-dd');
}

export function formatDateEditorial(dateStr: string): string {
  try {
    const d = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
    return format(d, 'dd MMM yyyy');
  } catch {
    return dateStr;
  }
}

export function formatDateShort(dateStr: string): string {
  try {
    const d = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
    return format(d, 'dd MMM');
  } catch {
    return dateStr;
  }
}

export function formatDateDayOfWeek(dateStr: string): string {
  try {
    const d = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
    return format(d, 'EEE');
  } catch {
    return '';
  }
}

export function calculateNights(checkIn: string, checkOut: string): number {
  try {
    const d1 = parseISO(checkIn);
    const d2 = parseISO(checkOut);
    const diff = differenceInCalendarDays(d2, d1);
    return diff > 0 ? diff : 1;
  } catch {
    return 1;
  }
}

export function generateDateTimeline(startDate: Date, totalDays: number = 21): { dateStr: string; dayNumber: string; dayName: string; isWeekend: boolean; isToday: boolean }[] {
  const dates = [];
  const todayStr = getTodayStr();

  for (let i = 0; i < totalDays; i++) {
    const current = addDays(startDate, i);
    const dateStr = format(current, 'yyyy-MM-dd');
    const dayName = format(current, 'EEE');
    const dayNumber = format(current, 'dd');
    const dayOfWeek = current.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isToday = dateStr === todayStr;

    dates.push({
      dateStr,
      dayNumber,
      dayName,
      isWeekend,
      isToday,
    });
  }

  return dates;
}

export function isDateInSpan(dateStr: string, checkIn: string, checkOut: string): boolean {
  // A night occupies from checkIn up to (checkOut - 1 day)
  return dateStr >= checkIn && dateStr < checkOut;
}


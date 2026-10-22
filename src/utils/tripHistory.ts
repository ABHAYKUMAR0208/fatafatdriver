import type {TripHistoryItem} from '@/state/tripHistoryStore';

// "2:45 PM"
export function formatTripTime(iso: string) {
  const d = new Date(iso);
  const h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${h % 12 || 12}:${m} ${h < 12 ? 'AM' : 'PM'}`;
}

// "4.2 km"
export function formatKm(km: number) {
  return `${km.toFixed(1)} km`;
}

function dayStart(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export type TripSection = {
  key: string; // local date, e.g. "2026-10-21"
  date: Date;
  trips: TripHistoryItem[];
};

// Newest first, one section per calendar day (phone's local time).
export function groupByDay(trips: TripHistoryItem[]): TripSection[] {
  const sorted = [...trips].sort(
    (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
  );
  const sections: TripSection[] = [];
  for (const trip of sorted) {
    const date = dayStart(new Date(trip.startedAt));
    const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    const last = sections[sections.length - 1];
    if (last && last.key === key) {
      last.trips.push(trip);
    } else {
      sections.push({key, date, trips: [trip]});
    }
  }
  return sections;
}

type TitleText = {
  today: string;
  yesterday: string;
  weekdays: string[]; // Sunday first
  months: string[]; // Jan first
};

// "YESTERDAY", "TODAY", or "MONDAY, OCT 23" for older days
export function sectionTitle(date: Date, now: Date, text: TitleText) {
  const diffDays = Math.round(
    (dayStart(now).getTime() - date.getTime()) / (24 * 60 * 60 * 1000),
  );
  if (diffDays === 0) {
    return text.today.toUpperCase();
  }
  if (diffDays === 1) {
    return text.yesterday.toUpperCase();
  }
  return `${text.weekdays[date.getDay()]}, ${text.months[date.getMonth()]} ${date.getDate()}`.toUpperCase();
}

// Search box: matches the pickup or the drop location
export function matchesSearch(trip: TripHistoryItem, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) {
    return true;
  }
  return trip.pickup.toLowerCase().includes(q) || trip.drop.toLowerCase().includes(q);
}

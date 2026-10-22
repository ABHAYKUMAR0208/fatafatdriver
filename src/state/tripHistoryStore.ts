import {useEffect, useState} from 'react';

export type TripVehicle = 'car' | 'auto';

export type TripHistoryItem = {
  id: string;
  vehicle: TripVehicle; // decides the icon
  name: string; // ride type shown on the card, e.g. "Premium Cab"
  startedAt: string; // ISO date-time
  distanceKm: number;
  fare: number; // rupees (a cancelled trip shows the fare that was quoted)
  status: 'completed' | 'cancelled';
  pickup: string;
  drop: string;
};

// A moment `daysAgo` days back at hh:mm, so the sample data always looks recent.
function at(daysAgo: number, hour: number, minute: number) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

// TODO: call your API here (e.g. GET /driver/trips) and return the data.
// Right now it returns the sample trips from the design so the screen is not empty.
export async function fetchTripHistory(): Promise<TripHistoryItem[]> {
  return [
    {
      id: 't1',
      vehicle: 'car',
      name: 'Premium Cab',
      startedAt: at(1, 14, 45),
      distanceKm: 4.2,
      fare: 345.5,
      status: 'completed',
      pickup: 'Connaught Place, Block A',
      drop: 'Indira Gandhi International Airport T3',
    },
    {
      id: 't2',
      vehicle: 'auto',
      name: 'Auto',
      startedAt: at(1, 9, 15),
      distanceKm: 1.8,
      fare: 85,
      status: 'cancelled',
      pickup: 'South Ex Part 2, Market',
      drop: 'Lajpat Nagar Metro Station',
    },
    {
      id: 't3',
      vehicle: 'car',
      name: 'Economy Cab',
      startedAt: at(4, 18, 30),
      distanceKm: 12.5,
      fare: 520,
      status: 'completed',
      pickup: 'Cyber City, Gurugram',
      drop: 'Hauz Khas Village',
    },
  ];
}

export type TripHistoryState = {
  loading: boolean;
  failed: boolean;
  trips: TripHistoryItem[];
  reload: () => void;
};

export function useTripHistory(): TripHistoryState {
  const [trips, setTrips] = useState<TripHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setFailed(false);
    fetchTripHistory()
      .then(res => {
        if (alive) {
          setTrips(res);
          setLoading(false);
        }
      })
      .catch(() => {
        if (alive) {
          setFailed(true);
          setLoading(false);
        }
      });
    return () => {
      alive = false;
    };
  }, [tick]);

  return {loading, failed, trips, reload: () => setTick(t => t + 1)};
}

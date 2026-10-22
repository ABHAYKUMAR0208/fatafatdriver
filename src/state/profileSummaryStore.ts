import {useEffect, useState} from 'react';
import {useDriverProfile} from '@/state/driverProfileStore';
import {useRiderProfile} from '@/state/riderProfileStore';
import {useProfilePhoto} from '@/state/profilePhotoStore';

// What the Profile screen shows at the top. All of it comes from the backend.
export type ProfileSummary = {
  name: string;
  photoUrl?: string;
  totalTrips: number;
  weekEarnings: number; // rupees earned this week
};

// TODO: call your API here (e.g. GET /driver/profile-summary) and return the data.
// Right now it returns the sample values from the design so the screen is not empty.
export async function fetchProfileSummary(): Promise<ProfileSummary> {
  return {
    name: 'Marcus J. Chen',
    photoUrl: undefined,
    totalTrips: 2400,
    weekEarnings: 12400,
  };
}

// 2400 -> "2.4k", 12400 -> "12.4k", 850 -> "850"
export function compactNumber(n: number): string {
  if (n >= 1000) {
    const k = Math.round(n / 100) / 10;
    return `${Number.isInteger(k) ? k.toFixed(0) : k.toFixed(1)}k`;
  }
  return String(n);
}

export type ProfileSummaryState = {
  loading: boolean;
  failed: boolean;
  name: string;
  photoUri?: string;
  totalTrips?: number;
  weekEarnings?: number;
  reload: () => void;
};

// Used by the Profile screen.
// While loading (or if the call fails) the name / photo of the signed-in user
// saved on this phone are used, and the numbers stay empty ("--").
export function useProfileSummary(): ProfileSummaryState {
  const driver = useDriverProfile();
  const rider = useRiderProfile();
  const localPhoto = useProfilePhoto();
  const [data, setData] = useState<ProfileSummary | undefined>();
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setFailed(false);
    fetchProfileSummary()
      .then(res => {
        if (alive) {
          setData(res);
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

  return {
    loading,
    failed,
    name: data?.name || driver.name || rider.name || '',
    photoUri: data?.photoUrl ?? localPhoto,
    totalTrips: data?.totalTrips,
    weekEarnings: data?.weekEarnings,
    reload: () => setTick(t => t + 1),
  };
}
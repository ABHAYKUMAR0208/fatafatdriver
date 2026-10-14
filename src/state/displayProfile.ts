import {useDriverProfile} from '@/state/driverProfileStore';
import {useRiderProfile} from '@/state/riderProfileStore';

// Who is signed in: used in the Home header ("Driver" / "Rohan").
// TODO: take both from your API once the backend is connected.
export function useDisplayProfile(): {role: string; name: string} {
  const driver = useDriverProfile();
  const rider = useRiderProfile();

  if (driver.name) {
    return {role: 'Driver', name: driver.name.split(' ')[0]};
  }
  if (rider.name) {
    return {role: 'Rider', name: rider.name.split(' ')[0]};
  }
  return {role: 'Driver', name: 'Partner'};
}
import {useSyncExternalStore} from 'react';
import type {VehicleId} from '@/constants/vehicles';

export type RiderProfile = {
  // Personal Details
  photoUri?: string;
  name: string;
  email: string;
  phone: string; // 10 digits
  dobDigits: string; // "12312027"
  gender?: string;
  // Vehicle Details
  vehicle?: VehicleId;
  vehicleType?: string;
  vehicleNumber: string;
  model: string;
  colour?: string;
  year?: string;
  // Bank (filled later by the payout screen)
  bank?: string;
  account?: string;
};

// Starts empty. TODO: load the real profile from your API.
let profile: RiderProfile = {
  name: '',
  email: '',
  phone: '',
  dobDigits: '',
  vehicleNumber: '',
  model: '',
};

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function setRiderProfile(patch: Partial<RiderProfile>) {
  profile = {...profile, ...patch};
  listeners.forEach(l => l());
}

export function useRiderProfile() {
  return useSyncExternalStore(subscribe, () => profile);
}
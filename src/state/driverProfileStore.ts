import {useSyncExternalStore} from 'react';

export type DriverProfile = {
  name: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  experience?: string;
  license?: string;
  vehicles: string[];
  transmission: string[];
  bank?: string;
  account?: string;
};

// Starting values match the design. TODO: load the real profile from your API.
let profile: DriverProfile = {
  name: '',
  email: '',
  phone: '',
  city: '',
  address: '',
  experience: '3-5 yrs',
  license: 'LMV (Light Motor Vehicle)',
  vehicles: ['sedan', 'suv'],
  transmission: ['manual'],
};

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function setDriverProfile(patch: Partial<DriverProfile>) {
  profile = {...profile, ...patch};
  listeners.forEach(l => l());
}

export function useDriverProfile() {
  return useSyncExternalStore(subscribe, () => profile);
}
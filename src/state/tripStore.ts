import {useSyncExternalStore} from 'react';

export type TripStop = {
  title: string;
  address: string;
};

export type TripRider = {
  name: string;
  rating: number;
  trips: number;
  phone: string;
  photoUri?: string;
};

export type Trip = {
  id: string;
  fare: number;
  payment: 'cash' | 'online';
  distanceKm: number;
  durationMin: number;
  pickupDistanceKm: number;
  pickupEtaMin: number;
  rider: TripRider;
  pickup: TripStop;
  drop: TripStop;
  // two-wheeler trips go through the helmet check before starting
  needsHelmetCheck: boolean;
  // Pink Scooty trips also need the rider identity check
  needsIdentityCheck: boolean;
  surge?: number;
};

// Turn-by-turn instruction shown in the navigation banner.
// TODO: take these from your navigation SDK.
export type NavStep = {instruction: string; detail: string};

export const PICKUP_STEP: NavStep = {
  instruction: 'Turn right on Market St',
  detail: 'In 500 ft • 1 min',
};

export const DROP_STEP: NavStep = {
  instruction: '0.8 km',
  detail: 'Continue on Market St',
};

// Seconds the rider / driver has to accept a request.
export const ACCEPT_SECONDS = 10;

// Sample request so the whole flow can be tried. Values match the design.
// TODO: receive trip requests from your API (socket / push notification).
const SAMPLE_TRIP: Trip = {
  id: 'TRP-4521',
  fare: 245,
  payment: 'cash',
  distanceKm: 4.2,
  durationMin: 12,
  pickupDistanceKm: 1.2,
  pickupEtaMin: 4,
  rider: {name: 'Priya S.', rating: 4.8, trips: 248, phone: '+919876543210'},
  pickup: {title: 'HSR Layout', address: '27th Main Road, Sector 2'},
  drop: {title: 'Indiranagar', address: '100 Feet Road'},
  needsHelmetCheck: true,
  needsIdentityCheck: true,
  surge: 1.5,
};

let trip: Trip | undefined;

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function setTrip(next: Trip | undefined) {
  trip = next;
  listeners.forEach(l => l());
}

// A new request came in: it becomes the current trip until it is declined,
// cancelled or completed.
export function receiveTripRequest(next: Trip = SAMPLE_TRIP) {
  setTrip(next);
}

export function clearTrip() {
  setTrip(undefined);
}

// The current trip. Falls back to the sample so a screen opened on its own
// (e.g. while testing) still has data to show.
export function useTrip(): Trip {
  return useSyncExternalStore(subscribe, () => trip) ?? SAMPLE_TRIP;
}

// TODO: replace with the real fare split from your API once the trip ends.
export function tripEarnings(t: Trip) {
  return {earned: Math.round(t.fare * 0.857), base: t.fare, minutes: 18};
}

import {useSyncExternalStore} from 'react';
import type {VehicleId} from '@/constants/vehicles';

// ---------- Parcel delivery ----------

export type ParcelStop = {
  id: string;
  recipient: string;
  phone: string;
  place: string; // short name shown in lists, e.g. "ISBT Kashmere Gate"
  address: string;
  packageSize: 'small' | 'medium' | 'large';
  weightKg: number;
  note?: string;
  // minutes added by this stop compared to the previous one
  extraMin?: number;
  cod?: number; // cash to collect, in rupees
  done: boolean;
};

export type Delivery = {
  id: string;
  orderNo: string;
  fare: number;
  distanceKm: number;
  durationMin: number;
  pickupAddress: string;
  stops: ParcelStop[];
};

// ---------- Carpool ----------

export type PassengerStatus = 'upcoming' | 'arrived' | 'boarded';

export type CarpoolPassenger = {
  id: string;
  name: string;
  pickup: string;
  share: number; // this passenger's part of the fare, in rupees
  photoUri?: string;
  status: PassengerStatus;
};

export type Carpool = {
  id: string;
  fare: number; // combined cost-share
  originalFare: number; // price before sharing, shown struck through
  extraMin: number;
  distanceKm: number;
  passengers: CarpoolPassenger[];
};

// ---------- Fare match ----------

export type FareMatch = {
  originalFare: number;
  offer: number;
};

// Seconds the driver has to accept a carpool request.
export const CARPOOL_ACCEPT_SECONDS = 10;

// Sample data so every screen can be tried. Values follow the design.
// TODO: receive deliveries / carpools from your API.
const SAMPLE_DELIVERY: Delivery = {
  id: 'DLV-882',
  orderNo: '882-9A',
  fare: 180,
  distanceKm: 4.5,
  durationMin: 12,
  pickupAddress: '1024 Logistics Way, Loading Bay C',
  stops: [
    {
      id: 'PKG-8492-BX',
      recipient: 'Smriti',
      phone: '+919876501234',
      place: 'ISBT Kashmere Gate',
      address: '885 Riverside Dr, Suite 400',
      packageSize: 'medium',
      weightKg: 2.4,
      note: 'Pull up near the blue canopy. Passenger has small luggage.',
      cod: 450,
      done: false,
    },
    {
      id: 'PKG-8493-CX',
      recipient: 'Rajesh V.',
      phone: '+919876505678',
      place: 'India Gate',
      address: 'Rajpath, India Gate, New Delhi',
      packageSize: 'small',
      weightKg: 1.8,
      note: 'Meet at the lobby entrance.',
      extraMin: 8,
      done: false,
    },
    {
      id: 'PKG-8494-DX',
      recipient: 'Priya S.',
      phone: '+919876509012',
      place: 'Red Fort',
      address: 'Netaji Subhash Marg, Chandni Chowk',
      packageSize: 'large',
      weightKg: 3.1,
      note: 'Wait near the ticket counter.',
      extraMin: 14,
      done: false,
    },
  ],
};

const SAMPLE_CARPOOL: Carpool = {
  id: 'CPL-311',
  fare: 185,
  originalFare: 240,
  extraMin: 12,
  distanceKm: 8.4,
  passengers: [
    {id: 'p1', name: 'Rahul', pickup: 'Lajpat Nagar, Delhi', share: 65, status: 'arrived'},
    {id: 'p2', name: 'Smriti', pickup: 'Connaught Place, Delhi', share: 70, status: 'upcoming'},
    {id: 'p3', name: 'Amit', pickup: 'Nehru Place, Delhi', share: 50, status: 'upcoming'},
  ],
};

const SAMPLE_FARE_MATCH: FareMatch = {originalFare: 245, offer: 195};

type State = {
  delivery?: Delivery;
  carpool?: Carpool;
};

let state: State = {};

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function set(patch: Partial<State>) {
  state = {...state, ...patch};
  listeners.forEach(l => l());
}

// A new delivery came in. Copies the sample so it can be completed more than once.
export function receiveDelivery(next: Delivery = SAMPLE_DELIVERY) {
  set({delivery: {...next, stops: next.stops.map(s => ({...s}))}});
}

export function receiveCarpool(next: Carpool = SAMPLE_CARPOOL) {
  set({carpool: {...next, passengers: next.passengers.map(p => ({...p}))}});
}

export function clearDelivery() {
  set({delivery: undefined});
}

export function clearCarpool() {
  set({carpool: undefined});
}

// The current delivery (or the sample, so a screen opened on its own still works).
export function useDelivery(): Delivery {
  return useSyncExternalStore(subscribe, () => state.delivery) ?? SAMPLE_DELIVERY;
}

export function useCarpool(): Carpool {
  return useSyncExternalStore(subscribe, () => state.carpool) ?? SAMPLE_CARPOOL;
}

// TODO: load the fare-match offer from your API.
export function useFareMatch(): FareMatch {
  return SAMPLE_FARE_MATCH;
}

// The stop being driven to: the first one not delivered yet.
export function currentStop(d: Delivery): ParcelStop | undefined {
  return d.stops.find(s => !s.done);
}

// Marks a stop delivered. Returns true when every stop is done.
export function completeStop(stopId: string): boolean {
  const d = state.delivery ?? SAMPLE_DELIVERY;
  const stops = d.stops.map(s => (s.id === stopId ? {...s, done: true} : s));
  set({delivery: {...d, stops}});
  return stops.every(s => s.done);
}

// Next passenger status after "Confirm Boarded": that passenger is on board and
// the first upcoming one becomes the next pickup.
export function boardPassenger(id: string) {
  const c = state.carpool ?? SAMPLE_CARPOOL;
  let promoted = false;
  const passengers = c.passengers.map(p => {
    if (p.id === id) {
      return {...p, status: 'boarded' as const};
    }
    if (!promoted && p.status === 'upcoming') {
      promoted = true;
      return {...p, status: 'arrived' as const};
    }
    return p;
  });
  set({carpool: {...c, passengers}});
}

export function removePassenger(id: string) {
  const c = state.carpool ?? SAMPLE_CARPOOL;
  const removed = c.passengers.find(p => p.id === id);
  let passengers = c.passengers.filter(p => p.id !== id);
  // if the waiting passenger was removed, the next upcoming one is now the pickup
  if (removed?.status === 'arrived' && !passengers.some(p => p.status === 'arrived')) {
    const next = passengers.findIndex(p => p.status === 'upcoming');
    if (next !== -1) {
      passengers = passengers.map((p, i) => (i === next ? {...p, status: 'arrived'} : p));
    }
  }
  set({
    carpool: {...c, passengers, fare: c.fare - (removed?.share ?? 0)},
  });
}

// ---------- which kind of request arrives next (demo only) ----------

export type RequestKind = 'ride' | 'delivery' | 'carpool';

// A driver only receives requests for the service they signed up for:
// parcel -> parcel delivery, carpool -> carpool, cab / auto / bike / scooty -> rides.
// TODO: remove; your API decides what kind of request arrives.
export function requestKindForVehicle(vehicle?: VehicleId): RequestKind {
  if (vehicle === 'parcel') {
    return 'delivery';
  }
  if (vehicle === 'carpool') {
    return 'carpool';
  }
  return 'ride';
}

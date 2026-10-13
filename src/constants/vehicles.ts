import {MDI} from '@/constants/iconPaths';

export type VehicleId = 'cab' | 'auto' | 'bike' | 'scooty' | 'carpool' | 'parcel' | 'driver';

export type Vehicle = {
  id: VehicleId;
  name: string;
  commission: number;
  iconPath: string;
  iconColor: string;
  tint: string;
};

// Order = order on screen (left to right, top to bottom)
export const VEHICLES: Vehicle[] = [
  {id: 'cab', name: 'Cab', commission: 20, iconPath: MDI.taxi, iconColor: '#FFC400', tint: '#FEF0EF'},
  {id: 'auto', name: 'Auto', commission: 15, iconPath: MDI.rickshawElectric, iconColor: '#F5A623', tint: '#FFF8E1'},
  {id: 'bike', name: 'Bike', commission: 10, iconPath: MDI.motorbike, iconColor: '#3FA9F5', tint: '#EAF3FF'},
  {id: 'scooty', name: 'Pink Scooty', commission: 10, iconPath: MDI.moped, iconColor: '#FF4D8D', tint: '#FFE8F0'},
  {id: 'carpool', name: 'Carpool', commission: 12, iconPath: MDI.accountMultiple, iconColor: '#A64AC9', tint: '#F8EBFD'},
  {id: 'parcel', name: 'Parcel', commission: 18, iconPath: MDI.truck, iconColor: '#F2683C', tint: '#FFF0E8'},
  {id: 'driver', name: 'Hire a Driver', commission: 20, iconPath: MDI.chauffeur, iconColor: '#FFA500', tint: '#FDF3E8'},
];
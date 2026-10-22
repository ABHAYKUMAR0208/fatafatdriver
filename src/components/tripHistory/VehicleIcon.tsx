import React from 'react';
import Svg, {Path, Rect} from 'react-native-svg';
import MdiIcon from '@/components/common/MdiIcon';
import {MDI} from '@/constants/iconPaths';
import type {TripVehicle} from '@/state/tripHistoryStore';

type Props = {vehicle: TripVehicle; size?: number; color?: string};

// Car: front view outline (same line style as the tab icons).
// Auto: two-wheeler.
export default function VehicleIcon({vehicle, size = 24, color = '#111827'}: Props) {
  if (vehicle === 'auto') {
    return <MdiIcon path={MDI.motorbike} size={size} color={color} />;
  }
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round">
      <Path d="m21 8-2 2-1.5-3.7A2 2 0 0 0 15.646 5H8.4a2 2 0 0 0-1.903 1.257L5 10 3 8" />
      <Path d="M7 14h.01M17 14h.01M5 18v2M19 18v2" />
      <Rect x={3} y={10} width={18} height={8} rx={2} />
    </Svg>
  );
}

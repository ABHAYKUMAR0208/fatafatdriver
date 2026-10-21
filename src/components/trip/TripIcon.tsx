import React from 'react';
import Svg, {Path} from 'react-native-svg';
import type {TripIcon as TripIconPath} from '@/constants/iconPathsTrip';

type Props = {icon: TripIconPath; size?: number; color?: string};

// Draws an icon from TRIP_ICONS (each icon has its own viewBox).
export default function TripIcon({icon, size = 24, color = '#000000'}: Props) {
  return (
    <Svg width={size} height={size} viewBox={icon.viewBox}>
      <Path d={icon.d} fill={color} />
    </Svg>
  );
}

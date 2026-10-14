import React from 'react';
import Svg, {Circle, Path, Polygon} from 'react-native-svg';

export type TabIconProps = {color: string; size?: number; strokeWidth?: number };

type BaseProps = TabIconProps & {children: React.ReactNode};

function Base({size = 22, color, strokeWidth = 1.8, children}: BaseProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round">
      {children}
    </Svg>
  );
}

export const HomeIcon = (p: TabIconProps) => (
  <Base {...p}>
    <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <Path d="M9 22V12h6v10" />
  </Base>
);

// Paper-plane arrow (Trips on the Home screen)
export const NavigationIcon = (p: TabIconProps) => (
  <Base {...p}>
    <Polygon points="3 11 22 2 13 21 11 13 3 11" />
  </Base>
);

// Rising arrow (Earnings on the Home screen)
export const TrendingUpIcon = (p: TabIconProps) => (
  <Base {...p}>
    <Path d="M22 7l-8.5 8.5-5-5L2 17" />
    <Path d="M16 7h6v6" />
  </Base>
);

export const UserIcon = (p: TabIconProps) => (
  <Base {...p}>
    <Path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <Circle cx={12} cy={7} r={4} />
  </Base>
);

// Pin (Trips on the Locked and Alerts screens)
export const MapPinIcon = (p: TabIconProps) => (
  <Base {...p}>
    <Path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
    <Circle cx={12} cy={10} r={3} />
  </Base>
);

// Wallet (Earnings on the Locked and Alerts screens)
export const WalletIcon = (p: TabIconProps) => (
  <Base {...p}>
    <Path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
    <Path d="M4 6v12c0 1.1.9 2 2 2h14v-4" />
    <Path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z" />
  </Base>
);

export const BellIcon = (p: TabIconProps) => (
  <Base {...p}>
    <Path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <Path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </Base>
);
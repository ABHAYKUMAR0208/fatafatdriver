import React from 'react';
import Svg, {Circle, Path, Rect} from 'react-native-svg';

type Props = {size?: number; color?: string};

function Base({size = 24, color = '#000', children}: Props & {children: React.ReactNode}) {
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
      {children}
    </Svg>
  );
}

export function ToolboxIcon(props: Props) {
  return (
    <Base {...props}>
      <Path d="M16 12v4" />
      <Path d="M16 6a2 2 0 0 1 1.414.586l4 4A2 2 0 0 1 22 12v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 .586-1.414l4-4A2 2 0 0 1 8 6z" />
      <Path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      <Path d="M2 14h20" />
      <Path d="M8 12v4" />
    </Base>
  );
}

export function ArrowUpCircleIcon(props: Props) {
  return (
    <Base {...props}>
      <Circle cx="12" cy="12" r="10" />
      <Path d="m16 12-4-4-4 4" />
      <Path d="M12 16V8" />
    </Base>
  );
}

export function ClockIcon(props: Props) {
  return (
    <Base {...props}>
      <Circle cx="12" cy="12" r="10" />
      <Path d="M12 6v6l4 2" />
    </Base>
  );
}

export function MapPinIcon(props: Props) {
  return (
    <Base {...props}>
      <Path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <Circle cx="12" cy="10" r="3" />
    </Base>
  );
}

export function ArrowRightIcon(props: Props) {
  return (
    <Base {...props}>
      <Path d="M5 12h14" />
      <Path d="m12 5 7 7-7 7" />
    </Base>
  );
}

export function ArrowLeftIcon(props: Props) {
  return (
    <Base {...props}>
      <Path d="m12 19-7-7 7-7" />
      <Path d="M19 12H5" />
    </Base>
  );
}

export function ChevronDownIcon(props: Props) {
  return (
    <Base {...props}>
      <Path d="m6 9 6 6 6-6" />
    </Base>
  );
}

export function HelpCircleIcon(props: Props) {
  return (
    <Base {...props}>
      <Circle cx="12" cy="12" r="10" />
      <Path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <Path d="M12 17h.01" />
    </Base>
  );
}

export function LockIcon(props: Props) {
  return (
    <Base {...props}>
      <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <Path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </Base>
  );
}

export function DollarIcon(props: Props) {
  return (
    <Base {...props}>
      <Path d="M12 2v20" />
      <Path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </Base>
  );
}

export function ShieldIcon(props: Props) {
  return (
    <Base {...props}>
      <Path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    </Base>
  );
}

// Lucide icons used by the delivery / carpool screens (Module 7).
export function PackageIcon(props: Props) {
  return (
    <Base {...props}>
      <Path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" />
      <Path d="M12 22V12" />
      <Path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7" />
      <Path d="m7.5 4.27 9 5.15" />
    </Base>
  );
}

export function WalletIcon(props: Props) {
  return (
    <Base {...props}>
      <Path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
      <Path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
    </Base>
  );
}

export function CameraIcon(props: Props) {
  return (
    <Base {...props}>
      <Path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <Circle cx="12" cy="13" r="3" />
    </Base>
  );
}

export function MapIcon(props: Props) {
  return (
    <Base {...props}>
      <Path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z" />
      <Path d="M15 5.764v15" />
      <Path d="M9 3.236v15" />
    </Base>
  );
}

export function RouteIcon(props: Props) {
  return (
    <Base {...props}>
      <Circle cx="6" cy="19" r="3" />
      <Path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
      <Circle cx="18" cy="5" r="3" />
    </Base>
  );
}

export function CheckIcon(props: Props) {
  return (
    <Base {...props}>
      <Path d="M20 6 9 17l-5-5" />
    </Base>
  );
}

export function XCircleIcon(props: Props) {
  return (
    <Base {...props}>
      <Circle cx="12" cy="12" r="10" />
      <Path d="m15 9-6 6" />
      <Path d="m9 9 6 6" />
    </Base>
  );
}

export function UploadIcon(props: Props) {
  return (
    <Base {...props}>
      <Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <Path d="m17 8-5-5-5 5" />
      <Path d="M12 3v12" />
    </Base>
  );
}

export function UsersIcon(props: Props) {
  return (
    <Base {...props}>
      <Path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <Circle cx="9" cy="7" r="4" />
      <Path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <Path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </Base>
  );
}

export function AlertTriangleIcon(props: Props) {
  return (
    <Base {...props}>
      <Path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
      <Path d="M12 9v4" />
      <Path d="M12 17h.01" />
    </Base>
  );
}

export function UserXIcon(props: Props) {
  return (
    <Base {...props}>
      <Path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <Circle cx="9" cy="7" r="4" />
      <Path d="m17 8 5 5" />
      <Path d="m22 8-5 5" />
    </Base>
  );
}

export function PhoneIcon(props: Props) {
  return (
    <Base {...props}>
      <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </Base>
  );
}

export function MessageIcon(props: Props) {
  return (
    <Base {...props}>
      <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </Base>
  );
}

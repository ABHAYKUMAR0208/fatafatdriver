import React from 'react';
import {StyleSheet} from 'react-native';
import Svg, {Defs, LinearGradient, Rect, Stop} from 'react-native-svg';
import {colors} from '@/constants/colors';

// Left-to-right navy gradient that fills its parent (drawn with react-native-svg).
export default function NavyGradient() {
  return (
    <Svg style={StyleSheet.absoluteFill} width="100%" height="100%" preserveAspectRatio="none">
      <Defs>
        <LinearGradient id="navyGradient" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor={colors.navyStart} />
          <Stop offset="1" stopColor={colors.navyEnd} />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="100%" height="100%" fill="url(#navyGradient)" />
    </Svg>
  );
}
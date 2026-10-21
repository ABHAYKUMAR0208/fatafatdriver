import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import Svg, {Defs, LinearGradient, Rect, Stop} from 'react-native-svg';

type Props = {
  // colour at the bottom edge; the top edge is fully transparent
  color: string;
  opacity: number;
  id: string;
  style?: StyleProp<ViewStyle>;
};

// Vertical fade (map scrim on Incoming Request, photo shade on Identity Check).
// Fills its parent unless a style is given.
export default function FadeGradient({color, opacity, id, style}: Props) {
  return (
    <View style={[styles.fill, style]} pointerEvents="none">
      <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <Defs>
          <LinearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={color} stopOpacity={0} />
            <Stop offset="1" stopColor={color} stopOpacity={opacity} />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100" height="100" fill={`url(#${id})`} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {position: 'absolute', top: 0, left: 0, right: 0, bottom: 0},
});

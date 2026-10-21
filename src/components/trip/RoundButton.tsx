import React from 'react';
import {Pressable, StyleProp, StyleSheet, ViewStyle} from 'react-native';
import {colors} from '@/constants/colors';

type Props = {
  children: React.ReactNode;
  onPress?: () => void;
  size?: number;
  backgroundColor?: string;
  // floating buttons on the map get a shadow in the colour given here
  shadowColor?: string;
  style?: StyleProp<ViewStyle>;
};

// Round icon button (header buttons, map FABs, call / chat circles).
export default function RoundButton({
  children,
  onPress,
  size = 40,
  backgroundColor = colors.ringFill,
  shadowColor,
  style,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={6}
      style={({pressed}) => [
        styles.button,
        {width: size, height: size, borderRadius: size / 2, backgroundColor},
        shadowColor ? [styles.shadow, {shadowColor}] : null,
        pressed && styles.pressed,
        style,
      ]}>
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadow: {
    elevation: 5,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  pressed: {
    opacity: 0.8,
  },
});

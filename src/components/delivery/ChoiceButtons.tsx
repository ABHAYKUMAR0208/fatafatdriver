import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {colors} from '@/constants/colors';
import {fonts} from '@/constants/typography';

type Props = {
  secondary: string;
  primary: string;
  onSecondary: () => void;
  onPrimary: () => void;
  primaryDisabled?: boolean;
  primaryIcon?: React.ReactNode;
  // 'even' = two equal buttons, 'wide' = small left, wide right (Delivery Request)
  layout?: 'even' | 'wide';
  height?: number;
  radius?: number;
};

// Grey secondary button + pink primary button side by side (Decline / Accept).
export default function ChoiceButtons({
  secondary,
  primary,
  onSecondary,
  onPrimary,
  primaryDisabled,
  primaryIcon,
  layout = 'even',
  height = 54,
  radius = 12,
}: Props) {
  const box = {height, borderRadius: radius};

  return (
    <View style={styles.row}>
      <Pressable
        style={({pressed}) => [
          styles.button,
          styles.secondary,
          box,
          layout === 'wide' ? styles.narrow : styles.half,
          pressed && styles.pressed,
        ]}
        onPress={onSecondary}>
        <Text style={styles.secondaryText}>{secondary}</Text>
      </Pressable>
      <Pressable
        disabled={primaryDisabled}
        style={({pressed}) => [
          styles.button,
          styles.primary,
          box,
          styles.half,
          primaryDisabled && styles.disabled,
          pressed && styles.pressed,
        ]}
        onPress={onPrimary}>
        <Text style={styles.primaryText}>{primary}</Text>
        {primaryIcon}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  half: {
    flex: 1,
  },
  narrow: {
    width: 112,
  },
  secondary: {
    backgroundColor: colors.ringFill,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  disabled: {
    opacity: 0.4,
  },
  pressed: {
    opacity: 0.85,
  },
  secondaryText: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.textDark,
  },
  primaryText: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: '#FFFFFF',
  },
});

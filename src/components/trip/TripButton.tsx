import React from 'react';
import {Pressable, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle} from 'react-native';
import {colors} from '@/constants/colors';
import {fonts} from '@/constants/typography';

type Props = {
  title: string;
  onPress?: () => void;
  // primary = pink CTA, grey = "Keep Trip" / "Stay Offline" style
  variant?: 'primary' | 'grey';
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

// Full-width button used across the trip flow (56 high primary, 48 high grey).
export default function TripButton({
  title,
  onPress,
  variant = 'primary',
  disabled,
  icon,
  style,
  textStyle,
}: Props) {
  const primary = variant === 'primary';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({pressed}) => [
        styles.button,
        primary ? styles.primary : styles.grey,
        disabled && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}>
      {icon ? <View style={styles.icon}>{icon}</View> : null}
      <Text style={[primary ? styles.primaryText : styles.greyText, textStyle]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'stretch',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    height: 56,
    backgroundColor: colors.primary,
    elevation: 6,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },
  grey: {
    height: 48,
    backgroundColor: colors.chip,
  },
  disabled: {
    opacity: 0.4,
    elevation: 0,
    shadowOpacity: 0,
  },
  pressed: {
    opacity: 0.85,
  },
  icon: {
    marginRight: 10,
  },
  primaryText: {
    fontFamily: fonts.bold,
    fontSize: 17,
    color: '#FFFFFF',
  },
  greyText: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: colors.textGrey,
  },
});

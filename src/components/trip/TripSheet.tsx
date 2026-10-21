import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {colors} from '@/constants/colors';

type Props = {
  children: React.ReactNode;
  // space under the grey handle
  handleGap?: number;
  // thin top border (Arrived, Cancel, Identity Check)
  bordered?: boolean;
  style?: StyleProp<ViewStyle>;
};

// White bottom sheet with rounded top corners and a grey handle.
export default function TripSheet({children, handleGap = 12, bordered, style}: Props) {
  return (
    <View style={[styles.sheet, bordered && styles.bordered, style]}>
      <View style={[styles.handleWrap, {paddingBottom: handleGap}]}>
        <View style={styles.handle} />
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: colors.background,
    elevation: 12,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: -4},
    shadowOpacity: 0.08,
    shadowRadius: 24,
  },
  bordered: {
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: colors.cardBorder,
  },
  handleWrap: {
    paddingTop: 12,
    alignItems: 'center',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.chipBorder,
  },
});

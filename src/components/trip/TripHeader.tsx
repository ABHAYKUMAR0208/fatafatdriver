import React from 'react';
import {StyleSheet, Text, TextStyle, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {colors} from '@/constants/colors';
import {fonts} from '@/constants/typography';

type Props = {
  title: string;
  left: React.ReactNode;
  right: React.ReactNode;
  // 56 (Trip Summary, Safety Check) or 72 (Identity Check)
  height?: number;
  titleStyle?: TextStyle;
};

// White header: round button, centred title, round button.
export default function TripHeader({title, left, right, height = 56, titleStyle}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, {paddingTop: insets.top}]}>
      <View style={[styles.row, {height}]}>
        {left}
        <Text style={[styles.title, titleStyle]} numberOfLines={1}>
          {title}
        </Text>
        {right}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.background,
  },
  row: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    marginHorizontal: 12,
    textAlign: 'center',
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.textDark,
  },
});

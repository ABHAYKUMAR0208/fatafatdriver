import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors} from '@/constants/colors';
import {fonts} from '@/constants/typography';

type Props = {
  label: string;
  // pink = active / boarded, solid = current stop, grey = waiting
  tone: 'pink' | 'solid' | 'grey';
};

export default function StatusPill({label, tone}: Props) {
  return (
    <View style={[styles.pill, styles[tone]]}>
      <Text style={[styles.text, tone === 'solid' && styles.textSolid, tone === 'grey' && styles.textGrey]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  pink: {
    backgroundColor: colors.pinkPill,
  },
  solid: {
    backgroundColor: colors.primary,
  },
  grey: {
    backgroundColor: colors.ringFill,
  },
  text: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: colors.primary,
  },
  textSolid: {
    fontFamily: fonts.bold,
    color: '#FFFFFF',
  },
  textGrey: {
    color: colors.textSecondary,
  },
});

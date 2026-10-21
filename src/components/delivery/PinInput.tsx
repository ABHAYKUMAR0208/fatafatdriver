import React, {useRef} from 'react';
import {Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import {colors} from '@/constants/colors';
import {fonts} from '@/constants/typography';

type Props = {
  value: string;
  onChange: (digits: string) => void;
  length?: number;
  // 'spread' = big grey boxes across the width (pickup PIN)
  // 'compact' = smaller bordered boxes side by side (delivery OTP)
  variant?: 'spread' | 'compact';
};

// Row of digit boxes over one hidden number input.
export default function PinInput({value, onChange, length = 4, variant = 'compact'}: Props) {
  const ref = useRef<React.ComponentRef<typeof TextInput>>(null);
  const spread = variant === 'spread';

  return (
    <Pressable onPress={() => ref.current?.focus()}>
      <View style={[styles.row, spread ? styles.rowSpread : styles.rowCompact]}>
        {Array.from({length}, (_, i) => {
          const digit = value[i];
          const active = i === Math.min(value.length, length - 1);
          return (
            <View
              key={i}
              style={[
                spread ? styles.boxSpread : styles.boxCompact,
                active && styles.boxActive,
              ]}>
              <Text
                style={[
                  spread ? styles.digitSpread : styles.digitCompact,
                  !digit && styles.empty,
                ]}>
                {digit ?? (spread ? '•' : '')}
              </Text>
            </View>
          );
        })}
      </View>
      <TextInput
        ref={ref}
        style={styles.hidden}
        value={value}
        onChangeText={t => onChange(t.replace(/\D/g, '').slice(0, length))}
        keyboardType="number-pad"
        maxLength={length}
        caretHidden
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  rowSpread: {
    justifyContent: 'space-between',
  },
  rowCompact: {
    gap: 8,
  },
  boxSpread: {
    width: 56,
    height: 64,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceAlt,
  },
  boxCompact: {
    width: 48,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  boxActive: {
    borderColor: colors.primary,
  },
  digitSpread: {
    fontFamily: fonts.bold,
    fontSize: 28,
    color: colors.textDark,
  },
  digitCompact: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.textDark,
  },
  empty: {
    color: colors.textSecondary,
  },
  hidden: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
});

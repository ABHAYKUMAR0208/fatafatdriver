import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ArrowLeftIcon, HelpCircleIcon} from '@/components/common/Icons';
import {colors} from '@/constants/colors';
import {fonts} from '@/constants/typography';

type Props = {
  title: string;
  onBack: () => void;
  onHelp?: () => void;
};

// Back button, centred title, help button, thin bottom border.
export default function DetailHeader({title, onBack, onHelp}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, {paddingTop: insets.top + 12}]}>
      <Pressable style={styles.circle} onPress={onBack} hitSlop={6}>
        <ArrowLeftIcon size={18} color={colors.textDark} />
      </Pressable>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      {/* TODO: open Help & Support once Module 10 is built */}
      <Pressable style={styles.circle} onPress={onHelp} hitSlop={6}>
        <HelpCircleIcon size={18} color={colors.textSecondary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  circle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  title: {
    flex: 1,
    marginHorizontal: 12,
    textAlign: 'center',
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.textDark,
  },
});

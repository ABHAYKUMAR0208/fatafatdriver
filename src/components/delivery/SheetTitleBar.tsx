import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {XCircleIcon} from '@/components/common/Icons';
import {colors} from '@/constants/colors';
import {fonts} from '@/constants/typography';

type Props = {
  title: string;
  onClose?: () => void;
  // small green "Online" label instead of the close button (Carpool request)
  right?: React.ReactNode;
};

// Title on the left, round close button on the right.
export default function SheetTitleBar({title, onClose, right}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, {paddingTop: insets.top}]}>
      <View style={styles.row}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {right ??
          (onClose ? (
            <Pressable style={styles.close} onPress={onClose} hitSlop={8}>
              <XCircleIcon size={16} color={colors.textSecondary} />
            </Pressable>
          ) : null)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.background,
  },
  row: {
    height: 48,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    flexShrink: 1,
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.textDark,
  },
  close: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

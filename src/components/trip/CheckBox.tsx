import React from 'react';
import {StyleSheet, View} from 'react-native';
import TripIcon from '@/components/trip/TripIcon';
import {colors} from '@/constants/colors';
import {TRIP_ICONS} from '@/constants/iconPathsTrip';

type Props = {
  checked: boolean;
  // 22 (Arrived checklist) or 28 (Helmet Check)
  size?: number;
  // background while unchecked
  fill?: string;
};

// Square check box with the green tick from the design.
export default function CheckBox({checked, size = 22, fill = 'transparent'}: Props) {
  const box = {width: size, height: size, borderRadius: size >= 28 ? 8 : 6};

  return (
    <View
      style={[
        styles.box,
        box,
        {backgroundColor: checked ? colors.greenTint8 : fill},
        checked && styles.checked,
      ]}>
      {checked ? (
        <TripIcon icon={TRIP_ICONS.check} size={size / 2} color={colors.green} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.checkBorder,
  },
  checked: {
    borderColor: colors.green,
  },
});

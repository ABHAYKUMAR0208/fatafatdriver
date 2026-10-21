import React from 'react';
import {StyleSheet, Text, TextStyle, View} from 'react-native';
import TripIcon from '@/components/trip/TripIcon';
import {colors} from '@/constants/colors';
import type {TripIcon as TripIconPath} from '@/constants/iconPathsTrip';
import {fonts} from '@/constants/typography';

type Props = {
  icon: TripIconPath;
  iconSize: number;
  title: string;
  detail: string;
  // En Route: 17 bold title + grey detail. Active Trip: 20 bold distance.
  titleStyle?: TextStyle;
  detailStyle?: TextStyle;
  right?: React.ReactNode;
};

// Turn-by-turn card floating over the map.
export default function NavBanner({
  icon,
  iconSize,
  title,
  detail,
  titleStyle,
  detailStyle,
  right,
}: Props) {
  return (
    <View style={styles.banner}>
      <View style={styles.iconBox}>
        <TripIcon icon={icon} size={iconSize} color="#FFFFFF" />
      </View>
      <View style={styles.text}>
        <Text style={[styles.title, titleStyle]} numberOfLines={1}>
          {title}
        </Text>
        <Text style={[styles.detail, detailStyle]} numberOfLines={1}>
          {detail}
        </Text>
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    minHeight: 72,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    // solid: Android draws the elevation shadow through a translucent fill
    backgroundColor: colors.background,
    elevation: 6,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 20,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  text: {
    flex: 1,
    marginLeft: 14,
    marginRight: 12,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 17,
    color: colors.textDark,
  },
  detail: {
    marginTop: 2,
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.tripMuted,
  },
});

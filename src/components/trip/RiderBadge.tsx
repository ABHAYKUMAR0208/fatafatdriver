import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Avatar from '@/components/home/Avatar';
import {colors} from '@/constants/colors';
import {fonts} from '@/constants/typography';
import type {TripRider} from '@/state/tripStore';

type Props = {
  rider: TripRider;
  // 56 (En Route), 52 (Trip Summary) or 48 (Arrived, Active Trip)
  size?: number;
  nameSize?: number;
  // green dot on the photo (Arrived)
  online?: boolean;
  // shown after the rating, e.g. "• 248 trips"
  extra?: string;
  // colour behind the online dot, so it looks cut out
  dotBorder?: string;
};

// Rider photo, name and star rating.
export default function RiderBadge({
  rider,
  size = 48,
  nameSize = 17,
  online,
  extra,
  dotBorder = colors.background,
}: Props) {
  return (
    <View style={styles.row}>
      <View>
        <View style={[styles.ring, {borderRadius: size / 2}]}>
          <Avatar uri={rider.photoUri} size={size - 4} flat />
        </View>
        {online ? <View style={[styles.dot, {borderColor: dotBorder}]} /> : null}
      </View>
      <View style={[styles.info, size >= 56 && styles.infoWide]}>
        <Text style={[styles.name, {fontSize: nameSize}]} numberOfLines={1}>
          {rider.name}
        </Text>
        <View style={styles.ratingRow}>
          <Text style={styles.rating}>★ {rider.rating.toFixed(1)}</Text>
          {extra ? <Text style={styles.extra}>{extra}</Text> : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ring: {
    borderWidth: 2,
    borderColor: colors.chipBorder,
    overflow: 'hidden',
  },
  dot: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    backgroundColor: colors.green,
  },
  info: {
    flexShrink: 1,
    marginLeft: 12,
  },
  infoWide: {
    marginLeft: 14,
  },
  name: {
    fontFamily: fonts.bold,
    color: colors.textDark,
  },
  ratingRow: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.star,
  },
  extra: {
    marginLeft: 4,
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.tripMuted,
  },
});

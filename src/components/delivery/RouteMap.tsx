import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {MapIcon, MapPinIcon, RouteIcon} from '@/components/common/Icons';
import MapPlaceholder from '@/components/home/MapPlaceholder';
import FadeGradient from '@/components/trip/FadeGradient';
import {colors} from '@/constants/colors';
import {fonts} from '@/constants/typography';
import {useStrings} from '@/localization';

type Props = {
  routeLabel: string; // e.g. "4.5 km • 12 min"
};

// Map preview with the pickup / drop-off markers and a route badge.
export default function RouteMap({routeLabel}: Props) {
  const strings = useStrings();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.map}>
      <MapPlaceholder />
      <FadeGradient id="routeMapFade" color="#FFFFFF" opacity={0.9} style={styles.fade} />

      <View style={[styles.status, {top: insets.top + 12}]}>
        <View style={styles.statusIcon}>
          <MapIcon size={14} color={colors.primary} />
        </View>
        <Text style={styles.statusText}>{strings.delivery.livePreview}</Text>
      </View>

      <View style={styles.pickup} pointerEvents="none">
        <View style={[styles.marker, styles.markerPickup]}>
          <MapPinIcon size={10} color="#FFFFFF" />
        </View>
        <View style={styles.markerStem} />
      </View>
      <View style={styles.drop} pointerEvents="none">
        <View style={[styles.marker, styles.markerDrop]}>
          <MapPinIcon size={10} color="#FFFFFF" />
        </View>
      </View>

      <View style={styles.badgeWrap} pointerEvents="none">
        <View style={styles.badge}>
          <RouteIcon size={14} color={colors.primary} />
          <Text style={styles.badgeText}>{routeLabel}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
    minHeight: 220,
    overflow: 'hidden',
  },
  fade: {
    top: '55%',
  },
  status: {
    position: 'absolute',
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.whiteGlass,
  },
  statusText: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.textDark,
  },
  pickup: {
    position: 'absolute',
    top: '31%',
    left: '23%',
    alignItems: 'center',
  },
  drop: {
    position: 'absolute',
    top: '59%',
    left: '64%',
  },
  marker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerPickup: {
    backgroundColor: colors.primary,
  },
  markerDrop: {
    backgroundColor: colors.green,
  },
  markerStem: {
    width: 2,
    height: 18,
    borderRadius: 1,
    backgroundColor: colors.primary,
  },
  badgeWrap: {
    position: 'absolute',
    top: '43%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  badge: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 999,
    backgroundColor: colors.whiteGlass,
  },
  badgeText: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.textDark,
  },
});

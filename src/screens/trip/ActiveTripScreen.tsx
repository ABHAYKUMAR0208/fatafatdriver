import React, {useEffect} from 'react';
import {BackHandler, Pressable, StatusBar, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MapPlaceholder from '@/components/home/MapPlaceholder';
import NavBanner from '@/components/trip/NavBanner';
import RiderBadge from '@/components/trip/RiderBadge';
import RoundButton from '@/components/trip/RoundButton';
import TripButton from '@/components/trip/TripButton';
import TripIcon from '@/components/trip/TripIcon';
import TripSheet from '@/components/trip/TripSheet';
import {colors} from '@/constants/colors';
import {TRIP_ICONS} from '@/constants/iconPathsTrip';
import {fonts} from '@/constants/typography';
import {useStrings} from '@/localization';
import type {RootStackParamList} from '@/navigation/types';
import {DROP_STEP, useTrip} from '@/state/tripStore';
import {confirmSos} from '@/utils/tripActions';

// Rider on board, driving to the drop-off.
export default function ActiveTripScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const strings = useStrings();
  const trip = useTrip();

  // the trip can only be left with "End Trip"
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => sub.remove();
  }, []);

  const onEnd = () => {
    // TODO: tell your API the trip has ended
    navigation.reset({index: 0, routes: [{name: 'TripComplete'}]});
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <MapPlaceholder />

      <View style={[styles.bannerWrap, {paddingTop: insets.top + 12}]}>
        <NavBanner
          icon={TRIP_ICONS.straight}
          iconSize={22}
          title={DROP_STEP.instruction}
          detail={DROP_STEP.detail}
          titleStyle={styles.bannerTitle}
          detailStyle={styles.bannerDetail}
        />
      </View>

      <View style={styles.spacer} />

      <View style={styles.fabs}>
        {/* TODO: re-centre the real map on the current location */}
        <RoundButton size={48} backgroundColor={colors.background} shadowColor="#000000" style={styles.lightShadow}>
          <TripIcon icon={TRIP_ICONS.locationSearching} size={22} color={colors.textDark} />
        </RoundButton>
        <RoundButton size={48} backgroundColor={colors.primary} shadowColor={colors.primary} onPress={confirmSos}>
          <TripIcon icon={TRIP_ICONS.sos} size={22} color="#FFFFFF" />
        </RoundButton>
      </View>

      <TripSheet>
        <View style={[styles.content, {paddingBottom: 24 + insets.bottom}]}>
          <View style={styles.header}>
            <RiderBadge rider={trip.rider} />
            <View style={styles.eta}>
              <Text style={styles.etaValue}>
                {strings.formatString(strings.trip.minutes, String(trip.durationMin))}
              </Text>
              <Text style={styles.etaSub}>
                {strings.formatString(strings.trip.kmAway, String(trip.distanceKm))}
              </Text>
            </View>
          </View>

          <View style={styles.destination}>
            <View style={styles.pinCircle}>
              <TripIcon icon={TRIP_ICONS.pin} size={18} color={colors.primary} />
            </View>
            <View style={styles.destText}>
              <Text style={styles.destLabel}>{strings.trip.dropOff}</Text>
              <Text style={styles.destAddress} numberOfLines={1}>
                {trip.drop.title}, {trip.drop.address}
              </Text>
            </View>
          </View>

          {trip.surge ? (
            // tap to review a rider's fare-match request
            <Pressable style={styles.surge} onPress={() => navigation.navigate('FareMatch')}>
              <View style={styles.surgeLeft}>
                <TripIcon icon={TRIP_ICONS.bolt} size={20} color={colors.star} />
                <Text style={styles.surgeText}>{strings.trip.fareMatch}</Text>
              </View>
              <View style={styles.surgePill}>
                <Text style={styles.surgePillText}>
                  {strings.formatString(strings.trip.surge, String(trip.surge))}
                </Text>
              </View>
            </Pressable>
          ) : null}

          <TripButton title={strings.trip.endTrip} onPress={onEnd} />
        </View>
      </TripSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  bannerWrap: {
    paddingHorizontal: 16,
  },
  bannerTitle: {
    fontSize: 20,
  },
  bannerDetail: {
    fontFamily: fonts.regular,
    color: colors.textGrey,
  },
  spacer: {
    flex: 1,
  },
  fabs: {
    alignSelf: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 14,
  },
  lightShadow: {
    shadowOpacity: 0.15,
  },
  content: {
    paddingHorizontal: 20,
    gap: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eta: {
    marginLeft: 12,
    alignItems: 'flex-end',
  },
  etaValue: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.green,
  },
  etaSub: {
    marginTop: 2,
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.tripMuted,
  },
  destination: {
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 14,
    backgroundColor: colors.cardBg,
  },
  pinCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryTint8,
  },
  destText: {
    flex: 1,
  },
  destLabel: {
    fontFamily: fonts.bold,
    fontSize: 11,
    letterSpacing: 0.5,
    color: colors.tripMuted,
  },
  destAddress: {
    marginTop: 2,
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.textDark,
  },
  surge: {
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.starTint19,
    backgroundColor: colors.warnBg,
  },
  surgeLeft: {
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  surgeText: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.textDark,
  },
  surgePill: {
    marginLeft: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: colors.starTint13,
  },
  surgePillText: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.surgeText,
  },
});

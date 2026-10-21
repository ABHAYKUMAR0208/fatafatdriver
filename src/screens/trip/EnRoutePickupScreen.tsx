import React, {useState} from 'react';
import {Pressable, StatusBar, StyleSheet, Text, View} from 'react-native';
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
import {PICKUP_STEP, useTrip} from '@/state/tripStore';
import {callRider, chatWithRider, confirmSos} from '@/utils/tripActions';

// Driving to the pickup point.
export default function EnRoutePickupScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const strings = useStrings();
  const trip = useTrip();
  // TODO: connect to the voice guidance of your navigation SDK
  const [muted, setMuted] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <MapPlaceholder />

      <View style={[styles.bannerWrap, {paddingTop: insets.top + 16}]}>
        <NavBanner
          icon={TRIP_ICONS.turnRight}
          iconSize={18}
          title={PICKUP_STEP.instruction}
          detail={PICKUP_STEP.detail}
          right={
            <RoundButton backgroundColor={colors.chip} onPress={() => setMuted(m => !m)}>
              <TripIcon
                icon={muted ? TRIP_ICONS.volumeOff : TRIP_ICONS.volume}
                size={18}
                color={colors.textGrey}
              />
            </RoundButton>
          }
        />
      </View>

      <View style={styles.spacer} />

      <View style={styles.fabs}>
        {/* TODO: re-centre the real map on the current location */}
        <RoundButton size={48} backgroundColor={colors.background} shadowColor="#000000" style={styles.lightShadow}>
          <TripIcon icon={TRIP_ICONS.myLocation} size={22} color={colors.textDark} />
        </RoundButton>
        <RoundButton size={56} backgroundColor={colors.primary} shadowColor={colors.primary} onPress={confirmSos}>
          <TripIcon icon={TRIP_ICONS.emergency} size={18} color="#FFFFFF" />
        </RoundButton>
      </View>

      <TripSheet>
        <View style={[styles.content, {paddingBottom: 24 + insets.bottom}]}>
          <View style={styles.riderRow}>
            <RiderBadge rider={trip.rider} size={56} nameSize={20} />
            <View style={styles.eta}>
              <Text style={styles.etaValue}>
                {strings.formatString(strings.trip.minutes, String(trip.pickupEtaMin))}
              </Text>
              <Text style={styles.etaSub}>
                {strings.formatString(strings.trip.kmAway, String(trip.pickupDistanceKm))}
              </Text>
            </View>
          </View>

          <View style={styles.pickupCard}>
            <View style={styles.pinCircle}>
              <TripIcon icon={TRIP_ICONS.pin} size={18} color={colors.green} />
            </View>
            <View style={styles.pickupText}>
              <Text style={styles.pickupLabel}>{strings.trip.pickupLocation}</Text>
              <Text style={styles.pickupAddress} numberOfLines={1}>
                {trip.pickup.title}, {trip.pickup.address}
              </Text>
            </View>
          </View>

          <View style={styles.contactRow}>
            <Pressable
              style={({pressed}) => [styles.contact, pressed && styles.pressed]}
              onPress={() => callRider(trip.rider.phone)}>
              <TripIcon icon={TRIP_ICONS.phone} size={16} color={colors.textDark} />
              <Text style={styles.contactText}>{strings.trip.call}</Text>
            </Pressable>
            <Pressable
              style={({pressed}) => [styles.contact, pressed && styles.pressed]}
              onPress={() => chatWithRider(trip.rider.phone)}>
              <TripIcon icon={TRIP_ICONS.message} size={16} color={colors.textDark} />
              <Text style={styles.contactText}>{strings.trip.chat}</Text>
            </Pressable>
          </View>

          <TripButton
            title={strings.trip.iveArrived}
            onPress={() => navigation.navigate('ArrivedWaiting')}
          />
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
  spacer: {
    flex: 1,
  },
  fabs: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  lightShadow: {
    shadowOpacity: 0.13,
  },
  content: {
    paddingHorizontal: 20,
    gap: 20,
  },
  riderRow: {
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
    fontSize: 32,
    color: colors.textDark,
  },
  etaSub: {
    marginTop: 2,
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.tripMuted,
  },
  pickupCard: {
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
    backgroundColor: colors.greenTint8,
  },
  pickupText: {
    flex: 1,
  },
  pickupLabel: {
    fontFamily: fonts.bold,
    fontSize: 11,
    letterSpacing: 0.5,
    color: colors.green,
  },
  pickupAddress: {
    marginTop: 2,
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: colors.textDark,
  },
  contactRow: {
    flexDirection: 'row',
    gap: 12,
  },
  contact: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.chip,
  },
  contactText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.textDark,
  },
  pressed: {
    opacity: 0.85,
  },
});

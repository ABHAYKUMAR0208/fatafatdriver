import React, {useEffect, useState} from 'react';
import {BackHandler, Pressable, StatusBar, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Avatar from '@/components/home/Avatar';
import MapPlaceholder from '@/components/home/MapPlaceholder';
import FadeGradient from '@/components/trip/FadeGradient';
import RoundButton from '@/components/trip/RoundButton';
import TripIcon from '@/components/trip/TripIcon';
import TripSheet from '@/components/trip/TripSheet';
import {colors} from '@/constants/colors';
import {TRIP_ICONS} from '@/constants/iconPathsTrip';
import {fonts} from '@/constants/typography';
import {useStrings} from '@/localization';
import type {RootStackParamList} from '@/navigation/types';
import {useProfilePhoto} from '@/state/profilePhotoStore';
import {ACCEPT_SECONDS, clearTrip, useTrip} from '@/state/tripStore';
import {formatRupees} from '@/utils/formatCurrency';

// New ride request with a countdown. When the time runs out it counts as declined.
export default function IncomingTripScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const strings = useStrings();
  const photoUri = useProfilePhoto();
  const trip = useTrip();
  const [seconds, setSeconds] = useState(ACCEPT_SECONDS);

  const onDecline = () => {
    // TODO: tell your API the request was declined
    clearTrip();
    navigation.goBack();
  };

  const onAccept = () => {
    // TODO: tell your API the request was accepted
    navigation.replace('TripAccepted');
  };

  useEffect(() => {
    const id = setInterval(() => setSeconds(s => Math.max(s - 1, 0)), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (seconds === 0) {
      // TODO: tell your API the request timed out
      clearTrip();
      navigation.replace('RequestExpired');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seconds]);

  // Android back = decline
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onDecline();
      return true;
    });
    return () => sub.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.mapArea}>
        <MapPlaceholder />

        {/* pickup marker with distance */}
        <View style={styles.distanceMarker} pointerEvents="none">
          <View style={styles.distancePill}>
            <Text style={styles.distanceText}>
              {strings.formatString(strings.trip.km, String(trip.pickupDistanceKm))}
            </Text>
          </View>
          <View style={styles.distanceDot} />
        </View>

        {/* drop-off marker */}
        <View style={styles.dropPin} pointerEvents="none">
          <TripIcon icon={TRIP_ICONS.flag} size={9} color="#FFFFFF" />
        </View>

        <FadeGradient id="incomingScrim" color="#FFFFFF" opacity={0.8} style={styles.scrim} />

        <View style={[styles.header, {top: insets.top + 6}]}>
          <View style={styles.avatar}>
            <Avatar uri={photoUri} size={40} flat />
          </View>
          <View style={styles.statusPill}>
            <Text style={styles.statusText}>{strings.trip.online}</Text>
          </View>
          <RoundButton
            backgroundColor={colors.background}
            shadowColor="#000000"
            style={styles.softShadow}
            onPress={() => navigation.navigate('Alerts')}>
            <TripIcon icon={TRIP_ICONS.bell} size={20} color={colors.textDark} />
          </RoundButton>
        </View>
      </View>

      <TripSheet handleGap={16} style={styles.sheet}>
        <View style={[styles.content, {paddingBottom: 28 + insets.bottom}]}>
          <View style={styles.tripHeader}>
            <View>
              <Text style={styles.label}>{strings.trip.incoming}</Text>
              <Text style={styles.fare}>{formatRupees(trip.fare)}</Text>
              <Text style={styles.meta}>
                {strings.formatString(
                  strings.trip.distanceTime,
                  String(trip.distanceKm),
                  String(trip.durationMin),
                )}
              </Text>
            </View>
            <View style={styles.countdown}>
              <Text style={styles.countdownText}>{seconds}</Text>
            </View>
          </View>

          <View style={styles.routeCard}>
            <View style={[styles.stopRow, styles.pickupRow]}>
              <View style={styles.iconCol}>
                <View style={styles.pickupDot} />
                <View style={styles.routeLine} />
              </View>
              <View style={styles.textCol}>
                <Text style={styles.stopLabel}>
                  {strings.formatString(strings.trip.pickupAway, String(trip.pickupDistanceKm))}
                </Text>
                <Text style={styles.stopTitle}>{trip.pickup.title}</Text>
                <Text style={styles.stopAddress}>{trip.pickup.address}</Text>
              </View>
            </View>
            <View style={[styles.stopRow, styles.dropRow]}>
              <View style={styles.iconCol}>
                <View style={styles.dropSquare} />
              </View>
              <View style={styles.textCol}>
                <Text style={styles.stopLabel}>{strings.trip.dropOff}</Text>
                <Text style={styles.stopTitle}>{trip.drop.title}</Text>
                <Text style={styles.stopAddress}>{trip.drop.address}</Text>
              </View>
            </View>
          </View>

          <View style={styles.actions}>
            <Pressable
              style={({pressed}) => [styles.decline, pressed && styles.pressed]}
              onPress={onDecline}>
              <Text style={styles.declineText}>{strings.trip.decline}</Text>
            </Pressable>
            <Pressable
              style={({pressed}) => [styles.accept, pressed && styles.pressed]}
              onPress={onAccept}>
              <Text style={styles.acceptText}>{strings.trip.accept}</Text>
            </Pressable>
          </View>
        </View>
      </TripSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cardBg,
  },
  mapArea: {
    flex: 1,
    minHeight: 200,
  },
  distanceMarker: {
    position: 'absolute',
    top: '27%',
    left: '15%',
    alignItems: 'center',
  },
  distancePill: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: colors.background,
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.13,
    shadowRadius: 8,
  },
  distanceText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.textDark,
  },
  distanceDot: {
    marginTop: 6,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 3,
    borderColor: colors.green,
    backgroundColor: colors.background,
  },
  dropPin: {
    position: 'absolute',
    top: '42%',
    left: '72%',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  scrim: {
    top: '58%',
  },
  header: {
    position: 'absolute',
    left: 16,
    right: 16,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: colors.background,
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.13,
    shadowRadius: 8,
  },
  statusPill: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.background,
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.13,
    shadowRadius: 8,
  },
  statusText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.green,
  },
  softShadow: {
    elevation: 3,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.13,
    shadowRadius: 8,
  },
  sheet: {
    marginTop: -28,
  },
  content: {
    paddingHorizontal: 20,
    gap: 20,
  },
  tripHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontFamily: fonts.bold,
    fontSize: 11,
    letterSpacing: 1,
    color: colors.green,
  },
  fare: {
    marginTop: 4,
    fontFamily: fonts.bold,
    fontSize: 34,
    color: colors.textDark,
  },
  meta: {
    marginTop: 4,
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.tripMuted,
  },
  countdown: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 3,
    borderColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.greenTint6,
  },
  countdownText: {
    fontFamily: fonts.bold,
    fontSize: 22,
    color: colors.green,
  },
  routeCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.background,
  },
  stopRow: {
    flexDirection: 'row',
  },
  pickupRow: {
    paddingBottom: 14,
  },
  dropRow: {
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  iconCol: {
    width: 10,
    paddingTop: 3,
    alignItems: 'center',
  },
  pickupDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.tripMuted,
  },
  routeLine: {
    width: 2,
    height: 36,
    backgroundColor: colors.chipBorder,
  },
  dropSquare: {
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  textCol: {
    flex: 1,
    marginLeft: 14,
  },
  stopLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 11,
    color: colors.tripMuted,
  },
  stopTitle: {
    marginTop: 2,
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.textDark,
  },
  stopAddress: {
    marginTop: 2,
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.tripMuted,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  decline: {
    flex: 1,
    height: 56,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.chipBorder,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.chip,
  },
  declineText: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.textGrey,
  },
  accept: {
    flex: 1,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    elevation: 6,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },
  acceptText: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: '#FFFFFF',
  },
  pressed: {
    opacity: 0.85,
  },
});

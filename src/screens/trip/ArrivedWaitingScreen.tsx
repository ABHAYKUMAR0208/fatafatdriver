import React, {useEffect, useState} from 'react';
import {Pressable, ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MapPlaceholder from '@/components/home/MapPlaceholder';
import CheckBox from '@/components/trip/CheckBox';
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
import {useTrip} from '@/state/tripStore';
import {formatRupees} from '@/utils/formatCurrency';
import {callRider, chatWithRider, confirmSos, nextStartStep} from '@/utils/tripActions';

function formatWait(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// At the pickup point, waiting for the rider to get on.
export default function ArrivedWaitingScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const strings = useStrings();
  const trip = useTrip();
  const [waited, setWaited] = useState(0);
  const [helmetWorn, setHelmetWorn] = useState(false);

  // TODO: tell your API the driver has arrived (starts the rider's wait timer too)
  useEffect(() => {
    const id = setInterval(() => setWaited(s => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const canStart = !trip.needsHelmetCheck || helmetWorn;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.mapArea}>
        <MapPlaceholder />

        <View style={styles.pin} pointerEvents="none">
          <View style={styles.pinPill}>
            <TripIcon icon={TRIP_ICONS.personPin} size={13} color={colors.green} />
            <Text style={styles.pinText}>{strings.trip.youreHere}</Text>
          </View>
          <View style={styles.pinDot} />
        </View>

        <View style={[styles.topBar, {paddingTop: insets.top + 16}]}>
          <RoundButton
            size={44}
            shadowColor="#000000"
            style={styles.menuShadow}
            onPress={() => navigation.navigate('CancelTrip')}>
            <TripIcon icon={TRIP_ICONS.menu} size={18} color={colors.textDark} />
          </RoundButton>
          <Pressable
            style={({pressed}) => [styles.sos, pressed && styles.pressed]}
            onPress={confirmSos}>
            <Text style={styles.sosText}>{strings.trip.sos}</Text>
          </Pressable>
        </View>
      </View>

      <TripSheet handleGap={4} bordered style={styles.sheet}>
        <ScrollView
          bounces={false}
          contentContainerStyle={[styles.content, {paddingBottom: 24 + insets.bottom}]}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.title}>{strings.trip.arrived}</Text>
              <View style={styles.waitRow}>
                <View style={styles.clock}>
                  <TripIcon icon={TRIP_ICONS.timer} size={13} color={colors.star} />
                </View>
                <Text style={styles.waitText}>
                  {strings.formatString(strings.trip.waiting, formatWait(waited))}
                </Text>
              </View>
            </View>
            <View style={styles.fareBox}>
              <Text style={styles.fareLabel}>{strings.trip.estFare}</Text>
              <Text style={styles.fare}>{formatRupees(trip.fare)}</Text>
            </View>
          </View>

          <View style={styles.riderCard}>
            <RiderBadge rider={trip.rider} online dotBorder={colors.cardBg} />
            <View style={styles.riderActions}>
              <RoundButton
                size={44}
                backgroundColor={colors.chip}
                onPress={() => callRider(trip.rider.phone)}>
                <TripIcon icon={TRIP_ICONS.phoneFilled} size={18} color={colors.textDark} />
              </RoundButton>
              <RoundButton
                size={44}
                backgroundColor={colors.greenTint8}
                onPress={() => chatWithRider(trip.rider.phone)}>
                <TripIcon icon={TRIP_ICONS.chat} size={18} color={colors.green} />
              </RoundButton>
            </View>
          </View>

          {trip.needsHelmetCheck ? (
            <View style={styles.checklist}>
              <Text style={styles.checklistTitle}>{strings.trip.checklistTitle}</Text>
              <Pressable style={styles.checkRow} onPress={() => setHelmetWorn(v => !v)}>
                <CheckBox checked={helmetWorn} />
                <Text style={styles.checkText}>{strings.trip.helmetWorn}</Text>
              </Pressable>
              <View style={styles.notice}>
                <TripIcon icon={TRIP_ICONS.info} size={14} color={colors.star} />
                <Text style={styles.noticeText}>{strings.trip.verifyGear}</Text>
              </View>
            </View>
          ) : null}

          <TripButton
            title={strings.trip.startTrip}
            disabled={!canStart}
            onPress={() => navigation.navigate(nextStartStep(trip, 'arrived'))}
          />
        </ScrollView>
      </TripSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mapArea: {
    flex: 1,
    minHeight: 180,
  },
  pin: {
    position: 'absolute',
    top: '62%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  pinPill: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 14,
    backgroundColor: colors.background,
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  pinText: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.textDark,
  },
  pinDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 3,
    borderColor: colors.background,
    backgroundColor: colors.green,
    elevation: 3,
    shadowColor: colors.green,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.38,
    shadowRadius: 12,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  menuShadow: {
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  sos: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 22,
    backgroundColor: colors.primary,
    elevation: 5,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.31,
    shadowRadius: 12,
  },
  sosText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.textDark,
  },
  sheet: {
    marginTop: -28,
    maxHeight: '62%',
  },
  content: {
    paddingTop: 8,
    paddingHorizontal: 20,
    gap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.textDark,
  },
  waitRow: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  clock: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.starTint8,
  },
  waitText: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.star,
  },
  fareBox: {
    padding: 14,
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.cardBg,
  },
  fareLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 11,
    color: colors.tripMuted,
  },
  fare: {
    marginTop: 4,
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.green,
  },
  riderCard: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.cardBg,
  },
  riderActions: {
    marginLeft: 12,
    flexDirection: 'row',
    gap: 10,
  },
  checklist: {
    padding: 16,
    gap: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.cardBg,
  },
  checklistTitle: {
    fontFamily: fonts.bold,
    fontSize: 11,
    letterSpacing: 1,
    color: colors.tripMuted,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkText: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.textDark,
  },
  notice: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 10,
    backgroundColor: colors.warnBg,
  },
  noticeText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 17,
    color: colors.warnText,
  },
  pressed: {
    opacity: 0.85,
  },
});

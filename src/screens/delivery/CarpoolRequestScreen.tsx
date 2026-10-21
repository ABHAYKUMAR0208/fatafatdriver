import React, {useEffect, useState} from 'react';
import {BackHandler, Image, ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Svg, {Circle} from 'react-native-svg';
import {ArrowRightIcon, CheckIcon, UsersIcon} from '@/components/common/Icons';
import ChoiceButtons from '@/components/delivery/ChoiceButtons';
import SheetTitleBar from '@/components/delivery/SheetTitleBar';
import MapPlaceholder from '@/components/home/MapPlaceholder';
import {colors} from '@/constants/colors';
import {fonts} from '@/constants/typography';
import {useStrings} from '@/localization';
import type {RootStackParamList} from '@/navigation/types';
import {CARPOOL_ACCEPT_SECONDS, clearCarpool, useCarpool} from '@/state/deliveryStore';
import {formatRupees} from '@/utils/formatCurrency';

const RING = 56;
const STROKE = 3.4;
const RADIUS = (RING - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// Shared ride offer with several passengers and a 10 second timer.
export default function CarpoolRequestScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const strings = useStrings();
  const carpool = useCarpool();
  const [seconds, setSeconds] = useState(CARPOOL_ACCEPT_SECONDS);

  const onDecline = () => {
    // TODO: tell your API the request was declined
    clearCarpool();
    navigation.goBack();
  };

  useEffect(() => {
    const id = setInterval(() => setSeconds(s => Math.max(s - 1, 0)), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (seconds === 0) {
      clearCarpool();
      navigation.replace('RequestExpired');
    }
  }, [seconds, navigation]);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onDecline();
      return true;
    });
    return () => sub.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const progress = seconds / CARPOOL_ACCEPT_SECONDS;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SheetTitleBar
        title={strings.delivery.goOnline}
        right={<Text style={styles.online}>{strings.delivery.online}</Text>}
      />

      <View style={styles.mapArea}>
        <MapPlaceholder />
        <View style={styles.scrim} />
      </View>

      <View style={styles.sheet}>
        <View style={styles.handle} />
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <View style={styles.summary}>
              <View style={styles.usersCircle}>
                <UsersIcon size={22} color={colors.textSecondary} />
              </View>
              <View>
                <Text style={styles.title}>{strings.delivery.carpoolRequest}</Text>
                <Text style={styles.subtitle}>
                  {strings.formatString(
                    strings.delivery.extraStops,
                    String(Math.max(carpool.passengers.length - 1, 0)),
                  )}
                </Text>
              </View>
            </View>
            <View style={styles.ring}>
              <Svg width={RING} height={RING} style={StyleSheet.absoluteFill}>
                <Circle
                  cx={RING / 2}
                  cy={RING / 2}
                  r={RADIUS}
                  stroke={colors.border}
                  strokeWidth={STROKE}
                  fill="none"
                />
                <Circle
                  cx={RING / 2}
                  cy={RING / 2}
                  r={RADIUS}
                  stroke={colors.star}
                  strokeWidth={STROKE}
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
                  strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
                  transform={`rotate(-90 ${RING / 2} ${RING / 2})`}
                />
              </Svg>
              <Text style={styles.ringText}>{seconds}</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.kicker}>{strings.delivery.costShare}</Text>
            <View style={styles.fareRow}>
              <Text style={styles.fare}>{formatRupees(carpool.fare)}</Text>
              <Text style={styles.fareOld}>{formatRupees(carpool.originalFare)}</Text>
            </View>
            <View style={styles.demand}>
              <CheckIcon size={12} color={colors.green} />
              <Text style={styles.demandText}>{strings.delivery.highDemand}</Text>
            </View>
          </View>

          <View style={styles.bento}>
            <View style={styles.bentoCell}>
              <Text style={styles.bentoLabel}>{strings.delivery.extraTime}</Text>
              <Text style={styles.bentoValue}>+{strings.formatString(strings.delivery.min, String(carpool.extraMin))}</Text>
            </View>
            <View style={styles.bentoCell}>
              <Text style={styles.bentoLabel}>{strings.delivery.totalDistance}</Text>
              <Text style={styles.bentoValue}>{strings.formatString(strings.delivery.km, String(carpool.distanceKm))}</Text>
            </View>
          </View>

          <View style={styles.manifest}>
            <Text style={styles.kicker}>
              {strings.formatString(strings.delivery.passengers, String(carpool.passengers.length))}
            </Text>
            {carpool.passengers.map(p => (
              <View key={p.id} style={styles.rider}>
                <View style={styles.avatar}>
                  {p.photoUri ? (
                    <Image source={{uri: p.photoUri}} style={styles.avatarImg} />
                  ) : (
                    <Text style={styles.avatarText}>{p.name.charAt(0)}</Text>
                  )}
                </View>
                <View style={styles.riderText}>
                  <Text style={styles.riderName}>{p.name}</Text>
                  <Text style={styles.riderPickup} numberOfLines={1}>
                    {p.pickup}
                  </Text>
                </View>
                <Text style={styles.share}>{formatRupees(p.share)}</Text>
              </View>
            ))}
          </View>

          <View style={styles.combined}>
            <Text style={[styles.kicker, styles.kickerPink]}>{strings.delivery.combinedEarnings}</Text>
            <Text style={styles.combinedValue}>{formatRupees(carpool.fare)}</Text>
          </View>

        </ScrollView>

        {/* kept out of the scroll view: the timer is short, Accept must always be visible */}
        <View style={[styles.actions, {paddingBottom: 16 + insets.bottom}]}>
          <ChoiceButtons
            secondary={strings.delivery.decline}
            primary={strings.delivery.acceptAll}
            onSecondary={onDecline}
            // TODO: tell your API the carpool was accepted
            onPrimary={() => navigation.replace('MultiStopManifest')}
            primaryIcon={<ArrowRightIcon size={14} color="#FFFFFF" />}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  online: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.green,
  },
  mapArea: {
    height: 68,
  },
  scrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  sheet: {
    flex: 1,
    marginTop: -12,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: colors.border,
    backgroundColor: colors.background,
    elevation: 12,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: -4},
    shadowOpacity: 0.12,
    shadowRadius: 24,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 2,
    backgroundColor: colors.gray300,
  },
  content: {
    paddingTop: 8,
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  usersCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceAlt,
  },
  title: {
    fontFamily: fonts.semiBold,
    fontSize: 18,
    color: colors.textDark,
  },
  subtitle: {
    marginTop: 2,
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textSecondary,
  },
  ring: {
    width: RING,
    height: RING,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringText: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.star,
  },
  card: {
    padding: 16,
    gap: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  kicker: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    letterSpacing: 0.6,
    color: colors.textSecondary,
  },
  kickerPink: {
    color: colors.primary,
  },
  fareRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  fare: {
    fontFamily: fonts.bold,
    fontSize: 28,
    color: colors.textDark,
  },
  fareOld: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.placeholder,
    textDecorationLine: 'line-through',
  },
  demand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  demandText: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.green,
  },
  bento: {
    flexDirection: 'row',
    gap: 12,
  },
  bentoCell: {
    flex: 1,
    padding: 12,
    gap: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bentoLabel: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textSecondary,
  },
  bentoValue: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.textDark,
  },
  manifest: {
    paddingTop: 8,
    gap: 8,
  },
  rider: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.pinkSoft,
  },
  avatarImg: {
    width: 40,
    height: 40,
  },
  avatarText: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: colors.primary,
  },
  riderText: {
    flex: 1,
  },
  riderName: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: colors.textDark,
  },
  riderPickup: {
    marginTop: 2,
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textSecondary,
  },
  share: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.textDark,
  },
  combined: {
    padding: 16,
    gap: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.roseBorder,
    backgroundColor: colors.roseBg,
  },
  combinedValue: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.textDark,
  },
  actions: {
    paddingTop: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
});

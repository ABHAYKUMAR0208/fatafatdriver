import React from 'react';
import {Pressable, ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MapPlaceholder from '@/components/home/MapPlaceholder';
import RiderBadge from '@/components/trip/RiderBadge';
import RoundButton from '@/components/trip/RoundButton';
import TripButton from '@/components/trip/TripButton';
import TripHeader from '@/components/trip/TripHeader';
import TripIcon from '@/components/trip/TripIcon';
import {colors} from '@/constants/colors';
import {TRIP_ICONS} from '@/constants/iconPathsTrip';
import {fonts} from '@/constants/typography';
import {useStrings} from '@/localization';
import type {RootStackParamList} from '@/navigation/types';
import {useTrip} from '@/state/tripStore';
import {formatRupees} from '@/utils/formatCurrency';
import {callRider, chatWithRider} from '@/utils/tripActions';

// Shown right after accepting: rider, fare, route and the way to pickup.
export default function TripAcceptedScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const strings = useStrings();
  const trip = useTrip();
  const pickupKm = String(trip.pickupDistanceKm);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <TripHeader
        title={strings.trip.summaryTitle}
        left={
          // leaving an accepted trip means cancelling it
          <RoundButton onPress={() => navigation.navigate('CancelTrip')}>
            <TripIcon icon={TRIP_ICONS.chevronLeft} size={11} color={colors.textDark} />
          </RoundButton>
        }
        right={
          // TODO: open Help & Support once Module 10 is built
          <RoundButton backgroundColor={colors.dangerBg}>
            <TripIcon icon={TRIP_ICONS.helpCircle} size={18} color={colors.primary} />
          </RoundButton>
        }
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.map}>
          <MapPlaceholder />

          <View style={styles.bannerWrap} pointerEvents="none">
            <View style={styles.banner}>
              <View style={styles.bannerCheck}>
                <TripIcon icon={TRIP_ICONS.checkSmall} size={10} color="#FFFFFF" />
              </View>
              <Text style={styles.bannerText}>{strings.trip.accepted}</Text>
            </View>
          </View>

          <View style={styles.pickupPin} pointerEvents="none">
            <View style={styles.pinPill}>
              <Text style={styles.pinText}>
                {strings.formatString(strings.trip.km, pickupKm)}
              </Text>
            </View>
            <View style={styles.pinDot} />
          </View>
          <View style={styles.dropPin} pointerEvents="none" />
        </View>

        <View style={styles.content}>
          <View style={styles.profileRow}>
            <RiderBadge
              rider={trip.rider}
              size={52}
              nameSize={18}
              extra={strings.formatString(strings.trip.tripsCount, String(trip.rider.trips)) as string}
            />
            <View style={styles.fareCol}>
              <Text style={styles.fare}>{formatRupees(trip.fare)}</Text>
              <View style={styles.payPill}>
                <Text style={styles.payText}>
                  {trip.payment === 'cash' ? strings.trip.cash : strings.trip.onlinePayment}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.route}>
            <View style={styles.block}>
              <View style={styles.iconCol}>
                <View style={styles.pickupRing} />
                <View style={styles.routeLine} />
              </View>
              <View style={styles.textCol}>
                <View style={styles.labelRow}>
                  <Text style={[styles.label, styles.labelGreen]}>
                    {strings.formatString(strings.trip.pickupKm, pickupKm)}
                  </Text>
                  <View style={styles.etaPill}>
                    <Text style={styles.etaText}>
                      {strings.formatString(strings.trip.etaMin, String(trip.pickupEtaMin))}
                    </Text>
                  </View>
                </View>
                <Text style={styles.address}>
                  {trip.pickup.title}, {trip.pickup.address}
                </Text>
              </View>
            </View>
            <View style={styles.block}>
              <View style={styles.iconCol}>
                <View style={styles.dropSquare} />
              </View>
              <View style={styles.textCol}>
                <Text style={styles.label}>{strings.trip.dropOff}</Text>
                <Text style={[styles.address, styles.dropAddress]}>
                  {trip.drop.title}, {trip.drop.address}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.contactRow}>
            <Pressable
              style={({pressed}) => [styles.contact, styles.callBtn, pressed && styles.pressed]}
              onPress={() => callRider(trip.rider.phone)}>
              <TripIcon icon={TRIP_ICONS.phone} size={16} color="#FFFFFF" />
              <Text style={[styles.contactText, styles.callText]}>{strings.trip.call}</Text>
            </Pressable>
            <Pressable
              style={({pressed}) => [styles.contact, styles.chatBtn, pressed && styles.pressed]}
              onPress={() => chatWithRider(trip.rider.phone)}>
              <TripIcon icon={TRIP_ICONS.message} size={16} color={colors.textDark} />
              <Text style={styles.contactText}>{strings.trip.chat}</Text>
            </Pressable>
          </View>

          {trip.needsHelmetCheck || trip.needsIdentityCheck ? (
            <View style={styles.warning}>
              <TripIcon icon={TRIP_ICONS.alert} size={15} color={colors.primary} />
              <Text style={styles.warningText}>{strings.trip.verificationNote}</Text>
            </View>
          ) : null}

          <Pressable hitSlop={8} onPress={() => navigation.navigate('CancelTrip')}>
            <Text style={styles.cancel}>{strings.trip.cancelTrip}</Text>
          </Pressable>
        </View>
      </ScrollView>

      <View style={[styles.footer, {paddingBottom: 32 + insets.bottom}]}>
        <TripButton
          title={strings.trip.startNavigation}
          icon={<TripIcon icon={TRIP_ICONS.navigation} size={18} color="#FFFFFF" />}
          onPress={() => navigation.navigate('EnRoutePickup')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  map: {
    height: 220,
    overflow: 'hidden',
  },
  bannerWrap: {
    position: 'absolute',
    top: 16,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  banner: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.greenTint19,
    backgroundColor: colors.scrim,
  },
  bannerCheck: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.green,
  },
  bannerText: {
    marginLeft: 8,
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.green,
  },
  pickupPin: {
    position: 'absolute',
    top: 130,
    left: '26%',
    alignItems: 'center',
  },
  pinPill: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.green,
    backgroundColor: colors.background,
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.13,
    shadowRadius: 6,
  },
  pinText: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.textDark,
  },
  pinDot: {
    marginTop: 4,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 4,
    borderColor: colors.green,
    backgroundColor: colors.background,
  },
  dropPin: {
    position: 'absolute',
    top: 88,
    left: '64%',
    width: 14,
    height: 14,
    borderRadius: 3,
    borderWidth: 2,
    borderColor: colors.background,
    backgroundColor: colors.primary,
  },
  content: {
    padding: 20,
    gap: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: colors.background,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fareCol: {
    marginLeft: 12,
    alignItems: 'flex-end',
  },
  fare: {
    fontFamily: fonts.bold,
    fontSize: 28,
    color: colors.textDark,
  },
  payPill: {
    marginTop: 4,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: colors.cardBorder,
  },
  payText: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: colors.textGrey,
  },
  divider: {
    height: 1,
    backgroundColor: colors.cardBorder,
  },
  route: {
    padding: 16,
    gap: 16,
    borderRadius: 16,
    backgroundColor: colors.cardBg,
  },
  block: {
    flexDirection: 'row',
  },
  iconCol: {
    width: 12,
    alignItems: 'center',
  },
  pickupRing: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 3,
    borderColor: colors.green,
    backgroundColor: colors.background,
  },
  routeLine: {
    width: 2,
    height: 28,
    backgroundColor: colors.checkBorder,
  },
  dropSquare: {
    width: 12,
    height: 12,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  textCol: {
    flex: 1,
    marginLeft: 14,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontFamily: fonts.bold,
    fontSize: 11,
    letterSpacing: 0.5,
    color: colors.tripMuted,
  },
  labelGreen: {
    color: colors.green,
  },
  etaPill: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: colors.greenTint8,
  },
  etaText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.green,
  },
  address: {
    marginTop: 4,
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: colors.textDark,
  },
  dropAddress: {
    marginTop: 4,
  },
  contactRow: {
    flexDirection: 'row',
    gap: 12,
  },
  contact: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  callBtn: {
    backgroundColor: colors.primary,
  },
  chatBtn: {
    borderWidth: 1,
    borderColor: colors.chipBorder,
    backgroundColor: colors.chip,
  },
  contactText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.textDark,
  },
  callText: {
    color: '#FFFFFF',
  },
  warning: {
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primaryTint13,
    backgroundColor: colors.dangerBgSoft,
  },
  warningText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 18,
    color: colors.primary,
  },
  cancel: {
    textAlign: 'center',
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.tripMuted,
  },
  footer: {
    paddingTop: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    backgroundColor: colors.background,
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: -4},
    shadowOpacity: 0.06,
    shadowRadius: 16,
  },
  pressed: {
    opacity: 0.85,
  },
});

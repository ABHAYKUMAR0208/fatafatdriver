import React from 'react';
import {Linking, Pressable, StatusBar, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {MessageIcon, PhoneIcon} from '@/components/common/Icons';
import RouteMap from '@/components/delivery/RouteMap';
import TripButton from '@/components/trip/TripButton';
import {colors} from '@/constants/colors';
import {fonts} from '@/constants/typography';
import {useStrings} from '@/localization';
import type {RootStackParamList} from '@/navigation/types';
import {currentStop, useDelivery} from '@/state/deliveryStore';
import {callRider, chatWithRider} from '@/utils/tripActions';

// Driving the parcel to the current stop.
export default function ParcelInTransitScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const strings = useStrings();
  const delivery = useDelivery();
  const stop = currentStop(delivery) ?? delivery.stops[0];
  const isFirst = stop.id === delivery.stops[0].id;
  // TODO: take the live distance / ETA from your navigation SDK
  const km = isFirst ? delivery.distanceKm : 2.3;
  const min = isFirst ? delivery.durationMin : stop.extraMin ?? 8;

  const onNavigate = () => {
    // hands over to Google Maps turn-by-turn
    const q = encodeURIComponent(stop.address);
    Linking.openURL(`google.navigation:q=${q}`).catch(() =>
      Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${q}`).catch(() => {}),
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <RouteMap
        routeLabel={strings.formatString(strings.delivery.distanceTime, String(km), String(min)) as string}
      />

      <View style={[styles.card, {paddingBottom: 20 + insets.bottom}]}>
        <View style={styles.handle} />

        <View>
          <Text style={styles.kicker}>{strings.delivery.delivering}</Text>
          <Text style={styles.name}>{stop.recipient}</Text>
          <Text style={styles.address}>{stop.address}</Text>
        </View>

        <View style={styles.status}>
          <View>
            <Text style={styles.statLabel}>{strings.delivery.distance.toUpperCase()}</Text>
            <Text style={styles.statValue}>{strings.formatString(strings.delivery.km, String(km))}</Text>
          </View>
          <View style={styles.statRight}>
            <Text style={styles.statLabel}>{strings.delivery.eta}</Text>
            <Text style={styles.statValue}>{strings.formatString(strings.delivery.min, String(min))}</Text>
          </View>
        </View>

        <View style={styles.contacts}>
          <Pressable
            style={({pressed}) => [styles.contact, styles.call, pressed && styles.pressed]}
            onPress={() => callRider(stop.phone)}>
            <PhoneIcon size={16} color={colors.textLabel} />
            <Text style={styles.contactText}>{strings.delivery.call}</Text>
          </Pressable>
          <Pressable
            style={({pressed}) => [styles.contact, styles.chat, pressed && styles.pressed]}
            onPress={() => chatWithRider(stop.phone)}>
            <MessageIcon size={16} color={colors.textLabel} />
            <Text style={styles.contactText}>{strings.delivery.chat}</Text>
          </Pressable>
        </View>

        <TripButton
          title={strings.delivery.navigateToStop}
          style={styles.navigate}
          textStyle={styles.navigateText}
          onPress={onNavigate}
        />
        <TripButton
          title={strings.delivery.arrivedAtStop}
          variant="grey"
          onPress={() => navigation.navigate('DropVerification')}
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
  card: {
    marginTop: -28,
    paddingTop: 20,
    paddingHorizontal: 20,
    gap: 16,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: colors.background,
    elevation: 12,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: -8},
    shadowOpacity: 0.07,
    shadowRadius: 24,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
  },
  kicker: {
    fontFamily: fonts.bold,
    fontSize: 12,
    letterSpacing: 0.6,
    color: colors.primary,
  },
  name: {
    marginTop: 4,
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.textDark,
  },
  address: {
    marginTop: 4,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textSecondary,
  },
  status: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  statRight: {
    alignItems: 'flex-end',
  },
  statLabel: {
    fontFamily: fonts.bold,
    fontSize: 12,
    letterSpacing: 0.6,
    color: colors.textSecondary,
  },
  statValue: {
    marginTop: 4,
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.textDark,
  },
  contacts: {
    flexDirection: 'row',
    gap: 12,
  },
  contact: {
    height: 52,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.ringFill,
  },
  call: {
    width: 112,
  },
  chat: {
    flex: 1,
  },
  pressed: {
    opacity: 0.85,
  },
  contactText: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.textLabel,
  },
  navigate: {
    height: 52,
  },
  navigateText: {
    fontSize: 16,
  },
});

import React, {useEffect} from 'react';
import {BackHandler, StatusBar, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {MapPinIcon, PackageIcon} from '@/components/common/Icons';
import ChoiceButtons from '@/components/delivery/ChoiceButtons';
import RouteMap from '@/components/delivery/RouteMap';
import {colors} from '@/constants/colors';
import {fonts} from '@/constants/typography';
import {useStrings} from '@/localization';
import type {RootStackParamList} from '@/navigation/types';
import {clearDelivery, useDelivery} from '@/state/deliveryStore';
import {formatRupees} from '@/utils/formatCurrency';

// New parcel request: package details, pickup and drop-off.
export default function DeliveryRequestScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const strings = useStrings();
  const delivery = useDelivery();
  const first = delivery.stops[0];
  const last = delivery.stops[delivery.stops.length - 1];
  const totalKg = delivery.stops.reduce((sum, s) => sum + s.weightKg, 0);

  const onDecline = () => {
    // TODO: tell your API the request was declined
    clearDelivery();
    navigation.goBack();
  };

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onDecline();
      return true;
    });
    return () => sub.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rows = [
    {label: strings.delivery.package, value: strings.delivery.sizes[first.packageSize]},
    {label: strings.delivery.weight, value: strings.formatString(strings.delivery.kg, totalKg.toFixed(1))},
    {label: strings.delivery.estimatedFare, value: formatRupees(delivery.fare)},
    {label: strings.delivery.distance, value: strings.formatString(strings.delivery.km, String(delivery.distanceKm))},
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <RouteMap
        routeLabel={
          strings.formatString(
            strings.delivery.distanceTime,
            String(delivery.distanceKm),
            String(delivery.durationMin),
          ) as string
        }
      />

      <View style={[styles.card, {paddingBottom: 20 + insets.bottom}]}>
        <View style={styles.handle} />

        <View style={styles.header}>
          <View style={styles.titleBlock}>
            <Text style={styles.kicker}>{strings.delivery.requestLabel}</Text>
            <Text style={styles.title}>{strings.delivery.requestTitle}</Text>
          </View>
          <View style={styles.packageIcon}>
            <PackageIcon size={18} color={colors.primary} />
          </View>
        </View>

        <View style={styles.details}>
          {rows.map(r => (
            <View key={r.label} style={styles.detailRow}>
              <Text style={styles.detailLabel}>{r.label}</Text>
              <Text style={styles.detailValue}>{r.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.addresses}>
          <View style={styles.address}>
            <View style={[styles.pin, styles.pinPickup]}>
              <MapPinIcon size={14} color="#FFFFFF" />
            </View>
            <View style={styles.addressText}>
              <Text style={[styles.addressLabel, styles.pickupLabel]}>{strings.delivery.pickup}</Text>
              <Text style={styles.addressValue} numberOfLines={1}>
                {delivery.pickupAddress}
              </Text>
            </View>
          </View>
          <View style={styles.address}>
            <View style={[styles.pin, styles.pinDrop]}>
              <MapPinIcon size={14} color="#FFFFFF" />
            </View>
            <View style={styles.addressText}>
              <Text style={[styles.addressLabel, styles.dropLabel]}>{strings.delivery.dropoff}</Text>
              <Text style={styles.addressValue} numberOfLines={1}>
                {last.address}
              </Text>
            </View>
          </View>
        </View>

        <ChoiceButtons
          layout="wide"
          height={52}
          radius={14}
          secondary={strings.delivery.decline}
          primary={strings.delivery.accept}
          onSecondary={onDecline}
          // TODO: tell your API the request was accepted
          onPrimary={() => navigation.replace('ParcelPickup')}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleBlock: {
    flexShrink: 1,
  },
  kicker: {
    fontFamily: fonts.bold,
    fontSize: 12,
    letterSpacing: 0.6,
    color: colors.primary,
  },
  title: {
    marginTop: 4,
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.textDark,
  },
  packageIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.peach,
  },
  details: {
    padding: 16,
    gap: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.textSecondary,
  },
  detailValue: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.textDark,
  },
  addresses: {
    gap: 12,
  },
  address: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pin: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinPickup: {
    backgroundColor: colors.primary,
  },
  pinDrop: {
    backgroundColor: colors.green,
  },
  addressText: {
    flex: 1,
  },
  addressLabel: {
    fontFamily: fonts.bold,
    fontSize: 12,
    letterSpacing: 0.6,
  },
  pickupLabel: {
    color: colors.primary,
  },
  dropLabel: {
    color: colors.green,
  },
  addressValue: {
    marginTop: 2,
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.textDark,
  },
});

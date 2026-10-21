import React, {useEffect} from 'react';
import {BackHandler, ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ClockIcon, MapPinIcon, PackageIcon} from '@/components/common/Icons';
import DetailHeader from '@/components/delivery/DetailHeader';
import StatusPill from '@/components/delivery/StatusPill';
import TripButton from '@/components/trip/TripButton';
import {colors} from '@/constants/colors';
import {fonts} from '@/constants/typography';
import {useStrings} from '@/localization';
import type {RootStackParamList} from '@/navigation/types';
import {currentStop, useDelivery} from '@/state/deliveryStore';

// All drop-offs of a multi-parcel trip, in order.
export default function SequentialDropoffsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const strings = useStrings();
  const delivery = useDelivery();
  const current = currentStop(delivery);
  const remaining = delivery.stops.filter(s => !s.done).length;
  const currentIndex = current ? delivery.stops.indexOf(current) : delivery.stops.length - 1;

  // the parcels are on board: back would abandon them
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => sub.remove();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <DetailHeader
        title={strings.delivery.multipleDropoffs}
        onBack={() => navigation.navigate('ParcelInTransit')}
      />

      <ScrollView contentContainerStyle={[styles.content, {paddingBottom: 20 + insets.bottom}]}>
        <View style={styles.summary}>
          <View>
            <Text style={styles.kicker}>{strings.delivery.currentTrip}</Text>
            <Text style={styles.summaryValue}>
              {remaining === 1
                ? strings.delivery.oneStopRemaining
                : strings.formatString(strings.delivery.stopsRemaining, String(remaining))}
            </Text>
          </View>
          <View style={styles.summaryRight}>
            <Text style={styles.kicker}>{strings.delivery.nextStop}</Text>
            <Text style={styles.summaryValue}>
              {strings.formatString(
                strings.delivery.stopOf,
                String(currentIndex + 1),
                String(delivery.stops.length),
              )}
            </Text>
          </View>
        </View>

        {delivery.stops.map((stop, i) => {
          const isCurrent = stop.id === current?.id;
          const size = strings.delivery.sizes[stop.packageSize];
          return (
            <View
              key={stop.id}
              style={[styles.stop, isCurrent && styles.stopCurrent, stop.done && styles.stopDone]}>
              <View style={styles.stopHead}>
                <View style={styles.stopWho}>
                  <View style={[styles.number, isCurrent && styles.numberCurrent]}>
                    <Text style={[styles.numberText, isCurrent && styles.numberTextCurrent]}>
                      {i + 1}
                    </Text>
                  </View>
                  <View style={styles.flex}>
                    <Text style={styles.name}>{stop.recipient}</Text>
                    <Text style={styles.place}>{stop.place}</Text>
                  </View>
                </View>
                <StatusPill
                  label={
                    stop.done
                      ? strings.delivery.done
                      : isCurrent
                      ? strings.delivery.current
                      : strings.delivery.pending
                  }
                  tone={isCurrent ? 'solid' : stop.done ? 'pink' : 'grey'}
                />
              </View>

              <View style={styles.line}>
                <PackageIcon size={14} color={isCurrent ? colors.primary : colors.textSecondary} />
                <Text style={styles.lineText}>
                  {strings.formatString(strings.delivery.sizeWeight, size, String(stop.weightKg))}
                </Text>
              </View>
              {stop.note ? (
                <View style={styles.line}>
                  {isCurrent || !stop.extraMin ? (
                    <MapPinIcon size={14} color={colors.textSecondary} />
                  ) : (
                    <ClockIcon size={14} color={colors.textSecondary} />
                  )}
                  <Text style={styles.lineText}>
                    {!isCurrent && stop.extraMin
                      ? strings.formatString(strings.delivery.extraNote, String(stop.extraMin), stop.note)
                      : stop.note}
                  </Text>
                </View>
              ) : null}

              {isCurrent ? (
                <TripButton
                  title={strings.delivery.navigateToStop}
                  style={styles.navigate}
                  textStyle={styles.navigateText}
                  onPress={() => navigation.navigate('ParcelInTransit')}
                />
              ) : null}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flexShrink: 1,
  },
  content: {
    padding: 20,
    gap: 16,
  },
  summary: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  summaryRight: {
    alignItems: 'flex-end',
  },
  kicker: {
    fontFamily: fonts.bold,
    fontSize: 12,
    letterSpacing: 0.6,
    color: colors.textSecondary,
  },
  summaryValue: {
    marginTop: 4,
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.textDark,
  },
  stop: {
    padding: 16,
    gap: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  stopCurrent: {
    borderColor: colors.primary,
    backgroundColor: colors.roseBg,
  },
  stopDone: {
    opacity: 0.6,
  },
  stopHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stopWho: {
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  number: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.ringFill,
  },
  numberCurrent: {
    backgroundColor: colors.primary,
  },
  numberText: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.textLabel,
  },
  numberTextCurrent: {
    color: '#FFFFFF',
  },
  name: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.textDark,
  },
  place: {
    marginTop: 2,
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textSecondary,
  },
  line: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  lineText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 17,
    color: colors.textSecondary,
  },
  navigate: {
    height: 48,
  },
  navigateText: {
    fontSize: 16,
  },
});

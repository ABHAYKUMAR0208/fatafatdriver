import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import MdiIcon from '@/components/common/MdiIcon';
import {MDI_DOCS} from '@/constants/iconPathsDocs';
import {MDI_TRIP_HISTORY} from '@/constants/iconPathsTripHistory';
import {fonts} from '@/constants/typography';
import type {TripHistoryItem} from '@/state/tripHistoryStore';
import {formatRupees} from '@/utils/formatCurrency';
import {formatKm, formatTripTime} from '@/utils/tripHistory';
import VehicleIcon from './VehicleIcon';

const C = {
  ink: '#111827',
  grey: '#9CA3AF',
  body: '#374151',
  line: '#EEF0F3',
  border: '#EEF0F3',
  tile: '#F3F4F6',
  green: '#16A34A',
  red: '#DC2626',
  stop: '#F5A81C',
  dot: '#6B7280',
  track: '#D1D5DB',
};

type Props = {
  trip: TripHistoryItem;
  completedLabel: string;
  cancelledLabel: string;
};

export default function TripCard({trip, completedLabel, cancelledLabel}: Props) {
  const done = trip.status === 'completed';
  const statusColor = done ? C.green : C.red;

  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <View style={styles.tile}>
          <VehicleIcon vehicle={trip.vehicle} size={24} color={C.ink} />
        </View>
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {trip.name}
          </Text>
          <Text style={styles.meta} numberOfLines={1}>
            {`${formatTripTime(trip.startedAt)} • ${formatKm(trip.distanceKm)}`}
          </Text>
        </View>
        <View style={styles.right}>
          <Text style={[styles.fare, !done && styles.fareCancelled]}>
            {formatRupees(trip.fare, 2)}
          </Text>
          <View style={styles.statusRow}>
            <MdiIcon
              path={done ? MDI_DOCS.checkCircleOutline : MDI_TRIP_HISTORY.closeCircleOutline}
              size={14}
              color={statusColor}
            />
            <Text style={[styles.status, {color: statusColor}]}>
              {done ? completedLabel : cancelledLabel}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.route}>
        <View style={styles.timeline}>
          <View style={styles.dot} />
          <View style={styles.line} />
          <View style={styles.square} />
        </View>
        <View style={styles.stops}>
          <Text style={styles.stopText} numberOfLines={1}>
            {trip.pickup}
          </Text>
          <Text style={styles.stopText} numberOfLines={1}>
            {trip.drop}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },

  top: {flexDirection: 'row', alignItems: 'center'},
  tile: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: C.tile,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {flex: 1, marginLeft: 12, marginRight: 8},
  name: {fontFamily: fonts.bold, fontSize: 16, lineHeight: 22, color: C.ink},
  meta: {marginTop: 1, fontFamily: fonts.regular, fontSize: 13, lineHeight: 18, color: C.grey},
  right: {alignItems: 'flex-end'},
  fare: {fontFamily: fonts.bold, fontSize: 18, lineHeight: 24, color: C.green},
  fareCancelled: {color: C.grey, textDecorationLine: 'line-through'},
  statusRow: {marginTop: 2, flexDirection: 'row', alignItems: 'center', gap: 4},
  status: {fontFamily: fonts.semiBold, fontSize: 12, lineHeight: 16},

  divider: {marginTop: 14, height: 1, backgroundColor: C.line},

  route: {marginTop: 14, flexDirection: 'row'},
  // the grey dot sits on the first line, the amber square on the second
  timeline: {width: 10, marginRight: 14, alignItems: 'center', paddingVertical: 5},
  dot: {width: 10, height: 10, borderRadius: 5, backgroundColor: C.dot},
  line: {flex: 1, width: 1.5, marginVertical: 3, backgroundColor: C.track},
  square: {width: 10, height: 10, borderRadius: 2, backgroundColor: C.stop},
  stops: {flex: 1, gap: 12},
  stopText: {fontFamily: fonts.regular, fontSize: 15, lineHeight: 20, color: C.body},
});

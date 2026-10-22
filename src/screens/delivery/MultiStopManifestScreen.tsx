import React from 'react';
import {Pressable, ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ArrowLeftIcon} from '@/components/common/Icons';
import StatusPill from '@/components/delivery/StatusPill';
import MapPlaceholder from '@/components/home/MapPlaceholder';
import TripButton from '@/components/trip/TripButton';
import {colors} from '@/constants/colors';
import {fonts} from '@/constants/typography';
import {useStrings} from '@/localization';
import type {RootStackParamList} from '@/navigation/types';
import {boardPassenger, useCarpool} from '@/state/deliveryStore';

// Carpool pickups in order. Tap a passenger who hasn't boarded to cancel their stop.
export default function MultiStopManifestScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const strings = useStrings();
  const carpool = useCarpool();
  const passengers = carpool.passengers;
  const allBoarded = passengers.length > 0 && passengers.every(p => p.status === 'boarded');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={[styles.header, {paddingTop: insets.top}]}>
        <View style={styles.headerRow}>
          <Pressable style={styles.back} onPress={() => navigation.goBack()} hitSlop={6}>
            <ArrowLeftIcon size={18} color={colors.textDark} />
          </Pressable>
          <Text style={styles.headerTitle}>{strings.delivery.multiStopPickup}</Text>
        </View>
      </View>

      <View style={styles.mapArea}>
        <MapPlaceholder />
      </View>

      <View style={styles.sheet}>
        <View style={styles.handle} />
        <ScrollView contentContainerStyle={[styles.content, {paddingBottom: 20 + insets.bottom}]}>
          <Text style={styles.title}>
            {strings.formatString(strings.delivery.pickupManifest, String(passengers.length))}
          </Text>

          {passengers.map((p, i) => {
            const arrived = p.status === 'arrived';
            return (
              <Pressable
                key={p.id}
                disabled={p.status === 'boarded'}
                onPress={() => navigation.navigate('CancelStop', {passengerId: p.id})}
                style={styles.card}>
                <View style={styles.cardHead}>
                  <View style={styles.who}>
                    <View style={styles.number}>
                      <Text style={styles.numberText}>{i + 1}</Text>
                    </View>
                    <View style={styles.flex}>
                      <Text style={styles.name}>{p.name}</Text>
                      <Text style={styles.pickup} numberOfLines={1}>
                        {strings.formatString(strings.delivery.pickupAt, p.pickup)}
                      </Text>
                    </View>
                  </View>
                  <StatusPill
                    label={strings.delivery.statuses[p.status]}
                    tone={p.status === 'upcoming' ? 'grey' : 'pink'}
                  />
                </View>
                {arrived ? (
                  <Pressable
                    style={({pressed}) => [styles.board, pressed && styles.pressed]}
                    onPress={() => boardPassenger(p.id)}>
                    <Text style={styles.boardText}>{strings.delivery.confirmBoarded}</Text>
                  </Pressable>
                ) : null}
              </Pressable>
            );
          })}

          {allBoarded ? (
            <TripButton
              title={strings.delivery.startRide}
              // everyone is on board: Fare Match first, then the Module 6 active trip screen
              onPress={() => navigation.replace('FareMatch', {next: 'ActiveTrip'})}
            />
          ) : null}
        </ScrollView>
      </View>
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
  header: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  headerRow: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.ringFill,
  },
  headerTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 18,
    color: colors.textDark,
  },
  mapArea: {
    height: 200,
  },
  sheet: {
    flex: 1,
    marginTop: -24,
    paddingTop: 8,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: colors.border,
    backgroundColor: colors.background,
    elevation: 12,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: -8},
    shadowOpacity: 0.08,
    shadowRadius: 24,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    marginBottom: 16,
    borderRadius: 2,
    backgroundColor: colors.gray300,
  },
  content: {
    paddingHorizontal: 20,
    gap: 16,
  },
  title: {
    marginBottom: 8,
    fontFamily: fonts.semiBold,
    fontSize: 18,
    color: colors.textDark,
  },
  card: {
    padding: 16,
    gap: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    elevation: 1,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.04,
    shadowRadius: 10,
  },
  cardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  who: {
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  number: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.pinkPill,
  },
  numberText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.primary,
  },
  name: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.textDark,
  },
  pickup: {
    marginTop: 2,
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textSecondary,
  },
  board: {
    marginTop: 8,
    height: 54,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  pressed: {
    opacity: 0.85,
  },
  boardText: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: '#FFFFFF',
  },
});

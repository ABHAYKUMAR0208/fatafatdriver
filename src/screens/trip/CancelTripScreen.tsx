import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import TripButton from '@/components/trip/TripButton';
import TripSheet from '@/components/trip/TripSheet';
import {colors} from '@/constants/colors';
import {fonts} from '@/constants/typography';
import {useStrings} from '@/localization';
import type {RootStackParamList} from '@/navigation/types';
import {finishTrip} from '@/utils/tripActions';

const REASONS = ['noShow', 'wrongLocation', 'vehicleIssue', 'safety'] as const;
type Reason = (typeof REASONS)[number];

// Bottom sheet over the current trip screen: pick a reason, then cancel.
export default function CancelTripScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const strings = useStrings();
  const [reason, setReason] = useState<Reason>('noShow');

  const onConfirm = () => {
    // TODO: send the cancellation and `reason` to your API
    finishTrip(navigation, true);
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.backdrop} onPress={() => navigation.goBack()} />

      <TripSheet handleGap={20} bordered>
        <View style={[styles.content, {paddingBottom: 36 + insets.bottom}]}>
          <Text style={styles.title}>{strings.trip.cancelTrip}</Text>
          <Text style={styles.subtitle}>{strings.trip.cancelSubtitle}</Text>

          <View style={styles.reasons}>
            {REASONS.map(r => {
              const selected = r === reason;
              return (
                <Pressable
                  key={r}
                  style={[styles.reason, selected && styles.reasonSelected]}
                  onPress={() => setReason(r)}>
                  {selected ? (
                    <View style={styles.radioOn}>
                      <View style={styles.radioDot} />
                    </View>
                  ) : (
                    <View style={styles.radioOff} />
                  )}
                  <Text style={[styles.reasonText, selected && styles.reasonTextSelected]}>
                    {strings.trip.reasons[r]}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.actions}>
            <TripButton
              title={strings.trip.confirmCancel}
              textStyle={styles.confirmText}
              onPress={onConfirm}
            />
            <TripButton
              title={strings.trip.keepTrip}
              variant="grey"
              onPress={() => navigation.goBack()}
            />
          </View>
        </View>
      </TripSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  content: {
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.textDark,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 20,
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.tripMuted,
  },
  reasons: {
    gap: 10,
  },
  reason: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.optionBorder,
    backgroundColor: colors.background,
  },
  reasonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.dangerBg,
  },
  radioOff: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.checkBorder,
  },
  radioOn: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  reasonText: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.textDark,
  },
  reasonTextSelected: {
    fontFamily: fonts.semiBold,
  },
  actions: {
    paddingTop: 24,
    gap: 12,
  },
  confirmText: {
    fontSize: 16,
  },
});

import React, {useState} from 'react';
import {Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  AlertTriangleIcon,
  CheckIcon,
  MapPinIcon,
  PackageIcon,
  UserXIcon,
  XCircleIcon,
} from '@/components/common/Icons';
import SheetTitleBar from '@/components/delivery/SheetTitleBar';
import {colors} from '@/constants/colors';
import {fonts} from '@/constants/typography';
import {useStrings} from '@/localization';
import type {RootStackParamList} from '@/navigation/types';
import {removePassenger, useCarpool} from '@/state/deliveryStore';

type Props = NativeStackScreenProps<RootStackParamList, 'CancelStop'>;

const REASONS = ['noShow', 'unsafe', 'luggage', 'riderCancel'] as const;
type Reason = (typeof REASONS)[number];

const ICONS: Record<Reason, typeof UserXIcon> = {
  noShow: UserXIcon,
  unsafe: AlertTriangleIcon,
  luggage: PackageIcon,
  riderCancel: XCircleIcon,
};

// Remove one passenger from a carpool without cancelling the whole trip.
export default function CancelStopScreen({navigation, route}: Props) {
  const insets = useSafeAreaInsets();
  const strings = useStrings();
  const carpool = useCarpool();
  const index = carpool.passengers.findIndex(p => p.id === route.params.passengerId);
  const passenger = carpool.passengers[index];
  const [reason, setReason] = useState<Reason | undefined>();
  const [note, setNote] = useState('');

  if (!passenger) {
    return null;
  }

  const onConfirm = () => {
    // TODO: send the reason and note to your API
    removePassenger(passenger.id);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SheetTitleBar title={strings.delivery.cancelStop} onClose={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.context}>
          <View style={styles.contextHead}>
            <View style={styles.pinCircle}>
              <MapPinIcon size={16} color={colors.textSecondary} />
            </View>
            <View style={styles.flex}>
              <Text style={styles.contextTitle}>
                {strings.formatString(strings.delivery.removeStop, passenger.name)}
              </Text>
              <Text style={styles.contextSub}>
                {strings.formatString(
                  strings.delivery.stopPosition,
                  String(index + 1),
                  String(carpool.passengers.length),
                  passenger.pickup,
                )}
              </Text>
            </View>
          </View>
          <View style={styles.warning}>
            <AlertTriangleIcon size={20} color={colors.star} />
            <Text style={styles.warningText}>{strings.delivery.removeWarning}</Text>
          </View>
        </View>

        <Text style={styles.kicker}>{strings.delivery.selectReason}</Text>
        {REASONS.map(r => {
          const Icon = ICONS[r];
          const selected = r === reason;
          return (
            <Pressable
              key={r}
              style={[styles.reason, selected && styles.reasonOn]}
              onPress={() => setReason(r)}>
              <View style={styles.reasonLeft}>
                <Icon size={20} color={selected ? colors.primary : colors.textSecondary} />
                <Text style={styles.reasonText}>{strings.delivery.reasons[r]}</Text>
              </View>
              <View style={[styles.radio, selected && styles.radioOn]}>
                {selected ? <View style={styles.radioDot} /> : null}
              </View>
            </Pressable>
          );
        })}

        <TextInput
          style={styles.note}
          value={note}
          onChangeText={setNote}
          placeholder={strings.delivery.notePlaceholder}
          placeholderTextColor={colors.placeholder}
          multiline
          textAlignVertical="top"
        />
      </ScrollView>

      <View style={[styles.bottom, {paddingBottom: 20 + insets.bottom}]}>
        <Pressable
          disabled={!reason}
          style={({pressed}) => [styles.cta, !reason && styles.disabled, pressed && styles.pressed]}
          onPress={onConfirm}>
          <CheckIcon size={20} color="#FFFFFF" />
          <Text style={styles.ctaText}>{strings.delivery.confirmRemoval}</Text>
        </Pressable>
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
    flex: 1,
  },
  content: {
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 16,
  },
  context: {
    padding: 20,
    gap: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 1,
    backgroundColor: colors.background,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  contextHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  pinCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceAlt,
  },
  contextTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 18,
    color: colors.textDark,
  },
  contextSub: {
    marginTop: 4,
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.textSecondary,
  },
  warning: {
    padding: 12,
    flexDirection: 'row',
    gap: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.roseBorder,
  },
  warningText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
  },
  kicker: {
    marginTop: 8,
    fontFamily: fonts.semiBold,
    fontSize: 12,
    letterSpacing: 0.6,
    color: colors.textSecondary,
  },
  reason: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reasonOn: {
    borderColor: colors.primary,
    backgroundColor: colors.roseBg,
  },
  reasonLeft: {
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  reasonText: {
    flexShrink: 1,
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.textDark,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.gray300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: {
    borderWidth: 0,
    backgroundColor: colors.primary,
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  note: {
    minHeight: 96,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.textDark,
  },
  bottom: {
    paddingTop: 20,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  cta: {
    height: 54,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
  },
  disabled: {
    opacity: 0.4,
  },
  pressed: {
    opacity: 0.85,
  },
  ctaText: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: '#FFFFFF',
  },
});

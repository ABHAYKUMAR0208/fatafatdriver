import React, {useState} from 'react';
import {Alert, Pressable, ScrollView, StatusBar, StyleSheet, Switch, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {MapPinIcon, PackageIcon, WalletIcon} from '@/components/common/Icons';
import DetailHeader from '@/components/delivery/DetailHeader';
import PhotoCapture from '@/components/delivery/PhotoCapture';
import PinInput from '@/components/delivery/PinInput';
import {colors} from '@/constants/colors';
import {fonts} from '@/constants/typography';
import {useStrings} from '@/localization';
import type {RootStackParamList} from '@/navigation/types';
import {completeStop, currentStop, useDelivery} from '@/state/deliveryStore';
import {capturePhoto} from '@/utils/capturePhoto';
import {formatRupees} from '@/utils/formatCurrency';
import {finishTrip} from '@/utils/tripActions';

const OTP_LENGTH = 4;

// "+919876501234" -> "+91 98765 01234"
function formatPhone(phone: string) {
  const m = phone.match(/^\+91(\d{5})(\d{5})$/);
  return m ? `+91 ${m[1]} ${m[2]}` : phone;
}

// At the recipient: OTP, cash on delivery and a photo before handing over.
export default function DropVerificationScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const strings = useStrings();
  const delivery = useDelivery();
  // stay on the stop this screen was opened for, even after it is marked delivered
  const [stopId] = useState(() => (currentStop(delivery) ?? delivery.stops[0]).id);
  const stop = delivery.stops.find(s => s.id === stopId) ?? delivery.stops[0];
  const [otp, setOtp] = useState('');
  const [cashCollected, setCashCollected] = useState(false);
  const [photo, setPhoto] = useState<string | undefined>();

  const needsCash = !!stop.cod;
  const ready = otp.length === OTP_LENGTH && (!needsCash || cashCollected) && !!photo;

  const onPhoto = async () => {
    const uri = await capturePhoto();
    if (uri) {
      setPhoto(uri);
    }
  };

  const onComplete = () => {
    // TODO: verify the OTP and upload the proof with your API
    const allDone = completeStop(stop.id);
    if (allDone) {
      Alert.alert(
        strings.delivery.deliveredTitle,
        strings.formatString(strings.delivery.deliveredBody, stop.id) as string,
        [{text: strings.delivery.ok, onPress: () => finishTrip(navigation, true)}],
        {cancelable: false},
      );
    } else {
      Alert.alert(
        strings.delivery.deliveredTitle,
        strings.formatString(strings.delivery.nextStopBody, stop.id) as string,
        [{text: strings.delivery.ok, onPress: () => navigation.navigate('SequentialDropoffs')}],
        {cancelable: false},
      );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <DetailHeader title={strings.delivery.dropVerification} onBack={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={[styles.content, {paddingBottom: 20 + insets.bottom}]}
        keyboardShouldPersistTaps="handled">
        <View style={[styles.card, styles.details]}>
          <View style={styles.row}>
            <View style={[styles.iconCircle, styles.peach]}>
              <PackageIcon size={18} color={colors.primary} />
            </View>
            <View style={styles.flex}>
              <Text style={styles.code}>{stop.id}</Text>
              <Text style={styles.name}>{stop.recipient}</Text>
              <Text style={styles.sub}>{formatPhone(stop.phone)}</Text>
            </View>
          </View>
          <View style={styles.addressRow}>
            <MapPinIcon size={14} color={colors.textSecondary} />
            <Text style={styles.sub}>{stop.address}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{strings.delivery.deliveryOtp}</Text>
          <PinInput value={otp} onChange={setOtp} length={OTP_LENGTH} />
          <Text style={styles.hint}>{strings.delivery.deliveryOtpHint}</Text>
        </View>

        {needsCash ? (
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={[styles.iconCircle, styles.amber]}>
                <WalletIcon size={18} color={colors.star} />
              </View>
              <View style={styles.flex}>
                <Text style={styles.cardTitle}>{strings.delivery.cod}</Text>
                <Text style={styles.sub}>
                  {strings.formatString(strings.delivery.codText, formatRupees(stop.cod ?? 0))}
                </Text>
              </View>
              <Text style={styles.amount}>{formatRupees(stop.cod ?? 0)}</Text>
            </View>
            <Pressable style={styles.toggleRow} onPress={() => setCashCollected(v => !v)}>
              <View style={styles.flex}>
                <Text style={styles.toggleTitle}>{strings.delivery.collected}</Text>
                <Text style={styles.toggleSub}>{strings.delivery.confirmCash}</Text>
              </View>
              <Switch
                value={cashCollected}
                onValueChange={setCashCollected}
                trackColor={{false: colors.gray300, true: colors.primary}}
                thumbColor="#FFFFFF"
              />
            </Pressable>
          </View>
        ) : null}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{strings.delivery.photoProof}</Text>
          <PhotoCapture label={strings.delivery.captureDelivery} uri={photo} onPress={onPhoto} />
        </View>

        <Pressable
          disabled={!ready}
          style={({pressed}) => [styles.cta, !ready && styles.disabled, pressed && styles.pressed]}
          onPress={onComplete}>
          <Text style={styles.ctaText}>{strings.delivery.completeDelivery}</Text>
        </Pressable>
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
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 16,
  },
  card: {
    padding: 16,
    gap: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  details: {
    backgroundColor: colors.surface,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  peach: {
    backgroundColor: colors.peach,
  },
  amber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.amberSoft,
  },
  code: {
    fontFamily: fonts.bold,
    fontSize: 12,
    letterSpacing: 0.6,
    color: colors.primary,
  },
  name: {
    marginTop: 2,
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.textDark,
  },
  sub: {
    flexShrink: 1,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textSecondary,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.textDark,
  },
  hint: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textSecondary,
  },
  amount: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.textDark,
  },
  toggleRow: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  toggleTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.textDark,
  },
  toggleSub: {
    marginTop: 2,
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textSecondary,
  },
  cta: {
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: 16,
    color: '#FFFFFF',
  },
});

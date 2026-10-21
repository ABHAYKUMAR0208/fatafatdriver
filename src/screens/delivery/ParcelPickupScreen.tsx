import React, {useState} from 'react';
import {Pressable, ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  AlertTriangleIcon,
  ArrowLeftIcon,
  CameraIcon,
  CheckIcon,
  LockIcon,
  PackageIcon,
} from '@/components/common/Icons';
import PinInput from '@/components/delivery/PinInput';
import PhotoCapture from '@/components/delivery/PhotoCapture';
import MapPlaceholder from '@/components/home/MapPlaceholder';
import {colors} from '@/constants/colors';
import {fonts} from '@/constants/typography';
import {useStrings} from '@/localization';
import type {RootStackParamList} from '@/navigation/types';
import {useDelivery} from '@/state/deliveryStore';
import {capturePhoto} from '@/utils/capturePhoto';

const PIN_LENGTH = 4;

// At the sender: enter their PIN and photograph the parcel before leaving.
export default function ParcelPickupScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const strings = useStrings();
  const delivery = useDelivery();
  const [pin, setPin] = useState('');
  const [photo, setPhoto] = useState<string | undefined>();

  const ready = pin.length === PIN_LENGTH && !!photo;

  const onPhoto = async () => {
    const uri = await capturePhoto();
    if (uri) {
      setPhoto(uri);
    }
  };

  const onStart = () => {
    // TODO: check the PIN and upload the photo with your API
    navigation.replace(delivery.stops.length > 1 ? 'SequentialDropoffs' : 'ParcelInTransit');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={[styles.header, {paddingTop: insets.top}]}>
        <Pressable style={styles.back} onPress={() => navigation.goBack()} hitSlop={8}>
          <ArrowLeftIcon size={18} color={colors.textDark} />
        </Pressable>
        <Text style={styles.headerTitle}>{strings.delivery.pickupVerification}</Text>
        <View style={styles.back} />
      </View>

      <View style={styles.mapArea}>
        <MapPlaceholder />
      </View>

      <View style={[styles.sheet, {paddingBottom: insets.bottom}]}>
        <View style={styles.handle} />
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.order}>
            <View style={styles.orderIcon}>
              <PackageIcon size={22} color={colors.star} />
            </View>
            <View style={styles.orderText}>
              <Text style={styles.kicker}>{strings.delivery.custody}</Text>
              <Text style={styles.orderNo}>
                {strings.formatString(strings.delivery.orderNo, delivery.orderNo)}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.label}>
              <LockIcon size={13} color={colors.textSecondary} />
              <Text style={styles.labelText}>{strings.delivery.senderPin}</Text>
            </View>
            <PinInput value={pin} onChange={setPin} length={PIN_LENGTH} variant="spread" />
            <Text style={styles.hint}>{strings.delivery.senderPinHint}</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.label}>
              <CameraIcon size={13} color={colors.textSecondary} />
              <Text style={styles.labelText}>{strings.delivery.conditionProof}</Text>
            </View>
            <PhotoCapture
              label={strings.delivery.captureParcel}
              uri={photo}
              onPress={onPhoto}
              height={128}
            />
          </View>

          <View style={styles.terms}>
            <AlertTriangleIcon size={20} color={colors.red} />
            <View style={styles.termsText}>
              <Text style={styles.termsTitle}>{strings.delivery.noProhibited}</Text>
              <Text style={styles.termsBody}>{strings.delivery.prohibitedText}</Text>
            </View>
          </View>

          <Pressable
            disabled={!ready}
            style={({pressed}) => [styles.cta, !ready && styles.disabled, pressed && styles.pressed]}
            onPress={onStart}>
            <CheckIcon size={20} color="#FFFFFF" />
            <Text style={styles.ctaText}>{strings.delivery.verifyStart}</Text>
          </Pressable>
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
  header: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  back: {
    width: 44,
    height: 44,
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.textDark,
  },
  mapArea: {
    height: 130,
    opacity: 0.6,
  },
  sheet: {
    flex: 1,
    marginTop: -24,
    paddingTop: 8,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: colors.background,
    elevation: 12,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: -4},
    shadowOpacity: 0.08,
    shadowRadius: 20,
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
    paddingBottom: 24,
    gap: 24,
  },
  order: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  orderIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceAlt,
  },
  orderText: {
    flex: 1,
    gap: 4,
  },
  kicker: {
    fontFamily: fonts.regular,
    fontSize: 12,
    letterSpacing: 0.6,
    color: colors.tripMuted,
  },
  orderNo: {
    fontFamily: fonts.medium,
    fontSize: 18,
    color: colors.textDark,
  },
  section: {
    gap: 8,
  },
  label: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  labelText: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: colors.textSecondary,
  },
  hint: {
    marginTop: 4,
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.tripMuted,
  },
  terms: {
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  termsText: {
    flex: 1,
    gap: 4,
  },
  termsTitle: {
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.textDark,
  },
  termsBody: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: colors.tripMuted,
  },
  cta: {
    height: 54,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    elevation: 6,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 14,
  },
  disabled: {
    opacity: 0.5,
    elevation: 0,
    shadowOpacity: 0,
  },
  pressed: {
    opacity: 0.85,
  },
  ctaText: {
    fontFamily: fonts.medium,
    fontSize: 17,
    color: '#FFFFFF',
  },
});

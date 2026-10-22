import React, {useState} from 'react';
import {Image, Pressable, ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import type {RouteProp} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {CheckIcon, UploadIcon} from '@/components/common/Icons';
import ChoiceButtons from '@/components/delivery/ChoiceButtons';
import SheetTitleBar from '@/components/delivery/SheetTitleBar';
import {colors} from '@/constants/colors';
import {fonts} from '@/constants/typography';
import {useStrings} from '@/localization';
import type {RootStackParamList} from '@/navigation/types';
import {useFareMatch} from '@/state/deliveryStore';
import {pickImage} from '@/utils/capturePhoto';
import {formatRupees} from '@/utils/formatCurrency';

// Rider asks to match a competitor's lower price; the platform pays the difference.
export default function FareMatchScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const route = useRoute<RouteProp<RootStackParamList, 'FareMatch'>>();
  const next = route.params?.next;
  const strings = useStrings();
  const match = useFareMatch();
  const [evidence, setEvidence] = useState<string | undefined>();
  const discount = match.originalFare - match.offer;

  // Inside a flow, continue to its OTP / start step; opened on its own, just close.
  const onContinue = () => {
    if (next) {
      navigation.replace(next);
    } else {
      navigation.goBack();
    }
  };

  const onUpload = async () => {
    const uri = await pickImage();
    if (uri) {
      setEvidence(uri);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SheetTitleBar title={strings.delivery.fareMatch} onClose={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.intro}>
          <Text style={styles.title}>{strings.delivery.matchTitle}</Text>
          <Text style={styles.subtitle}>{strings.delivery.matchSubtitle}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.fareBox}>
            <Text style={styles.kicker}>{strings.delivery.originalFare}</Text>
            <Text style={styles.fare}>{formatRupees(match.originalFare)}</Text>
          </View>
          <View style={[styles.fareBox, styles.offerBox]}>
            <Text style={[styles.kicker, styles.kickerPink]}>{strings.delivery.ridersOffer}</Text>
            <Text style={styles.fare}>{formatRupees(match.offer)}</Text>
          </View>
          <View style={styles.coverage}>
            <View style={styles.checkCircle}>
              <CheckIcon size={16} color={colors.green} />
            </View>
            <View style={styles.flex}>
              <Text style={styles.coverageTitle}>{strings.delivery.platformCoverage}</Text>
              <Text style={styles.coverageText}>
                {strings.formatString(
                  strings.delivery.coverageText,
                  formatRupees(match.originalFare),
                  formatRupees(discount),
                )}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.evidence}>
          <Text style={styles.kicker}>{strings.delivery.evidence}</Text>
          <Pressable
            style={({pressed}) => [styles.upload, pressed && styles.pressed]}
            onPress={onUpload}>
            {evidence ? (
              <Image source={{uri: evidence}} style={styles.preview} resizeMode="cover" />
            ) : (
              <UploadIcon size={26} color={colors.placeholder} />
            )}
            <Text style={styles.uploadTitle}>{strings.delivery.uploadScreenshot}</Text>
            <Text style={styles.uploadSub}>
              {evidence ? strings.delivery.evidenceAdded : strings.delivery.evidenceRequired}
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      <View style={[styles.bottom, {paddingBottom: 16 + insets.bottom}]}>
        <ChoiceButtons
          secondary={strings.delivery.decline}
          primary={strings.delivery.acceptFare}
          primaryDisabled={!evidence}
          // TODO: send the decision (and the screenshot) to your API
          onSecondary={onContinue}
          onPrimary={onContinue}
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
  flex: {
    flex: 1,
  },
  content: {
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 20,
  },
  intro: {
    gap: 8,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 24,
    lineHeight: 32,
    color: colors.textDark,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  card: {
    padding: 20,
    gap: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  fareBox: {
    padding: 16,
    gap: 6,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  offerBox: {
    borderWidth: 1,
    borderColor: colors.roseBorder,
    backgroundColor: colors.roseBg,
  },
  kicker: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    letterSpacing: 0.6,
    color: colors.textSecondary,
  },
  kickerPink: {
    color: colors.primary,
  },
  fare: {
    fontFamily: fonts.bold,
    fontSize: 28,
    lineHeight: 34,
    color: colors.textDark,
  },
  coverage: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 12,
    backgroundColor: colors.greenBg,
  },
  checkCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.greenPill,
  },
  coverageTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    lineHeight: 18,
    color: colors.green,
  },
  coverageText: {
    marginTop: 2,
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  evidence: {
    gap: 12,
  },
  upload: {
    paddingVertical: 34,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.gray300,
  },
  pressed: {
    opacity: 0.85,
  },
  preview: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },
  uploadTitle: {
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.textDark,
  },
  uploadSub: {
    marginTop: -4,
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textSecondary,
  },
  bottom: {
    paddingTop: 16,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
});

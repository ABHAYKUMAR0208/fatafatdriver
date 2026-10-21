import React, {useEffect, useState} from 'react';
import {Alert, Image, Pressable, ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MdiIcon from '@/components/common/MdiIcon';
import FadeGradient from '@/components/trip/FadeGradient';
import RoundButton from '@/components/trip/RoundButton';
import TripButton from '@/components/trip/TripButton';
import TripHeader from '@/components/trip/TripHeader';
import TripIcon from '@/components/trip/TripIcon';
import TripSheet from '@/components/trip/TripSheet';
import {colors} from '@/constants/colors';
import {MDI_HOME} from '@/constants/iconPathsHome';
import {TRIP_ICONS} from '@/constants/iconPathsTrip';
import {fonts} from '@/constants/typography';
import {useStrings} from '@/localization';
import type {RootStackParamList} from '@/navigation/types';
import {useTrip} from '@/state/tripStore';
import {finishTrip} from '@/utils/tripActions';

// Pink Scooty: the driver confirms the rider matches her profile photo.
export default function RiderIdentityCheckScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const strings = useStrings();
  const trip = useTrip();
  const photoUri = trip.rider.photoUri;
  const [photoFailed, setPhotoFailed] = useState(false);

  useEffect(() => setPhotoFailed(false), [photoUri]);

  const onMatch = () => {
    // TODO: tell your API the identity was confirmed and the trip started
    navigation.navigate('ActiveTrip');
  };

  const onMismatch = () => {
    Alert.alert(strings.trip.mismatchTitle, strings.trip.mismatchBody, [
      {text: strings.trip.back, style: 'cancel'},
      {
        text: strings.trip.refuseRide,
        style: 'destructive',
        // TODO: report the mismatch to your API (it does not count as a cancellation)
        onPress: () => finishTrip(navigation, true),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <TripHeader
        title={strings.trip.identityCheck}
        height={72}
        titleStyle={styles.headerTitle}
        left={
          <RoundButton size={44} onPress={() => navigation.goBack()}>
            <TripIcon icon={TRIP_ICONS.arrowBack} size={16} color={colors.textDark} />
          </RoundButton>
        }
        right={
          // TODO: open the Pink Scooty safety info once Module 12 is built
          <RoundButton size={44} backgroundColor={colors.warnBg}>
            <TripIcon icon={TRIP_ICONS.shield} size={20} color={colors.star} />
          </RoundButton>
        }
      />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.intro}>
          <Text style={styles.title}>{strings.trip.pinkVerification}</Text>
          <Text style={styles.subtitle}>{strings.trip.identitySub}</Text>
        </View>

        <View style={styles.photoWrap}>
          <View style={styles.photo}>
            {photoUri && !photoFailed ? (
              <Image
                source={{uri: photoUri}}
                style={StyleSheet.absoluteFill}
                resizeMode="cover"
                onError={() => setPhotoFailed(true)}
              />
            ) : (
              <View style={styles.noPhoto}>
                <MdiIcon path={MDI_HOME.accountOutline} size={120} color={colors.tripMuted} />
              </View>
            )}
            <FadeGradient id="identityShade" color="#000000" opacity={0.8} />
            <View style={styles.nameOverlay}>
              <Text style={styles.name}>{trip.rider.name}</Text>
              <View style={styles.verified}>
                <TripIcon icon={TRIP_ICONS.verified} size={12} color={colors.green} />
                <Text style={styles.verifiedText}>{strings.trip.verifiedProfile}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.warning}>
          <View style={styles.warningIcon}>
            <TripIcon icon={TRIP_ICONS.infoOutline} size={18} color={colors.star} />
          </View>
          <Text style={styles.warningText}>{strings.trip.mismatchNote}</Text>
        </View>
      </ScrollView>

      <TripSheet handleGap={4} bordered style={styles.sheet}>
        <View style={[styles.buttons, {paddingBottom: 32 + insets.bottom}]}>
          <TripButton
            title={strings.trip.identityMatches}
            icon={<TripIcon icon={TRIP_ICONS.checkCircleOutline} size={20} color="#FFFFFF" />}
            textStyle={styles.matchText}
            style={styles.matchBtn}
            onPress={onMatch}
          />
          <Pressable
            style={({pressed}) => [styles.mismatch, pressed && styles.pressed]}
            onPress={onMismatch}>
            <TripIcon icon={TRIP_ICONS.personOff} size={18} color={colors.primary} />
            <Text style={styles.mismatchText}>{strings.trip.identityMismatch}</Text>
          </Pressable>
        </View>
      </TripSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerTitle: {
    fontSize: 20,
  },
  scroll: {
    flex: 1,
  },
  intro: {
    paddingTop: 8,
    paddingHorizontal: 24,
    paddingBottom: 16,
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontFamily: fonts.semiBold,
    fontSize: 17,
    color: colors.textDark,
  },
  subtitle: {
    textAlign: 'center',
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.tripMuted,
  },
  photoWrap: {
    paddingHorizontal: 56,
  },
  photo: {
    width: '100%',
    aspectRatio: 278 / 371,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.optionBorder,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    backgroundColor: colors.ratingCard,
  },
  noPhoto: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameOverlay: {
    padding: 16,
    alignItems: 'center',
    gap: 6,
  },
  name: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: '#FFFFFF',
  },
  verified: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  verifiedText: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.green,
  },
  warning: {
    marginTop: 24,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.starTint19,
    backgroundColor: colors.warnBg,
  },
  warningIcon: {
    paddingTop: 2,
  },
  warningText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 18,
    color: colors.warnText,
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  buttons: {
    paddingTop: 12,
    paddingHorizontal: 20,
    gap: 12,
  },
  matchBtn: {
    shadowColor: colors.green,
  },
  matchText: {
    fontSize: 16,
  },
  mismatch: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.primaryTint19,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.dangerBg,
  },
  mismatchText: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.primary,
  },
  pressed: {
    opacity: 0.85,
  },
});

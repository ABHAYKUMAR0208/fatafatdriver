import React from 'react';
import {Image, StatusBar, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import SheetTitleBar from '@/components/delivery/SheetTitleBar';
import TripButton from '@/components/trip/TripButton';
import {colors} from '@/constants/colors';
import {fonts} from '@/constants/typography';
import {useStrings} from '@/localization';
import type {RootStackParamList} from '@/navigation/types';

// Shown when a ride / carpool request timed out. The driver stays online.
export default function RequestExpiredScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const strings = useStrings();
  const onHome = () => navigation.goBack();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SheetTitleBar title={strings.delivery.expiredTitle} onClose={onHome} />

      <View style={styles.content}>
        <View style={styles.illustration}>
          <Image
            source={require('../../assets/images/expired_card.png')}
            style={styles.card}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>{strings.delivery.expiredTitle}</Text>
        <Text style={styles.text}>{strings.delivery.expiredText}</Text>
      </View>

      <View style={[styles.bottom, {paddingBottom: 16 + insets.bottom}]}>
        <TripButton
          title={strings.delivery.backHome}
          style={styles.cta}
          textStyle={styles.ctaText}
          onPress={onHome}
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
  content: {
    flex: 1,
    paddingTop: 24,
    paddingHorizontal: 20,
  },
  illustration: {
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: 260,
    height: 220,
  },
  title: {
    marginTop: 24,
    fontFamily: fonts.bold,
    fontSize: 28,
    lineHeight: 34,
    color: colors.textDark,
  },
  text: {
    marginTop: 12,
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    paddingHorizontal: 10,
    color: colors.textSecondary,
  },
  bottom: {
    paddingTop: 16,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cta: {
    height: 54,
    borderRadius: 12,
  },
  ctaText: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
  },
});
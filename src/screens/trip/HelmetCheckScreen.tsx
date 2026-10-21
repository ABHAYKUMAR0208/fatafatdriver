import React, {useState} from 'react';
import {Pressable, ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CheckBox from '@/components/trip/CheckBox';
import RoundButton from '@/components/trip/RoundButton';
import TripButton from '@/components/trip/TripButton';
import TripHeader from '@/components/trip/TripHeader';
import TripIcon from '@/components/trip/TripIcon';
import {colors} from '@/constants/colors';
import {TRIP_ICONS} from '@/constants/iconPathsTrip';
import {fonts} from '@/constants/typography';
import {useStrings} from '@/localization';
import type {RootStackParamList} from '@/navigation/types';
import {useTrip} from '@/state/tripStore';
import {nextStartStep} from '@/utils/tripActions';

const ITEMS = ['handed', 'secured'] as const;
type Item = (typeof ITEMS)[number];

// Two-wheeler safety check: both items must be ticked before the trip starts.
export default function HelmetCheckScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const strings = useStrings();
  const trip = useTrip();
  const [done, setDone] = useState<Record<Item, boolean>>({handed: false, secured: false});

  const text: Record<Item, {title: string; sub: string}> = {
    handed: {title: strings.trip.helmetHanded, sub: strings.trip.helmetHandedSub},
    secured: {title: strings.trip.helmetSecured, sub: strings.trip.helmetSecuredSub},
  };
  const allDone = ITEMS.every(i => done[i]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <TripHeader
        title={strings.trip.safetyCheck}
        left={
          <RoundButton onPress={() => navigation.goBack()}>
            <TripIcon icon={TRIP_ICONS.close} size={14} color={colors.textDark} />
          </RoundButton>
        }
        right={
          // TODO: open Help & Support once Module 10 is built
          <RoundButton>
            <TripIcon icon={TRIP_ICONS.helpOutline} size={18} color={colors.textDark} />
          </RoundButton>
        }
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.circle}>
            <TripIcon icon={TRIP_ICONS.twoWheeler} size={80} color={colors.star} />
            <View style={styles.badge}>
              <TripIcon icon={TRIP_ICONS.helmet} size={26} color="#FFFFFF" />
            </View>
          </View>
        </View>

        <View style={styles.intro}>
          <Text style={styles.title}>{strings.trip.preRide}</Text>
          <Text style={styles.subtitle}>{strings.trip.preRideSub}</Text>
        </View>

        <View style={styles.checklist}>
          {ITEMS.map(item => (
            <Pressable
              key={item}
              style={styles.item}
              onPress={() => setDone(d => ({...d, [item]: !d[item]}))}>
              <View style={styles.itemText}>
                <Text style={styles.itemTitle}>{text[item].title}</Text>
                <Text style={styles.itemSub}>{text[item].sub}</Text>
              </View>
              <CheckBox checked={done[item]} size={28} fill={colors.cardBorder} />
            </Pressable>
          ))}
        </View>

        <View style={styles.tips}>
          <View style={styles.tipsIcon}>
            <TripIcon icon={TRIP_ICONS.infoOutline} size={18} color={colors.star} />
          </View>
          <View style={styles.tipsText}>
            <Text style={styles.tipsTitle}>{strings.trip.tipsTitle}</Text>
            {strings.trip.tips.map(tip => (
              <Text key={tip} style={styles.tip}>
                {tip}
              </Text>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.bottom, {paddingBottom: 20 + insets.bottom}]}>
        <TripButton
          title={strings.trip.confirmStart}
          disabled={!allDone}
          onPress={() => navigation.navigate(nextStartStep(trip, 'helmet'))}
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
    padding: 20,
    gap: 24,
  },
  hero: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  circle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.warnBg,
    elevation: 6,
    shadowColor: colors.star,
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.13,
    shadowRadius: 32,
  },
  badge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 4,
    borderColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.green,
  },
  intro: {
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 22,
    color: colors.textDark,
  },
  subtitle: {
    textAlign: 'center',
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.tripMuted,
  },
  checklist: {
    gap: 12,
  },
  item: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.optionBorder,
    backgroundColor: colors.cardBg,
  },
  itemText: {
    flex: 1,
    gap: 4,
  },
  itemTitle: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.textDark,
  },
  itemSub: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.tripMuted,
  },
  tips: {
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    borderRadius: 14,
    backgroundColor: colors.warnBg,
  },
  tipsIcon: {
    paddingTop: 2,
  },
  tipsText: {
    flex: 1,
    gap: 6,
  },
  tipsTitle: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.textDark,
  },
  tip: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 18,
    color: colors.warnText,
  },
  bottom: {
    paddingTop: 20,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    backgroundColor: colors.scrim,
  },
});

import React, {useEffect, useState} from 'react';
import {BackHandler, Pressable, ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import TripButton from '@/components/trip/TripButton';
import TripIcon from '@/components/trip/TripIcon';
import {colors} from '@/constants/colors';
import {TRIP_ICONS} from '@/constants/iconPathsTrip';
import {fonts} from '@/constants/typography';
import {useStrings} from '@/localization';
import type {RootStackParamList} from '@/navigation/types';
import {tripEarnings, useTrip} from '@/state/tripStore';
import {formatRupees} from '@/utils/formatCurrency';
import {finishTrip} from '@/utils/tripActions';

const TAGS = ['polite', 'onTime', 'clean'] as const;
type Tag = (typeof TAGS)[number];

// Earnings for the finished trip and the rider rating.
export default function TripCompleteScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const strings = useStrings();
  const trip = useTrip();
  const earnings = tripEarnings(trip);
  const [stars, setStars] = useState(5);
  const [tags, setTags] = useState<Tag[]>(['polite', 'onTime']);

  // ignore Android back so the rating is not skipped by accident
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => sub.remove();
  }, []);

  const toggleTag = (tag: Tag) =>
    setTags(list => (list.includes(tag) ? list.filter(t => t !== tag) : [...list, tag]));

  const onDone = (online: boolean) => {
    // TODO: send `stars` and `tags` for this trip to your API
    finishTrip(navigation, online);
  };

  const stats = [
    {label: strings.trip.distance, value: strings.formatString(strings.trip.km, String(trip.distanceKm))},
    {label: strings.trip.duration, value: strings.formatString(strings.trip.minutes, String(earnings.minutes))},
    {label: strings.trip.base, value: formatRupees(earnings.base)},
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, {paddingTop: insets.top + 36}]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.success}>
          <View style={styles.successRing}>
            <View style={styles.successCircle}>
              <TripIcon icon={TRIP_ICONS.checkCircle} size={28} color="#FFFFFF" />
            </View>
          </View>
          <Text style={styles.title}>{strings.trip.complete}</Text>
        </View>

        <View style={styles.earnings}>
          <Text style={styles.earnedLabel}>{strings.trip.youEarned}</Text>
          <Text style={styles.earned}>{formatRupees(earnings.earned)}</Text>
          <View style={styles.stats}>
            {stats.map((s, i) => (
              <React.Fragment key={s.label}>
                {i > 0 ? <View style={styles.statDivider} /> : null}
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>{s.label}</Text>
                  <Text style={styles.statValue}>{s.value}</Text>
                </View>
              </React.Fragment>
            ))}
          </View>
        </View>

        <View style={styles.rating}>
          <View style={styles.ratingHead}>
            <Text style={styles.ratingTitle}>{strings.trip.rateRider}</Text>
            <Text style={styles.ratingName}>{trip.rider.name}</Text>
          </View>

          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map(n => (
              <Pressable key={n} hitSlop={4} onPress={() => setStars(n)}>
                <TripIcon
                  icon={TRIP_ICONS.star}
                  size={32}
                  color={n <= stars ? colors.star : colors.ratingTag}
                />
              </Pressable>
            ))}
          </View>

          <View style={styles.tags}>
            {TAGS.map(tag => {
              const on = tags.includes(tag);
              return (
                <Pressable
                  key={tag}
                  style={[styles.tag, on ? styles.tagOn : styles.tagOff]}
                  onPress={() => toggleTag(tag)}>
                  <Text style={on ? styles.tagTextOn : styles.tagTextOff}>
                    {strings.trip.tags[tag]}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.bottom, {paddingBottom: 36 + insets.bottom}]}>
        <TripButton title={strings.trip.submitOnline} onPress={() => onDone(true)} />
        <TripButton
          title={strings.trip.stayOffline}
          variant="grey"
          onPress={() => onDone(false)}
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
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 20,
  },
  success: {
    alignItems: 'center',
    gap: 16,
  },
  successRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.greenTint8,
  },
  successCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.green,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 26,
    color: colors.textDark,
  },
  earnings: {
    padding: 24,
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.greenTint13,
    backgroundColor: colors.earnedBg,
    elevation: 3,
    shadowColor: colors.green,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 20,
  },
  earnedLabel: {
    fontFamily: fonts.bold,
    fontSize: 12,
    letterSpacing: 1,
    color: colors.green,
  },
  earned: {
    marginTop: 6,
    fontFamily: fonts.bold,
    fontSize: 48,
    color: colors.green,
  },
  stats: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  stat: {
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.chipBorder,
  },
  statLabel: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.tripMuted,
  },
  statValue: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.textDark,
  },
  rating: {
    padding: 24,
    alignItems: 'center',
    gap: 16,
    borderRadius: 20,
    backgroundColor: colors.ratingCard,
    elevation: 6,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.13,
    shadowRadius: 24,
  },
  ratingHead: {
    alignItems: 'center',
    gap: 4,
  },
  ratingTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: '#FFFFFF',
  },
  ratingName: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.tripMuted,
  },
  stars: {
    flexDirection: 'row',
    gap: 8,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  tag: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  tagOn: {
    borderColor: colors.green,
    backgroundColor: colors.primaryTint13,
  },
  tagOff: {
    borderColor: colors.ratingTagBorder,
    backgroundColor: colors.ratingTag,
  },
  tagTextOn: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.green,
  },
  tagTextOff: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.tripMuted,
  },
  bottom: {
    paddingTop: 16,
    paddingHorizontal: 24,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    backgroundColor: colors.background,
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: -4},
    shadowOpacity: 0.06,
    shadowRadius: 16,
  },
});

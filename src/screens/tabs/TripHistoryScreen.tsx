import React, {useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import type {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import MdiIcon from '@/components/common/MdiIcon';
import HistoryHeader from '@/components/tripHistory/HistoryHeader';
import TripCard from '@/components/tripHistory/TripCard';
import {colors} from '@/constants/colors';
import {MDI_TRIP_HISTORY} from '@/constants/iconPathsTripHistory';
import {fonts} from '@/constants/typography';
import {useStrings} from '@/localization';
import {useProfileSummary} from '@/state/profileSummaryStore';
import {useTripHistory} from '@/state/tripHistoryStore';
import {groupByDay, matchesSearch, sectionTitle} from '@/utils/tripHistory';
import type {MainTabParamList} from '@/navigation/types';

const C = {
  page: colors.grayBg,
  ink: '#0F1224',
  grey: '#9CA3AF',
  border: '#E5E7EB',
  button: '#0F1224',
};

// Trips tab: the driver's past trips, newest day first.
export default function TripHistoryScreen() {
  const strings = useStrings();
  const t = strings.tripHistory;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();
  // the photo the driver / rider uploaded (same one the Profile tab shows)
  const {photoUri} = useProfileSummary();
  const {trips, loading, failed, reload} = useTripHistory();
  const [query, setQuery] = useState('');

  const sections = useMemo(
    () => groupByDay(trips.filter(trip => matchesSearch(trip, query))),
    [trips, query],
  );
  const now = new Date();
  const titleText = {
    today: t.today,
    yesterday: t.yesterday,
    weekdays: t.weekdays,
    months: strings.personalDetails.months,
  };

  const onFilterByDate = () => {
    // TODO: open the date filter (the design only shows the button)
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <HistoryHeader
        title={t.title}
        photoUri={photoUri}
        onBell={() => (navigation as any).navigate('Alerts')}
      />

      <ScrollView
        style={styles.flex}
        contentContainerStyle={[styles.content, {paddingBottom: insets.bottom + 24}]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>{t.title}</Text>

        <View style={styles.searchRow}>
          <View style={styles.search}>
            <MdiIcon path={MDI_TRIP_HISTORY.magnify} size={22} color={C.grey} />
            <TextInput
              style={styles.input}
              value={query}
              onChangeText={setQuery}
              placeholder={t.searchPlaceholder}
              placeholderTextColor={C.grey}
              returnKeyType="search"
              autoCorrect={false}
            />
          </View>
          <Pressable
            style={styles.calendar}
            onPress={onFilterByDate}
            accessibilityRole="button"
            accessibilityLabel={t.filterByDate}>
            <MdiIcon path={MDI_TRIP_HISTORY.calendar} size={24} color="#FFFFFF" />
          </Pressable>
        </View>

        {loading ? (
          <ActivityIndicator style={styles.state} color={colors.primary} />
        ) : failed ? (
          <View style={styles.state}>
            <Text style={styles.stateText}>{t.failed}</Text>
            <Pressable onPress={reload} hitSlop={8}>
              <Text style={styles.retry}>{t.retry}</Text>
            </Pressable>
          </View>
        ) : sections.length === 0 ? (
          <View style={styles.state}>
            <Text style={styles.stateText}>{query.trim() ? t.noMatch : t.empty}</Text>
          </View>
        ) : (
          sections.map(section => (
            <View key={section.key}>
              <Text style={styles.sectionLabel}>
                {sectionTitle(section.date, now, titleText)}
              </Text>
              <View style={styles.cards}>
                {section.trips.map(trip => (
                  <TripCard
                    key={trip.id}
                    trip={trip}
                    completedLabel={t.completed}
                    cancelledLabel={t.cancelled}
                  />
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {flex: 1},
  container: {flex: 1, backgroundColor: C.page},
  content: {paddingTop: 14, paddingHorizontal: 20},

  heading: {
    fontFamily: fonts.extraBold,
    fontSize: 32,
    lineHeight: 38,
    color: C.ink,
  },

  searchRow: {marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 12},
  search: {
    flex: 1,
    height: 48,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    paddingVertical: 0,
    fontFamily: fonts.regular,
    fontSize: 15,
    color: C.ink,
  },
  calendar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: C.button,
    alignItems: 'center',
    justifyContent: 'center',
  },

  sectionLabel: {
    marginTop: 22,
    marginBottom: 12,
    fontFamily: fonts.bold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1,
    color: C.grey,
  },
  cards: {gap: 14},

  state: {marginTop: 48, alignItems: 'center', gap: 10},
  stateText: {fontFamily: fonts.medium, fontSize: 15, color: colors.textSecondary},
  retry: {fontFamily: fonts.semiBold, fontSize: 15, color: colors.primary},
});

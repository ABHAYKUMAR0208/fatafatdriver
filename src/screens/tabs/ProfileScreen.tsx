import React from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import type {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import Svg, {Path} from 'react-native-svg';
import Avatar from '@/components/home/Avatar';
import {fonts} from '@/constants/typography';
import {
  BellIcon,
  CarIcon,
  CashIcon,
  DocIcon,
  HelpIcon,
  IdCardIcon,
  InviteIcon,
  LogoutIcon,
  ShieldIcon,
} from '@/components/profile/ProfileIcons';
import {useStrings} from '@/localization';
import {compactNumber, useProfileSummary} from '@/state/profileSummaryStore';
import type {MainTabParamList} from '@/navigation/types';

// Figma "Profile & Documents" colours
const C = {
  page: '#F8F8F8',
  ink: '#111827',
  grey: '#9DA3AE',
  line: '#E5E7EB',
  red: '#E30445',
  green: '#10A64A',
  bellBg: '#F5F5F5',
  tile: '#F8F8F8',
  chevron: '#C6C6CB',
};

// TODO: take these from the backend too when the APIs are ready
const PROFILE = {rating: '4.9', licenceYear: 2026, referBonus: 50};

const Chevron = () => (
  <Svg width={7} height={12} viewBox="0 0 7 12" fill="none">
    <Path
      d="M2.625 9L4.375 6L2.625 3"
      stroke={C.chevron}
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Svg>
);

const GreenTick = () => <View style={styles.tick} />;

type RowProps = {
  icon: React.ReactNode;
  label: string;
  badge?: string;
  badgeBg?: string;
  badgeColor?: string;
  last?: boolean;
  onPress?: () => void;
};

function MenuRow({icon, label, badge, badgeBg, badgeColor, last, onPress}: RowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.row, !last && styles.rowBorder]}>
      <View style={styles.rowLeft}>
        <View style={styles.rowIcon}>{icon}</View>
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      <View style={styles.rowRight}>
        {badge ? (
          <View style={[styles.badge, {backgroundColor: badgeBg}]}>
            <Text style={[styles.badgeText, {color: badgeColor}]}>{badge}</Text>
          </View>
        ) : null}
        <Chevron />
      </View>
    </Pressable>
  );
}

export default function ProfileScreen() {
  const strings = useStrings();
  const profileStrings = (strings as typeof strings & {profile: Record<string, string>}).profile;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();
  const summary = useProfileSummary();
  const initial = summary.name.trim().charAt(0).toUpperCase();

  const signOut = () => {
    // TODO: clear the saved session / token here too
    (navigation.getParent() as any)?.reset({index: 0, routes: [{name: 'RiderLogin'}]});
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={[styles.header, {paddingTop: insets.top + 16}]}>
        <View style={styles.avatarRing}>
          <Avatar uri={summary.photoUri} size={38} flat />
        </View>
        <Text style={styles.headerTitle}>{profileStrings.appName}</Text>
        <Pressable
          style={styles.bell}
          onPress={() => (navigation as any).navigate('Alerts')}>
          <BellIcon />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, {paddingBottom: insets.bottom + 24}]}
        showsVerticalScrollIndicator={false}>
        {/* Profile card */}
        <View style={[styles.card, styles.profileCard]}>
          <View style={styles.topRow}>
            <View style={styles.topLeft}>
              <View style={styles.initial}>
                <Text style={styles.initialText}>{initial}</Text>
              </View>
              <View style={styles.nameBox}>
                <Text style={styles.name}>{summary.name}</Text>
                <Text style={styles.service}>{profileStrings.service}</Text>
              </View>
            </View>
            <View style={styles.rating}>
              <Text style={styles.ratingText}>{PROFILE.rating}</Text>
            </View>
          </View>

          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{summary.totalTrips === undefined ? '--' : compactNumber(summary.totalTrips)}</Text>
              <Text style={styles.statLabel}>{profileStrings.totalTrips}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={[styles.statValue, {color: C.green}]}>
                {profileStrings.active}
              </Text>
              <Text style={styles.statLabel}>{profileStrings.status}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{summary.weekEarnings === undefined ? '--' : `₹${compactNumber(summary.weekEarnings)}`}</Text>
              <Text style={styles.statLabel}>{profileStrings.thisWeek}</Text>
            </View>
          </View>
        </View>

        {/* Document status */}
        <View style={styles.docs}>
          <View style={[styles.card, styles.docCard]}>
            <View style={styles.docTop}>
              <CarIcon />
              <GreenTick />
            </View>
            <View>
              <Text style={styles.docTitle}>{profileStrings.vehicle}</Text>
              <Text style={styles.docSub}>{profileStrings.verified}</Text>
            </View>
          </View>
          <View style={[styles.card, styles.docCard]}>
            <View style={styles.docTop}>
              <IdCardIcon />
              <GreenTick />
            </View>
            <View>
              <Text style={styles.docTitle}>{profileStrings.license}</Text>
              <Text style={styles.docSub}>
                {strings.formatString(profileStrings.validTill, PROFILE.licenceYear)}
              </Text>
            </View>
          </View>
        </View>

        {/* Menu */}
        <View style={[styles.card, styles.menu]}>
          <MenuRow
            icon={<DocIcon />}
            label={profileStrings.vehicleDocuments}
            badge={profileStrings.allGood}
            badgeBg="#E8F8EE"
            badgeColor={C.green}
            // TODO: open the Document Detail screen (next module screen)
          />
          <MenuRow
            icon={<CashIcon />}
            label={profileStrings.earningsPayouts}
            onPress={() => navigation.navigate('Earnings')}
          />
          <MenuRow
            icon={<ShieldIcon />}
            label={profileStrings.safetyCentre}
            // TODO: Safety Centre screen
          />
          <MenuRow
            icon={<HelpIcon />}
            label={profileStrings.helpSupport}
            // TODO: Help & Support screen
          />
          <MenuRow
            icon={<InviteIcon />}
            label={profileStrings.referRider}
            badge={strings.formatString(profileStrings.referBonus, PROFILE.referBonus) as string}
            badgeBg="#FFF8EC"
            badgeColor="#F5A81C"
            last
            // TODO: Refer a Rider screen
          />
        </View>

        {/* Sign out */}
        <View style={styles.signOutWrap}>
          <Pressable style={styles.signOut} onPress={signOut}>
            <LogoutIcon color={C.red} />
            <Text style={styles.signOutText}>{profileStrings.signOut}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const cardShadow = {
  shadowColor: '#000000',
  shadowOffset: {width: 0, height: 2},
  shadowOpacity: 0.04,
  shadowRadius: 4,
  elevation: 1,
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: C.page},

  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    zIndex: 3,
  },
  avatarRing: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.red,
    overflow: 'hidden',
  },
  headerTitle: {
    fontFamily: fonts.bold,
    fontSize: 20,
    lineHeight: 28,
    color: C.ink,
  },
  bell: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.bellBg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  content: {paddingTop: 20, paddingHorizontal: 20, gap: 16},

  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: C.line,
    ...cardShadow,
  },

  profileCard: {borderRadius: 16, padding: 20, gap: 16},
  topRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  topLeft: {flexDirection: 'row', alignItems: 'center', gap: 14},
  initial: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: C.red,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialText: {fontFamily: fonts.bold, fontSize: 22, color: '#FFFFFF'},
  nameBox: {gap: 3},
  name: {
    fontFamily: fonts.extraBold,
    fontSize: 20,
    lineHeight: 26,
    color: C.ink,
  },
  service: {
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 18,
    color: C.grey,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#FFF9F0',
    borderWidth: 1,
    borderColor: 'rgba(245,168,28,0.2)',
  },
  ratingText: {fontFamily: fonts.bold, fontSize: 13, color: C.ink},

  stats: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: C.line,
    paddingTop: 14,
  },
  stat: {flex: 1, alignItems: 'center', gap: 2},
  statValue: {fontFamily: fonts.bold, fontSize: 16, color: C.ink},
  statLabel: {fontFamily: fonts.regular, fontSize: 12, color: C.grey},
  statDivider: {width: 1, height: 32, backgroundColor: C.line},

  docs: {flexDirection: 'row', gap: 12},
  docCard: {
    flex: 1,
    height: 92,
    borderRadius: 14,
    padding: 16,
    justifyContent: 'space-between',
  },
  docTop: {flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between'},
  tick: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: C.green,
  },
  docTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    lineHeight: 22,
    color: C.ink,
    marginBottom: 3,
  },
  docSub: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: C.green,
  },

  menu: {borderRadius: 16, overflow: 'hidden', shadowRadius: 8},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  rowBorder: {borderBottomWidth: 1, borderBottomColor: C.line},
  rowLeft: {flexDirection: 'row', alignItems: 'center', gap: 14},
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: C.tile,
    overflow: 'hidden',
  },
  rowLabel: {fontFamily: fonts.medium, fontSize: 15, color: C.ink},
  rowRight: {flexDirection: 'row', alignItems: 'center', gap: 8},
  badge: {paddingHorizontal: 10, paddingVertical: 3, borderRadius: 6},
  badgeText: {fontFamily: fonts.semiBold, fontSize: 12},

  signOutWrap: {paddingTop: 4},
  signOut: {
    height: 52,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: C.red,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  signOutText: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    lineHeight: 24,
    color: C.red,
  },
});
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Svg, {Defs, LinearGradient, Rect, Stop} from 'react-native-svg';
import MdiIcon from '@/components/common/MdiIcon';
import {colors} from '@/constants/colors';
import {MDI_HOME} from '@/constants/iconPathsHome';
import {fonts} from '@/constants/typography';
import {useStrings} from '@/localization';
import {formatRupees} from '@/utils/formatCurrency';

// path from @mdi/js (trending-down), Apache-2.0
const TRENDING_DOWN =
  'M16,18L18.29,15.71L13.41,10.83L9.41,14.83L2,7.41L3.41,6L9.41,12L13.41,8L19.71,14.29L22,12V18H16Z';

type Props = {
  total: number;
  changePercent: number; // vs last week, e.g. 15 or -8
};

// Dark navy card: "THIS WEEK", the amount and a green "+15% vs last week" pill.
export default function WeekCard({total, changePercent}: Props) {
  const strings = useStrings();
  const up = changePercent >= 0;
  const tone = up ? colors.greenOnDark : colors.redOnDark;
  const percent = `${up ? '+' : '-'}${Math.abs(changePercent)}%`;

  return (
    <View style={styles.card}>
      {/* left-to-right gradient, drawn with react-native-svg (already installed) */}
      <Svg style={StyleSheet.absoluteFill} width="100%" height="100%" preserveAspectRatio="none">
        <Defs>
          <LinearGradient id="weekGradient" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor={colors.navyStart} />
            <Stop offset="1" stopColor={colors.navyEnd} />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#weekGradient)" />
      </Svg>

      <Text style={styles.label}>{strings.earnings.thisWeek}</Text>
      <Text style={styles.amount}>{formatRupees(total)}</Text>

      <View style={[styles.pill, {backgroundColor: up ? colors.greenOnDarkBg : colors.redOnDarkBg}]}>
        <MdiIcon path={up ? MDI_HOME.trendingUp : TRENDING_DOWN} size={15} color={tone} />
        <Text style={[styles.pillText, {color: tone}]}>
          {strings.formatString(strings.earnings.vsLastWeek, percent)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    paddingVertical: 28,
    borderRadius: 28,
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: colors.navyStart,
    elevation: 8,
    shadowColor: colors.navyStart,
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 12,
    letterSpacing: 1.5,
    color: colors.textOnDarkMuted,
  },
  amount: {
    marginTop: 8,
    fontFamily: fonts.bold,
    fontSize: 44,
    lineHeight: 52,
    color: '#FFFFFF',
  },
  pill: {
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pillText: {
    marginLeft: 6,
    fontFamily: fonts.semiBold,
    fontSize: 13,
  },
});
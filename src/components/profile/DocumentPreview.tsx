import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Svg, {Defs, LinearGradient, Rect, Stop} from 'react-native-svg';
import MdiIcon from '@/components/common/MdiIcon';
import {MDI_DOCDETAIL} from '@/constants/iconPathsDocDetail';
import {MDI_DOCS} from '@/constants/iconPathsDocs';
import {fonts} from '@/constants/typography';

type Props = {
  badge: string;
  badgeColor: string;
  badgeBg: string;
  badgeBorder: string;
  maskedText: string;
};

const SOFT_BLUE = '#8F98AC';

// The grey "masked" preview card with the status badge in the corner.
export default function DocumentPreview({
  badge,
  badgeColor,
  badgeBg,
  badgeBorder,
  maskedText,
}: Props) {
  return (
    <View style={styles.card}>
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="previewBg" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#9A9A9A" />
            <Stop offset="0.55" stopColor="#CFCFCF" />
            <Stop offset="1" stopColor="#F6F6F6" />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#previewBg)" />
      </Svg>

      <View style={styles.inner}>
        <MdiIcon path={MDI_DOCS.cardAccountDetails} size={30} color={SOFT_BLUE} />
        <Text style={styles.masked}>{maskedText}</Text>
      </View>

      <View style={[styles.badge, {backgroundColor: badgeBg, borderColor: badgeBorder}]}>
        <MdiIcon path={MDI_DOCDETAIL.checkCircle} size={16} color={badgeColor} />
        <Text style={[styles.badgeText, {color: badgeColor}]}>{badge}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 192,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#CFCFCF',
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  inner: {
    position: 'absolute',
    left: 14,
    right: 14,
    top: 14,
    bottom: 14,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.7)',
    backgroundColor: 'rgba(176,176,176,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  masked: {
    fontFamily: fonts.bold,
    fontSize: 11,
    letterSpacing: 1.2,
    color: SOFT_BLUE,
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 20,
    height: 26,
    paddingHorizontal: 10,
    borderRadius: 13,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badgeText: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
  },
});
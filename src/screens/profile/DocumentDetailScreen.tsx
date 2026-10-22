import React, {useEffect, useRef, useState} from 'react';
import {NativeModules, Pressable, ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ArrowLeftIcon} from '@/components/common/Icons';
import MdiIcon from '@/components/common/MdiIcon';
import DocumentPreview from '@/components/profile/DocumentPreview';
import {MDI} from '@/constants/iconPaths';
import {MDI_DOCDETAIL} from '@/constants/iconPathsDocDetail';
import {MDI_DOCS} from '@/constants/iconPathsDocs';
import {fonts} from '@/constants/typography';
import {useStrings} from '@/localization';
import {useDisplayProfile} from '@/state/displayProfile';
import {useDocumentDetail} from '@/state/documentDetailStore';
import type {RootStackParamList} from '@/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'DocumentDetail'>;

// Same colours as the Profile screen
const C = {
  ink: '#111827',
  grey: '#6B7280',
  light: '#9DA3AE',
  line: '#E5E7EB',
  red: '#E30445',
  green: '#10A64A',
  amber: '#F5A81C',
  redStatus: '#DC2626',
  circle: '#F3F4F6',
};

export default function DocumentDetailScreen({navigation, route}: Props) {
  const strings = useStrings();
  const t = (strings as typeof strings & {documentDetail: Record<string, string>})
    .documentDetail;
  const insets = useSafeAreaInsets();
  const {role} = useDisplayProfile();
  const {detail} = useDocumentDetail(route.params.docKey);

  // Copy button: shows a green tick for a moment after copying
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const onCopy = async () => {
    if (!detail) {
      return;
    }

    const clipboardModule = (NativeModules as typeof NativeModules & {
      RNCClipboard?: {setString?: (value: string) => void};
      Clipboard?: {setString?: (value: string) => void};
    }).RNCClipboard ?? (NativeModules as typeof NativeModules & {
      Clipboard?: {setString?: (value: string) => void};
    }).Clipboard;

    if (clipboardModule?.setString) {
      clipboardModule.setString(detail.number);
    } else {
      const clipboard = (globalThis as typeof globalThis & {
        navigator?: {clipboard?: {writeText: (value: string) => Promise<void>}};
      }).navigator?.clipboard;
      if (!clipboard) {
        return;
      }
      await clipboard.writeText(detail.number);
    }

    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1500);
  };

  const onMore = () => {
    // TODO: open the options menu (design only shows the button)
  };

  const onUpdate = () => {
    // Opens the same upload screen the rider / driver used during registration
    if (role === 'rider') {
      navigation.navigate('UploadDocument', {docId: 'licence'});
    } else {
      navigation.navigate('DriverUploadDocument', {docId: 'licence'});
    }
  };

  const approval = detail?.approval ?? 'approved';
  const badge =
    approval === 'approved'
      ? {label: t.approved, color: C.green, bg: 'rgba(22,163,74,0.14)', border: 'rgba(22,163,74,0.35)'}
      : approval === 'pending'
        ? {label: t.underReview, color: '#B7791F', bg: 'rgba(245,168,28,0.18)', border: 'rgba(245,168,28,0.4)'}
        : {label: t.rejected, color: C.redStatus, bg: 'rgba(220,38,38,0.12)', border: 'rgba(220,38,38,0.35)'};

  const isValid = detail?.status === 'valid';
  const showNotice = detail?.approval === 'approved' && isValid;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={[styles.header, {paddingTop: insets.top + 16}]}>
        <Pressable style={styles.back} onPress={() => navigation.goBack()} hitSlop={8}>
          <ArrowLeftIcon size={22} color={C.ink} />
        </Pressable>
        <Text style={styles.title} numberOfLines={1}>
          {t.licenceTitle}
        </Text>
        <Pressable style={styles.more} onPress={onMore} hitSlop={8}>
          <MdiIcon path={MDI_DOCDETAIL.dotsVertical} size={20} color={C.ink} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <DocumentPreview
          badge={badge.label}
          badgeColor={badge.color}
          badgeBg={badge.bg}
          badgeBorder={badge.border}
          maskedText={t.previewMasked}
        />

        <Text style={styles.heading}>{t.details}</Text>

        <View style={styles.card}>
          <View style={styles.block}>
            <View style={styles.blockTop}>
              <View style={styles.flex}>
                <Text style={styles.label}>{t.documentNumber}</Text>
                <Text style={[styles.value, styles.number]}>{detail?.number ?? '--'}</Text>
              </View>
              <Pressable onPress={onCopy} hitSlop={10} style={styles.copy}>
                <MdiIcon
                  path={copied ? MDI.check : MDI_DOCDETAIL.contentCopy}
                  size={20}
                  color={copied ? C.green : C.grey}
                />
              </Pressable>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.block}>
            <Text style={styles.label}>{t.issuedState}</Text>
            <Text style={styles.value}>{detail?.issuedState ?? '--'}</Text>
          </View>

          <View style={styles.divider} />

          <View style={[styles.block, styles.lastRow]}>
            <View>
              <Text style={styles.label}>{t.expirationDate}</Text>
              <Text style={styles.value}>{detail?.expiry ?? '--'}</Text>
            </View>
            <View style={styles.statusCol}>
              <Text style={styles.label}>{t.status}</Text>
              <Text
                style={[
                  styles.statusValue,
                  {color: detail && !isValid ? C.redStatus : C.green},
                ]}>
                {detail ? (isValid ? t.valid : t.expired) : '--'}
              </Text>
            </View>
          </View>
        </View>

        {showNotice ? (
          <View style={styles.notice}>
            <MdiIcon path={MDI_DOCS.informationOutline} size={22} color={C.grey} />
            <Text style={styles.noticeText}>{t.notice}</Text>
          </View>
        ) : null}
      </ScrollView>

      <View style={[styles.bottom, {paddingBottom: Math.max(insets.bottom, 16) + 8}]}>
        <Pressable style={styles.update} onPress={onUpdate}>
          <MdiIcon path={MDI_DOCDETAIL.fileUploadOutline} size={22} color="#FFFFFF" />
          <Text style={styles.updateText}>{t.update}</Text>
        </Pressable>
        <Text style={styles.updateNote}>{t.updateNote}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {flex: 1},
  container: {flex: 1, backgroundColor: '#FFFFFF'},

  header: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.circle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    fontFamily: fonts.bold,
    fontSize: 20,
    lineHeight: 28,
    color: C.ink,
  },
  more: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.line,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {paddingHorizontal: 20, paddingTop: 20, paddingBottom: 24},

  heading: {
    marginTop: 22,
    marginBottom: 14,
    fontFamily: fonts.bold,
    fontSize: 18,
    lineHeight: 24,
    color: C.ink,
  },

  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.line,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
  },
  block: {paddingVertical: 14},
  blockTop: {flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between'},
  lastRow: {flexDirection: 'row', justifyContent: 'space-between'},
  divider: {height: 1, backgroundColor: C.line},
  label: {fontFamily: fonts.regular, fontSize: 12, lineHeight: 16, color: C.grey},
  value: {
    marginTop: 3,
    fontFamily: fonts.bold,
    fontSize: 16,
    lineHeight: 22,
    color: C.ink,
  },
  number: {letterSpacing: 0.6},
  copy: {paddingTop: 4, paddingLeft: 12},
  statusCol: {alignItems: 'flex-end'},
  statusValue: {
    marginTop: 8,
    fontFamily: fonts.bold,
    fontSize: 13,
    lineHeight: 18,
  },

  notice: {
    marginTop: 28,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.line,
    backgroundColor: '#F8F9FB',
  },
  noticeText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 19,
    color: C.grey,
  },

  bottom: {paddingHorizontal: 20, paddingTop: 12, backgroundColor: '#FFFFFF'},
  update: {
    height: 54,
    borderRadius: 14,
    backgroundColor: C.red,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: C.red,
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  updateText: {fontFamily: fonts.bold, fontSize: 17, color: '#FFFFFF'},
  updateNote: {
    marginTop: 14,
    paddingHorizontal: 24,
    textAlign: 'center',
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 17,
    color: C.grey,
  },
});
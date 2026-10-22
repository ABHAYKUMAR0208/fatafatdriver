import React, {useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ArrowLeftIcon} from '@/components/common/Icons';
import MdiIcon from '@/components/common/MdiIcon';
import {fonts} from '@/constants/typography';
import {useStrings} from '@/localization';
import type {RootStackParamList} from '@/navigation/types';
import {setDriverProfile} from '@/state/driverProfileStore';
import {
  BankBranch,
  IFSC_REGEX,
  lookupIfsc,
  saveBankDetails,
} from '@/state/ifscLookup';
import {setRiderProfile} from '@/state/riderProfileStore';

type Props = NativeStackScreenProps<RootStackParamList, 'BankDetails'>;

// Figma "Add Bank Account" colours
const C = {
  page: '#F8F8F8',
  ink: '#1A1A1A',
  grey: '#9DA3AE',
  hint: '#C6C6CB',
  border: '#E8E8E8',
  red: '#E30445',
  green: '#10A64A',
};

const LOCK_OUTLINE =
  'M12,17C10.89,17 10,16.1 10,15C10,13.89 10.89,13 12,13A2,2 0 0,1 14,15A2,2 0 0,1 12,17M18,20V10H6V20H18M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V10C4,8.89 4.89,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z';
const CHECK = 'M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z';

type Errors = {holder?: string; account?: string; confirm?: string; ifsc?: string};

export default function BankDetailsScreen({navigation, route}: Props) {
  const strings = useStrings();
  const t = strings.bankDetails;
  const insets = useSafeAreaInsets();
  // where to go after saving: rider flow -> Review & Submit, driver flow -> Driver Review
  const next = route.params?.next ?? 'ReviewSubmit';

  const [holder, setHolder] = useState('');
  const [account, setAccount] = useState('');
  const [confirm, setConfirm] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [branch, setBranch] = useState<BankBranch | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const clear = (key: keyof Errors) => setErrors(e => ({...e, [key]: undefined}));

  const onIfscChange = (text: string) => {
    setIfsc(text.toUpperCase().replace(/[^A-Z0-9]/g, ''));
    setBranch(null);
    clear('ifsc');
  };

  const onVerify = async () => {
    if (verifying) {
      return;
    }
    if (!IFSC_REGEX.test(ifsc)) {
      setErrors(e => ({...e, ifsc: t.ifscInvalid}));
      return;
    }
    setVerifying(true);
    try {
      setBranch(await lookupIfsc(ifsc));
      clear('ifsc');
    } catch {
      setBranch(null);
      setErrors(e => ({...e, ifsc: t.ifscNotFound}));
    } finally {
      setVerifying(false);
    }
  };

  const onSave = async () => {
    if (saving) {
      return;
    }
    const found: Errors = {};
    if (holder.trim().length < 3) {
      found.holder = t.holderError;
    }
    if (account.length < 9 || account.length > 18) {
      found.account = t.accountError;
    }
    if (confirm !== account || !confirm) {
      found.confirm = t.confirmError;
    }
    if (!IFSC_REGEX.test(ifsc)) {
      found.ifsc = t.ifscInvalid;
    } else if (!branch) {
      found.ifsc = t.verifyFirst;
    }
    setErrors(found);
    if (Object.keys(found).length > 0 || !branch) {
      return;
    }

    setSaving(true);
    try {
      await saveBankDetails({holder: holder.trim(), accountNumber: account, ifsc});
      const patch = {bank: branch.bank, account: account.slice(-4)};
      if (next === 'DriverReview') {
        setDriverProfile(patch);
      } else {
        setRiderProfile(patch);
      }
      navigation.navigate(next);
    } catch {
      setErrors({ifsc: t.saveFailed});
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={[styles.header, {paddingTop: insets.top + 16}]}>
        <Pressable style={styles.back} onPress={() => navigation.goBack()} hitSlop={8}>
          <ArrowLeftIcon size={22} color={C.ink} />
        </Pressable>
        <Text style={styles.headerTitle}>{t.title}</Text>
      </View>

      <KeyboardAwareScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.intro}>
          <Text style={styles.heading}>{t.heading}</Text>
          <Text style={styles.sub}>{t.subtitle}</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>{t.holderLabel}</Text>
            <TextInput
              style={[styles.input, !!errors.holder && styles.inputError]}
              value={holder}
              onChangeText={v => {
                setHolder(v);
                clear('holder');
              }}
              placeholder={t.holderPlaceholder}
              placeholderTextColor={C.hint}
              autoCapitalize="words"
              autoCorrect={false}
            />
            {errors.holder ? <Text style={styles.error}>{errors.holder}</Text> : null}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>{t.accountLabel}</Text>
            <TextInput
              style={[styles.input, !!errors.account && styles.inputError]}
              value={account}
              onChangeText={v => {
                setAccount(v.replace(/\D/g, ''));
                clear('account');
              }}
              placeholder={t.accountPlaceholder}
              placeholderTextColor={C.hint}
              keyboardType="number-pad"
              maxLength={18}
            />
            {errors.account ? <Text style={styles.error}>{errors.account}</Text> : null}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>{t.confirmLabel}</Text>
            <TextInput
              style={[styles.input, !!errors.confirm && styles.inputError]}
              value={confirm}
              onChangeText={v => {
                setConfirm(v.replace(/\D/g, ''));
                clear('confirm');
              }}
              placeholder={t.confirmPlaceholder}
              placeholderTextColor={C.hint}
              keyboardType="number-pad"
              maxLength={18}
            />
            {errors.confirm ? <Text style={styles.error}>{errors.confirm}</Text> : null}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>{t.ifscLabel}</Text>
            <View>
              <TextInput
                style={[styles.input, styles.ifscInput, !!errors.ifsc && styles.inputError]}
                value={ifsc}
                onChangeText={onIfscChange}
                placeholder={t.ifscPlaceholder}
                placeholderTextColor={C.hint}
                autoCapitalize="characters"
                autoCorrect={false}
                maxLength={11}
              />
              <Pressable style={styles.verify} onPress={onVerify} hitSlop={6}>
                {verifying ? (
                  <ActivityIndicator size="small" color={C.red} />
                ) : (
                  <Text style={styles.verifyText}>{t.verify}</Text>
                )}
              </Pressable>
            </View>
            {errors.ifsc ? <Text style={styles.error}>{errors.ifsc}</Text> : null}

            {branch ? (
              <View style={styles.bankCard}>
                <View style={styles.tick}>
                  <MdiIcon path={CHECK} size={12} color="#FFFFFF" />
                </View>
                <View style={styles.bankText}>
                  <Text style={styles.bankName}>{branch.bank}</Text>
                  <Text style={styles.bankBranch}>{branch.branch}</Text>
                </View>
              </View>
            ) : null}
          </View>

          <View style={styles.notice}>
            <View style={styles.lockTile}>
              <MdiIcon path={LOCK_OUTLINE} size={16} color={C.red} />
            </View>
            <Text style={styles.noticeText}>{t.secure}</Text>
          </View>
        </View>
      </KeyboardAwareScrollView>

      <View style={[styles.cta, {paddingBottom: Math.max(insets.bottom, 16)}]}>
        <Pressable style={[styles.save, saving && styles.saving]} onPress={onSave}>
          {saving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.saveText}>{t.save}</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {flex: 1},
  container: {flex: 1, backgroundColor: C.page},

  header: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingLeft: 8,
    paddingRight: 20,
    paddingBottom: 16,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    zIndex: 2,
  },
  back: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {fontFamily: fonts.bold, fontSize: 18, color: C.ink},

  content: {paddingTop: 24, paddingHorizontal: 20, paddingBottom: 32, gap: 24},
  intro: {gap: 6},
  heading: {fontFamily: fonts.extraBold, fontSize: 24, color: C.ink},
  sub: {fontFamily: fonts.regular, fontSize: 14, lineHeight: 22, color: C.grey},

  form: {gap: 20},
  field: {gap: 8},
  label: {fontFamily: fonts.semiBold, fontSize: 13, color: C.ink},
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: fonts.regular,
    fontSize: 15,
    color: C.ink,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  inputError: {borderColor: C.red},
  ifscInput: {paddingRight: 72},
  error: {fontFamily: fonts.regular, fontSize: 12, color: C.red},

  verify: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyText: {fontFamily: fonts.bold, fontSize: 13, color: C.red},

  bankCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#F0FBF5',
    borderWidth: 1,
    borderColor: 'rgba(16,166,74,0.2)',
  },
  tick: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: C.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bankText: {gap: 2},
  bankName: {fontFamily: fonts.bold, fontSize: 13, color: C.ink},
  bankBranch: {fontFamily: fonts.regular, fontSize: 12, color: C.grey},

  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 15,
    borderRadius: 12,
    backgroundColor: C.page,
    borderWidth: 1,
    borderColor: C.border,
  },
  lockTile: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FFF0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noticeText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 20,
    color: C.grey,
  },

  cta: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 17,
    paddingHorizontal: 16,
  },
  save: {
    height: 54,
    borderRadius: 14,
    backgroundColor: C.red,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: C.red,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  saving: {opacity: 0.7},
  saveText: {fontFamily: fonts.bold, fontSize: 16, color: '#FFFFFF'},
});
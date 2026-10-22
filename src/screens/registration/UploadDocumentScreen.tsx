import React, {useState} from 'react';
import {
  Image,
  KeyboardAvoidingView,
  PermissionsAndroid,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import MdiIcon from '@/components/common/MdiIcon';
import ActionButton from '@/components/registration/ActionButton';
import BottomBar from '@/components/registration/BottomBar';
import DateField from '@/components/registration/DateField';
import {SelectField, TextField} from '@/components/registration/FormFields';
import StepHeader from '@/components/registration/StepHeader';
import {colors} from '@/constants/colors';
import {getDocument} from '@/constants/documents';
import {MDI_DOCS} from '@/constants/iconPathsDocs';
import {INDIAN_STATES, stateLabel} from '@/constants/indianStates';
import {fonts} from '@/constants/typography';
import {useStrings} from '@/localization';
import {saveDocumentDetail} from '@/state/documentDetailStore';
import {markUploaded} from '@/state/documentStore';
import {
  formatExpiry,
  isValidExpiry,
  sanitizeDocNumber,
  startOfToday,
  validateDocNumber,
} from '@/utils/documentValidation';
import type {RootStackParamList} from '@/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'UploadDocument'>;

async function ensureCameraPermission() {
  if (Platform.OS !== 'android') {
    return true; // iOS asks by itself (needs NSCameraUsageDescription)
  }
  const result = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.CAMERA,
  );
  return result === PermissionsAndroid.RESULTS.GRANTED;
}

export default function UploadDocumentScreen({navigation, route}: Props) {
  const strings = useStrings();
  const doc = getDocument(route.params.docId);
  const text = strings.documents[doc.id];
  const [images, setImages] = useState<(string | undefined)[]>(
    text.sides.map(() => undefined),
  );
  const [active, setActive] = useState(0);
  const [number, setNumber] = useState('');
  const [expiryDigits, setExpiryDigits] = useState(''); // "mmddyyyy"
  const [stateCode, setStateCode] = useState<string | undefined>();

  const previewUri = images[active] ?? images.find(Boolean);
  const isLicence = doc.id === 'licence';
  const allPicked = images.every(Boolean);

  // Save stays off until every field holds real data: a valid number,
  // an expiry date that is today or later, and (licence) the issuing state.
  const numberOk = !text.numberLabel || validateDocNumber(doc.id, number);
  const expiryOk = !doc.hasExpiry || isValidExpiry(expiryDigits);
  const stateOk = !isLicence || !!stateCode;
  const canSave = allPicked && numberOk && expiryOk && stateOk;
  const showNumberError = !!text.numberLabel && number.length > 0 && !numberOk;

  const setImage = (uri: string) => {
    setImages(prev => prev.map((old, i) => (i === active ? uri : old)));
    // jump to the next empty side so the rider can keep going
    const next = images.findIndex((u, i) => i !== active && !u);
    if (next !== -1) {
      setActive(next);
    }
  };

  const onCamera = async () => {
    if (!(await ensureCameraPermission())) {
      return;
    }
    const result = await launchCamera({mediaType: 'photo', quality: 0.8});
    const uri = result.assets?.[0]?.uri;
    if (uri) {
      setImage(uri);
    }
  };

  const onGallery = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
      quality: 0.8,
    });
    const uri = result.assets?.[0]?.uri;
    if (uri) {
      setImage(uri);
    }
  };

  const onSave = () => {
    if (!canSave) {
      return;
    }
    // TODO: upload the images and these details with your API
    if (isLicence && stateCode) {
      // shows on the Driver's License page (Profile -> licence card)
      saveDocumentDetail('licence', {
        number,
        issuedState: stateLabel(stateCode),
        expiry: formatExpiry(expiryDigits),
      });
    }
    markUploaded(doc.id);
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior="padding">
      <StatusBar barStyle="dark-content" />
      <StepHeader title="Fatafat" onBack={() => navigation.goBack()} />

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.tipCard}>
          <View style={styles.tipIcon}>
            <MdiIcon
              path={MDI_DOCS.informationOutline}
              size={22}
              color={colors.primary}
            />
          </View>
          <Text style={styles.tipTitle}>{strings.common.photoTipTitle}</Text>
          <Text style={styles.tipText}>{strings.common.photoTipText}</Text>
        </View>

        {text.sides.map((label, i) => (
          <Pressable
            key={label}
            onPress={() => setActive(i)}
            style={[styles.drop, active === i && styles.dropActive]}>
            {images[i] ? (
              <Image source={{uri: images[i]}} style={styles.dropImage} />
            ) : (
              <Text style={styles.dropText}>{label}</Text>
            )}
          </Pressable>
        ))}

        <View style={styles.btnRow}>
          <Pressable style={styles.srcBtn} onPress={onCamera}>
            <MdiIcon path={MDI_DOCS.camera} size={16} color="#FFFFFF" />
            <Text style={styles.srcText}>{strings.common.camera}</Text>
          </Pressable>
          <Pressable style={styles.srcBtn} onPress={onGallery}>
            <MdiIcon path={MDI_DOCS.image} size={16} color="#FFFFFF" />
            <Text style={styles.srcText}>{strings.common.gallery}</Text>
          </Pressable>
        </View>

        {text.numberLabel ? (
          <TextField
            containerStyle={styles.firstField}
            label={text.numberLabel}
            placeholder={strings.common.numberPlaceholder}
            value={number}
            onChangeText={t => setNumber(sanitizeDocNumber(doc.id, t))}
            autoCapitalize="characters"
            autoCorrect={false}
          />
        ) : null}
        {showNumberError ? (
          <Text style={styles.errorText}>{strings.common.numberInvalid}</Text>
        ) : null}
        {isLicence ? (
          <SelectField
            label={strings.common.issuedState}
            placeholder={strings.common.selectState}
            value={stateCode}
            options={INDIAN_STATES.map(s => ({value: s.code, label: stateLabel(s.code)}))}
            onChange={setStateCode}
          />
        ) : null}
        {doc.hasExpiry ? (
          <DateField
            label={strings.common.expiryDate}
            placeholder={strings.common.selectExpiry}
            value={expiryDigits}
            onChange={setExpiryDigits}
            // only today or a later date can be picked
            minDate={startOfToday()}
            minYear={startOfToday().getFullYear()}
            maxYear={startOfToday().getFullYear() + 30}
            defaultYear={startOfToday().getFullYear()}
          />
        ) : null}

        {previewUri ? (
          <View style={styles.previewWrap}>
            <Text style={styles.previewLabel}>{strings.uploadDocument.preview}</Text>
            <View style={styles.preview}>
              <Image source={{uri: previewUri}} style={styles.previewImage} />
              <View style={styles.uploadedPill}>
                <Text style={styles.uploadedText}>{strings.common.uploaded}</Text>
              </View>
            </View>
          </View>
        ) : null}
      </ScrollView>

      <BottomBar>
        <ActionButton
          title={strings.uploadDocument.save}
          disabled={!canSave}
          onPress={onSave}
        />
      </BottomBar>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 24,
  },
  tipCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  tipIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipTitle: {
    marginTop: 12,
    fontFamily: fonts.semiBold,
    fontSize: 18,
    lineHeight: 24,
    color: colors.textDark,
  },
  tipText: {
    marginTop: 2,
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  drop: {
    marginTop: 24,
    height: 190,
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.border,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  dropActive: {
    borderColor: colors.primary,
  },
  dropImage: {
    width: '100%',
    height: '100%',
  },
  dropText: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: colors.textSecondary,
  },
  btnRow: {
    marginTop: 16,
    flexDirection: 'row',
    gap: 16,
  },
  srcBtn: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  srcText: {
    marginLeft: 8,
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: '#FFFFFF',
  },
  firstField: {
    marginTop: 24,
  },
  errorText: {
    marginTop: -6,
    marginBottom: 12,
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: '#DC2626',
  },
  previewWrap: {
    marginTop: 12,
  },
  previewLabel: {
    marginBottom: 6,
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: colors.textSecondary,
  },
  preview: {
    height: 180,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewImage: {
    ...StyleSheet.absoluteFill,
  },
  uploadedPill: {
    height: 32,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: 'rgba(15,18,36,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadedText: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: '#FFFFFF',
  },
});
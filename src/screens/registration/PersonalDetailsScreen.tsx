import React, {useState} from 'react';
import {Alert, Image, Pressable, StatusBar, StyleSheet, Text, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Svg, {Circle} from 'react-native-svg';
import {launchImageLibrary} from 'react-native-image-picker';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ArrowRightIcon} from '@/components/common/Icons';
import MdiIcon from '@/components/common/MdiIcon';
import PrimaryButton from '@/components/common/PrimaryButton';
import BottomBar from '@/components/registration/BottomBar';
import {SelectField, TextField} from '@/components/registration/FormFields';
import {SegmentedProgress} from '@/components/registration/Progress';
import SectionHeading from '@/components/registration/SectionHeading';
import StepHeader from '@/components/registration/StepHeader';
import {colors} from '@/constants/colors';
import {MDI} from '@/constants/iconPaths';
import {MDI_DOCS} from '@/constants/iconPathsDocs';
import {fonts} from '@/constants/typography';
import {setRiderProfile, useRiderProfile} from '@/state/riderProfileStore';
import type {RootStackParamList} from '@/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'PersonalDetails'>;

const GENDERS = ['Male', 'Female', 'Other', 'Prefer not to say'];
const RING = 88;

// digits -> "mm / dd / yyyy"
function formatDob(digits: string) {
  let out = digits.slice(0, 2);
  if (digits.length > 2) {
    out += ` / ${digits.slice(2, 4)}`;
  }
  if (digits.length > 4) {
    out += ` / ${digits.slice(4, 8)}`;
  }
  return out;
}

export default function PersonalDetailsScreen({navigation, route}: Props) {
  const saved = useRiderProfile();
  const [photoUri, setPhotoUri] = useState<string | undefined>(saved.photoUri);
  const [name, setName] = useState(saved.name);
  const [email, setEmail] = useState(saved.email);
  const [phone, setPhone] = useState(saved.phone); // 10 digits only
  const [dobDigits, setDobDigits] = useState(saved.dobDigits);
  const [gender, setGender] = useState<string | undefined>(saved.gender);

  const onChoosePhoto = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
      quality: 0.8,
    });
    const uri = result.assets?.[0]?.uri;
    if (uri) {
      setPhotoUri(uri);
    }
  };

  const onSave = () => {
    if (phone.length !== 10) {
      Alert.alert('Invalid phone number', 'Please enter a valid 10-digit phone number.');
      return;
    }
    // TODO: validate the other fields, then also save with your API
    setRiderProfile({photoUri, name, email, phone, dobDigits, gender});
    if (route.params?.fromReview) {
      navigation.goBack(); // came from Review: return there
    } else {
      navigation.navigate('VehicleType');
    }
  };

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="dark-content" />
      <StepHeader title="Fatafat" onBack={() => navigation.goBack()} />

      <KeyboardAwareScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        enableOnAndroid
        extraScrollHeight={24}
        enableResetScrollToCoords={false}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Personal Details</Text>
          <Text style={styles.step}>Step 1 of 4</Text>
        </View>
        <View style={styles.progress}>
          <SegmentedProgress step={1} />
        </View>

        <View style={styles.uploadCard}>
          <View style={styles.ring}>
            <Svg width={RING} height={RING} style={StyleSheet.absoluteFill}>
              <Circle
                cx={RING / 2}
                cy={RING / 2}
                r={RING / 2 - 1}
                fill={colors.ringFill}
                stroke={colors.primary}
                strokeWidth={2}
                strokeDasharray="6 4"
              />
            </Svg>
            {photoUri ? (
              <Image source={{uri: photoUri}} style={styles.photo} />
            ) : (
              <View style={styles.cameraCircle}>
                <MdiIcon
                  path={MDI.cameraPlusOutline}
                  size={26}
                  color={colors.primary}
                />
              </View>
            )}
          </View>
          <Text style={styles.uploadTitle}>Upload Profile Photo</Text>
          <Text style={styles.uploadSub}>
            Clear, front-facing image. No sunglasses.
          </Text>
          <Pressable style={styles.chooseBtn} onPress={onChoosePhoto}>
            <Text style={styles.chooseText}>Choose Photo</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <SectionHeading title="IDENTITY" />
        </View>

        <TextField
          label="Full Legal Name"
          placeholder="As it appears on your license"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
        <TextField
          label="Email Address"
          placeholder="driver@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextField
          label="Phone Number"
          placeholder="10-digit mobile number"
          value={phone}
          onChangeText={t => setPhone(t.replace(/\D/g, '').slice(0, 10))}
          keyboardType="phone-pad"
          maxLength={10}
        />
        <View style={styles.twoCols}>
          <TextField
            containerStyle={styles.col}
            label="Date of Birth"
            placeholder="mm / dd / yyyy"
            value={formatDob(dobDigits)}
            onChangeText={text =>
              setDobDigits(text.replace(/\D/g, '').slice(0, 8))
            }
            keyboardType="number-pad"
            maxLength={14}
          />
          <SelectField
            containerStyle={styles.col}
            label="Gender"
            placeholder="Select"
            value={gender}
            options={GENDERS}
            onChange={setGender}
          />
        </View>
      </KeyboardAwareScrollView>

      <BottomBar>
        <PrimaryButton
          title="Save & Continue"
          onPress={onSave}
          style={styles.cta}
          icon={<ArrowRightIcon size={18} color="#FFFFFF" />}
        />
      </BottomBar>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 20,
    lineHeight: 26,
    color: colors.textDark,
  },
  step: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textSecondary,
  },
  progress: {
    marginTop: 11,
  },
  uploadCard: {
    marginTop: 25,
    paddingTop: 20,
    paddingBottom: 19,
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  ring: {
    width: RING,
    height: RING,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.pinkSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photo: {
    width: RING - 8,
    height: RING - 8,
    borderRadius: (RING - 8) / 2,
  },
  uploadTitle: {
    marginTop: 13,
    fontFamily: fonts.semiBold,
    fontSize: 15,
    lineHeight: 20,
    color: colors.textDark,
  },
  uploadSub: {
    marginTop: 2,
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
  },
  chooseBtn: {
    marginTop: 13,
    height: 32,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: colors.pinkSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chooseText: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.primary,
  },
  section: {
    marginTop: 25,
  },
  twoCols: {
    flexDirection: 'row',
    gap: 12,
  },
  col: {
    flex: 1,
  },
  cta: {
    height: 54,
  },
});
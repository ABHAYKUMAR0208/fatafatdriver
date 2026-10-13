import React, {useState} from 'react';
import {Pressable, StatusBar, StyleSheet, Text, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ArrowRightIcon} from '@/components/common/Icons';
import MdiIcon from '@/components/common/MdiIcon';
import ActionButton from '@/components/registration/ActionButton';
import BottomBar from '@/components/registration/BottomBar';
import DriverHeader from '@/components/driver/DriverHeader';
import {DriverTextField} from '@/components/driver/DriverFields';
import DriverStepTitle from '@/components/driver/DriverStepTitle';
import SectionLabel from '@/components/driver/SectionLabel';
import {colors} from '@/constants/colors';
import {MDI_DOCS} from '@/constants/iconPathsDocs';
import {fonts} from '@/constants/typography';
import type {RootStackParamList} from '@/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'DriverAvailability'>;

// The design shows dark borders on the unselected cards on this screen.
// Change this one line to colors.border if you want light borders instead.
const UNSELECTED_BORDER = colors.textDark;

const SERVICES = [
  {id: 'hourly', name: 'Hourly', sub: 'Minimum 2 hrs booking', commission: 20},
  {id: 'halfday', name: 'Half Day', sub: 'Up to 6 hrs duty slot', commission: 15},
  {id: 'fullday', name: 'Full Day', sub: 'Up to 12 hrs duty slot', commission: 12},
  {id: 'outstation', name: 'Outstation', sub: 'Multi-day out of city trips', commission: 10},
];

const TIMINGS = [
  {id: 'morning', name: 'Morning', range: '6AM-12PM'},
  {id: 'afternoon', name: 'Afternoon', range: '12PM-6PM'},
  {id: 'evening', name: 'Evening', range: '6PM-12AM'},
  {id: 'night', name: 'Night', range: '12AM-6AM'},
];

export default function DriverAvailabilityScreen({navigation}: Props) {
  const [service, setService] = useState('hourly');
  const [timings, setTimings] = useState<string[]>(['morning', 'evening']);
  const [region, setRegion] = useState('South Delhi & Gurgaon Area');

  const toggleTiming = (id: string) =>
    setTimings(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
    );

  const onContinue = () => {
    // TODO: save availability with your API
    navigation.navigate('DriverDocuments');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <DriverHeader
        title="Registration"
        variant="plain"
        onBack={() => navigation.goBack()}
      />

      <KeyboardAwareScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        enableOnAndroid
        extraScrollHeight={24}
        enableResetScrollToCoords={false}>
        <DriverStepTitle title="Availability & Preferences" step={3} />

        <SectionLabel title="SERVICE TYPE PREFERENCE" style={styles.sectionFirst} />
        <View style={styles.list}>
          {SERVICES.map(s => {
            const on = s.id === service;
            return (
              <Pressable
                key={s.id}
                onPress={() => setService(s.id)}
                style={[styles.service, on && styles.serviceOn]}>
                <View style={[styles.radio, on && styles.radioOn]}>
                  {on ? <View style={styles.radioDot} /> : null}
                </View>
                <View style={styles.serviceText}>
                  <Text style={styles.serviceName}>{s.name}</Text>
                  <Text style={styles.serviceSub}>{s.sub}</Text>
                </View>
                <View style={styles.pill}>
                  <Text style={styles.pillText}>{s.commission}% Commission</Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        <SectionLabel title="PREFERRED TIMINGS" style={styles.section} />
        <View style={styles.timeGrid}>
          {TIMINGS.map(t => {
            const on = timings.includes(t.id);
            return (
              <Pressable
                key={t.id}
                onPress={() => toggleTiming(t.id)}
                style={[styles.time, on && styles.timeOn]}>
                <Text style={[styles.timeName, on && styles.timeNameOn]}>
                  {t.name}
                </Text>
                <Text style={[styles.timeRange, on && styles.timeRangeOn]}>
                  {t.range}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <SectionLabel title="PREFERRED OPERATING ZONE" style={styles.section} />
        <DriverTextField
          label="Operating Region"
          labelColor={colors.placeholder}
          darkBorder
          placeholder="Enter your operating region"
          value={region}
          onChangeText={setRegion}
          containerStyle={styles.region}
        />

        <View style={styles.note}>
          <MdiIcon
            path={MDI_DOCS.informationOutline}
            size={18}
            color={colors.placeholder}
          />
          <Text style={styles.noteText}>
            You can update your availability anytime from your profile settings.
          </Text>
        </View>
      </KeyboardAwareScrollView>

      <BottomBar>
        <ActionButton
          title="Continue"
          onPress={onContinue}
          icon={<ArrowRightIcon size={18} color="#FFFFFF" />}
        />
      </BottomBar>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },
  sectionFirst: {
    marginTop: 22,
    marginBottom: 12,
  },
  section: {
    marginTop: 24,
    marginBottom: 12,
  },
  list: {
    gap: 12,
  },
  service: {
    height: 66,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: UNSELECTED_BORDER,
    backgroundColor: colors.background,
  },
  serviceOn: {
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: colors.placeholder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: {
    borderColor: colors.primary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  serviceText: {
    flex: 1,
    marginLeft: 14,
  },
  serviceName: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    lineHeight: 21,
    color: colors.textDark,
  },
  serviceSub: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: colors.textSecondary,
  },
  pill: {
    height: 24,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: colors.pinkSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillText: {
    fontFamily: fonts.semiBold,
    fontSize: 11,
    color: colors.primary,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  time: {
    width: '47.8%',
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: UNSELECTED_BORDER,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeOn: {
    borderColor: colors.primary,
  },
  timeName: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    lineHeight: 19,
    color: colors.textDark,
  },
  timeNameOn: {
    color: colors.primary,
  },
  timeRange: {
    fontFamily: fonts.regular,
    fontSize: 11,
    lineHeight: 15,
    color: colors.textSecondary,
  },
  timeRangeOn: {
    color: colors.primary,
  },
  region: {
    marginBottom: 16,
  },
  note: {
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.textDark,
    backgroundColor: colors.background,
  },
  noteText: {
    flex: 1,
    marginLeft: 10,
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 17,
    color: colors.placeholder,
  },
});
import React, {useState} from 'react';
import {Pressable, ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import MdiIcon from '@/components/common/MdiIcon';
import ActionButton from '@/components/registration/ActionButton';
import BottomBar from '@/components/registration/BottomBar';
import DriverHeader from '@/components/driver/DriverHeader';
import {DriverSelectField} from '@/components/driver/DriverFields';
import DriverStepTitle from '@/components/driver/DriverStepTitle';
import SectionLabel from '@/components/driver/SectionLabel';
import {colors} from '@/constants/colors';
import {MDI} from '@/constants/iconPaths';
import {fonts} from '@/constants/typography';
import type {RootStackParamList} from '@/navigation/types';
import {setDriverProfile, useDriverProfile} from '@/state/driverProfileStore';

type Props = NativeStackScreenProps<RootStackParamList, 'DriverExperience'>;

// TODO: load these lists from your API
const EXPERIENCE = ['Less than 1 yr', '1-3 yrs', '3-5 yrs', '5-10 yrs', '10+ yrs'];
const LICENSES = [
  'LMV (Light Motor Vehicle)',
  'HMV (Heavy Motor Vehicle)',
  'LMV + HMV',
  'Commercial (Taxi) Badge',
];
const VEHICLE_TYPES = [
  {id: 'sedan', name: 'Sedan'},
  {id: 'suv', name: 'SUV'},
  {id: 'hatchback', name: 'Hatchback'},
  {id: 'luxury', name: 'Luxury'},
];
const TRANSMISSIONS = [
  {id: 'manual', name: 'Manual'},
  {id: 'automatic', name: 'Automatic'},
];

function toggle(list: string[], id: string) {
  return list.includes(id) ? list.filter(x => x !== id) : [...list, id];
}

export default function DriverExperienceScreen({navigation, route}: Props) {
  const saved = useDriverProfile();
  const [experience, setExperience] = useState<string | undefined>(saved.experience);
  const [license, setLicense] = useState<string | undefined>(saved.license);
  const [vehicles, setVehicles] = useState<string[]>(saved.vehicles);
  const [transmission, setTransmission] = useState<string[]>(saved.transmission);

  const onContinue = () => {
    // TODO: validate, then also save with the API
    setDriverProfile({experience, license, vehicles, transmission});
    if (route.params?.fromReview) {
      navigation.goBack();
    } else {
      navigation.navigate('DriverAvailability');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <DriverHeader title="Driving Experience" onBack={() => navigation.goBack()} />

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <DriverStepTitle title="Driving Experience" step={2} />

        <View style={styles.form}>
          <DriverSelectField
            label="Total Driving Experience"
            placeholder="Select experience"
            value={experience}
            options={EXPERIENCE}
            onChange={setExperience}
          />
          <DriverSelectField
            label="License Type"
            placeholder="Select license type"
            value={license}
            options={LICENSES}
            onChange={setLicense}
          />
        </View>

        <SectionLabel title="VEHICLE TYPES YOU CAN DRIVE" style={styles.sectionTop} />
        <View style={styles.grid}>
          {VEHICLE_TYPES.map(v => {
            const on = vehicles.includes(v.id);
            return (
              <Pressable
                key={v.id}
                onPress={() => setVehicles(prev => toggle(prev, v.id))}
                style={[styles.vehicle, on && styles.vehicleOn]}>
                {on ? (
                  <View style={styles.checkOn}>
                    <MdiIcon path={MDI.check} size={13} color="#FFFFFF" />
                  </View>
                ) : (
                  <View style={styles.checkOff} />
                )}
                <View style={styles.vehicleText}>
                  <Text style={styles.vehicleName}>{v.name}</Text>
                  <Text style={styles.vehicleSub}>{on ? 'Selected' : 'Available'}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        <SectionLabel title="TRANSMISSION PREFERENCES" style={styles.sectionTop} />
        <View style={styles.transRow}>
          {TRANSMISSIONS.map(t => {
            const on = transmission.includes(t.id);
            return (
              <Pressable
                key={t.id}
                onPress={() => setTransmission(prev => toggle(prev, t.id))}
                style={[styles.trans, on && styles.transOn]}>
                <Text style={[styles.transText, on && styles.transTextOn]}>
                  {t.name}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <BottomBar>
        <ActionButton title="Continue" onPress={onContinue} />
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
    paddingTop: 16,
    paddingBottom: 24,
  },
  form: {
    marginTop: 24,
  },
  sectionTop: {
    marginTop: 8,
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  vehicle: {
    width: '47.8%',
    height: 68,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  vehicleOn: {
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  checkOn: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkOff: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  vehicleText: {
    marginLeft: 12,
  },
  vehicleName: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    lineHeight: 20,
    color: colors.textDark,
  },
  vehicleSub: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: colors.textSecondary,
  },
  transRow: {
    flexDirection: 'row',
    gap: 12,
  },
  trans: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transOn: {
    borderColor: colors.primary,
    backgroundColor: colors.pinkSoft,
  },
  transText: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.textDark,
  },
  transTextOn: {
    color: colors.primary,
  },
});
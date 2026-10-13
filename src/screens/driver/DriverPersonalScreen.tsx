import React, {useState} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import ActionButton from '@/components/registration/ActionButton';
import BottomBar from '@/components/registration/BottomBar';
import DriverHeader from '@/components/driver/DriverHeader';
import {DriverTextField} from '@/components/driver/DriverFields';
import DriverStepTitle from '@/components/driver/DriverStepTitle';
import {colors} from '@/constants/colors';
import {setDriverProfile, useDriverProfile} from '@/state/driverProfileStore';
import type {RootStackParamList} from '@/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'DriverPersonal'>;

export default function DriverPersonalScreen({navigation, route}: Props) {
  const saved = useDriverProfile();
  const [name, setName] = useState(saved.name);
  const [email, setEmail] = useState(saved.email);
  const [phone, setPhone] = useState(saved.phone); // 10 digits only
  const [city, setCity] = useState(saved.city);
  const [address, setAddress] = useState(saved.address);

  const onContinue = () => {
    // TODO: validate the other fields, then also save with your API
    setDriverProfile({name, email, phone, city, address});
    if (route.params?.fromReview) {
      navigation.goBack(); // came from Review: return there
    } else {
      navigation.navigate('DriverExperience');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <DriverHeader title="Personal Details" onBack={() => navigation.goBack()} />

      <KeyboardAwareScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        enableOnAndroid
        extraScrollHeight={24}
        enableResetScrollToCoords={false}>
        <DriverStepTitle title="Personal Details" step={1} />

        <View style={styles.form}>
          <DriverTextField
            label="Full Legal Name"
            placeholder="As it appears on your license"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
          <DriverTextField
            label="Email Address"
            placeholder="driver@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <DriverTextField
            label="Mobile Number"
            placeholder="10-digit mobile number"
            value={phone}
            onChangeText={t => setPhone(t.replace(/\D/g, '').slice(0, 10))}
            keyboardType="phone-pad"
            maxLength={10}
          />
          <DriverTextField
            label="Current City"
            placeholder="e.g. New Delhi"
            value={city}
            onChangeText={setCity}
            autoCapitalize="words"
          />
          <DriverTextField
            label="Address"
            placeholder="Enter your full address"
            value={address}
            onChangeText={setAddress}
          />
        </View>
      </KeyboardAwareScrollView>

      <BottomBar>
        <ActionButton
          title="Continue"
          disabled={phone.length !== 10}
          onPress={onContinue}
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
    paddingTop: 16,
    paddingBottom: 24,
  },
  form: {
    marginTop: 22,
  },
});
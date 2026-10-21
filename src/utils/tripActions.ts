import {Alert, Linking} from 'react-native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {strings} from '@/localization';
import type {RootStackParamList} from '@/navigation/types';
import {clearTrip, type Trip} from '@/state/tripStore';

type Nav = NativeStackNavigationProp<RootStackParamList>;

// Trip is over (completed, cancelled or refused): back to Home, with the
// rest of the trip screens removed from the history.
export function finishTrip(navigation: Nav, online: boolean) {
  clearTrip();
  navigation.reset({
    index: 0,
    routes: [{name: 'Home', params: {screen: 'HomeTab', params: {online}}}],
  });
}

// Checks that run between "Start Trip" and the ride itself.
// Two-wheeler: helmet check. Pink Scooty: identity check as well.
export function nextStartStep(
  trip: Trip,
  after: 'arrived' | 'helmet',
): 'HelmetCheck' | 'RiderIdentityCheck' | 'ActiveTrip' {
  if (after === 'arrived' && trip.needsHelmetCheck) {
    return 'HelmetCheck';
  }
  if (trip.needsIdentityCheck) {
    return 'RiderIdentityCheck';
  }
  return 'ActiveTrip';
}

// TODO: route calls through your masked-number / VoIP provider.
export function callRider(phone: string) {
  Linking.openURL(`tel:${phone}`).catch(() => {});
}

// TODO: open the in-app chat screen once Module 11 (Communication) is built.
export function chatWithRider(phone: string) {
  Linking.openURL(`sms:${phone}`).catch(() => {});
}

// TODO: open the SOS screen once Module 10 (Safety & Support) is built.
export function confirmSos() {
  Alert.alert(strings.trip.sosTitle, strings.trip.sosBody, [
    {text: strings.trip.back, style: 'cancel'},
    {
      text: strings.trip.sosCall,
      style: 'destructive',
      onPress: () => {
        Linking.openURL('tel:112').catch(() => {});
      },
    },
  ]);
}

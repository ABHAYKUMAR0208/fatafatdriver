import {PermissionsAndroid, Platform} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

async function ensureCameraPermission() {
  if (Platform.OS !== 'android') {
    return true; // iOS asks by itself (needs NSCameraUsageDescription)
  }
  const result = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.CAMERA,
  );
  return result === PermissionsAndroid.RESULTS.GRANTED;
}

// Opens the back camera and returns the photo's uri (undefined if cancelled / denied).
export async function capturePhoto(): Promise<string | undefined> {
  if (!(await ensureCameraPermission())) {
    return undefined;
  }
  const result = await launchCamera({mediaType: 'photo', quality: 0.7});
  return result.assets?.[0]?.uri;
}

export async function pickImage(): Promise<string | undefined> {
  const result = await launchImageLibrary({
    mediaType: 'photo',
    selectionLimit: 1,
    quality: 0.8,
  });
  return result.assets?.[0]?.uri;
}

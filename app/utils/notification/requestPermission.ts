import { Platform, PermissionsAndroid } from 'react-native';

export const requestAndroidNotificationPermission = async () => {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
};
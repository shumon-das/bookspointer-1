import messaging from '@react-native-firebase/messaging';

export const fetchFcmPushToken =async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    return await messaging().getToken();
  }

  return null;
}
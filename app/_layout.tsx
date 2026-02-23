import 'react-native-reanimated';
import messaging from '@react-native-firebase/messaging';
import { 
  getMessaging, 
  getToken, 
  requestPermission, 
  onMessage, 
  onNotificationOpenedApp, 
  getInitialNotification, 
  setBackgroundMessageHandler,
  AuthorizationStatus 
} from '@react-native-firebase/messaging';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { KeyboardProvider } from "react-native-keyboard-controller";
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { initTables } from './utils/database/initTables';
import { initSecretKey } from '@/helper/initSecurity';
import { pingServer } from '@/services/pingServer';
import { Alert, AppState } from 'react-native';
import { useMercureStore } from './store/mercureStore';
import { fetchFcmPushToken } from './utils/notifications';
import { saveToken } from '@/services/notificationApi';
import { handleNotificationNavigation } from './utils/notification/notificationHandler';

const messagingInstance = getMessaging();

setBackgroundMessageHandler(messagingInstance, async (remoteMessage) => {
  console.log('Message handled in the background!', remoteMessage);
});

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    initTables()
    initSecretKey()
  }, []);

  useEffect(() => {
    
    // 1. Request Permission & Get Token
    const setupNotifications = async () => {
      const authStatus = await requestPermission(messagingInstance);
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        const token = await messaging().getToken();
        await saveToken(token, 1); 
        console.log('Saved FCM Token:', token);
      }
    };

    setupNotifications();

    // 2. Handle Foreground Messages (App is OPEN)
    const unsubscribeOnMessage = onMessage(messagingInstance, async (remoteMessage) => {
      Alert.alert(
        remoteMessage.notification?.title || 'New Message',
        remoteMessage.notification?.body || ''
      );
    });

    // 3. Handle Notification Tap (App was in BACKGROUND)
    const unsubscribeOnNotificationOpened = onNotificationOpenedApp(messagingInstance, (remoteMessage) => {
      console.log('Notification tapped:', remoteMessage.data);
      // handleNavigation(remoteMessage.data);
    });

    // 4. Handle Cold Start (App was CLOSED/KILLED)
    getInitialNotification(messagingInstance).then((remoteMessage) => {
      if (remoteMessage) {
        console.log('App opened from quit state:', remoteMessage.data);
      }
    });

    return () => {
      unsubscribeOnMessage();
      unsubscribeOnNotificationOpened();
    };
  }, []);
  /*** end notification ***/


  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        console.log('App has come to the foreground! Connecting Mercure...');
        useMercureStore.getState().setupMercureHub();
      } else {
        console.log('App is in background. Closing Mercure...');
        useMercureStore.getState().closeMercureHub();
      }
    });

    // Initial setup
    useMercureStore.getState().setupMercureHub();

    return () => {
      subscription.remove();
      useMercureStore.getState().closeMercureHub();
    };
  }, []);

  useEffect(() => {
    pingServer();
    const intervalId = setInterval(() => {
        pingServer();
    }, 45000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <KeyboardProvider>
      <ThemeProvider value={DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </KeyboardProvider>
  );
}

import 'react-native-reanimated';
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
import { useEffect } from 'react';
import { initTables } from './utils/database/initTables';
import { initSecretKey } from '@/helper/initSecurity';
import { pingServer } from '@/services/pingServer';
import { AppState } from 'react-native';
import { useMercureStore } from './store/mercureStore';
import { saveToken } from '@/services/notificationApi';
import { handleNotificationNavigation } from './utils/notification/notificationHandler';
import { getApp } from '@react-native-firebase/app';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { requestAndroidNotificationPermission } from './utils/notification/requestPermission';
import * as Linking from 'expo-linking';
import { handleDeepLinking } from './utils/notification/deepLinkingHandler';

const messagingInstance = getMessaging();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,   // no popup banner
    shouldShowList: true,      // keep in notification tray
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

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
    async function setupChannel() {
      await Notifications.setNotificationChannelAsync(
        'high_importance_channel_v2',
        {
          name: 'High Importance',
          importance: Notifications.AndroidImportance.MAX,
          sound: 'default',
          vibrationPattern: [0, 250, 250, 250],
          lockscreenVisibility:
            Notifications.AndroidNotificationVisibility.PUBLIC,
        }
      );
    }

    setupChannel();
  }, []);

  useEffect(() => {
    
    // 1. Request Permission & Get Token
    const setupNotifications = async () => {
      const hasPermission = await requestAndroidNotificationPermission();
      if (!hasPermission) {
        console.log("Notification permission denied");
        return;
      }

      const app = getApp();
      const messaging = getMessaging(app);
      const authStatus = await requestPermission(messaging);
      const enabled = authStatus === AuthorizationStatus.AUTHORIZED || authStatus === AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        const storageUser = await AsyncStorage.getItem('auth-user');
        const user = storageUser ? JSON.parse(storageUser) : null;
        const token = await getToken(messaging);
        
        await saveToken(token, user ? user.id : 1); 
        console.log('Saved FCM Token:', token);
      }
    };

    setupNotifications();

    // 2. Handle Foreground Messages (App is OPEN)
    const unsubscribeOnMessage = onMessage(messagingInstance, async (remoteMessage) => {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: remoteMessage.notification?.title ?? '',
          body: remoteMessage.notification?.body ?? '',
          data: remoteMessage.data,
          sound: 'default',
        },
        trigger: null,
      });
    });

    // 3. Handle Notification Tap (App was in BACKGROUND)
    const unsubscribeOnNotificationOpened = onNotificationOpenedApp(messagingInstance, async (remoteMessage) => {
      console.log('Notification tapped:', remoteMessage.data);
      
      handleNotificationNavigation(remoteMessage.data, router);
    });

    // 4. Handle Cold Start (App was CLOSED/KILLED)
    getInitialNotification(messagingInstance).then((remoteMessage) => {
      if (remoteMessage) {
        handleNotificationNavigation(remoteMessage.data, router);
      }
    });

    return () => {
      unsubscribeOnMessage();
      unsubscribeOnNotificationOpened();
    };
  }, []);

  // 5. Handle Notification Tap (App was in FOREGROUND)
  useEffect(() => {
    const subscription =
      Notifications.addNotificationResponseReceivedListener(response => {
        const data = response.notification.request.content.data;

        handleNotificationNavigation(data, router);
      });

    return () => subscription.remove();
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

  useEffect(() => {
    const subscription = Linking.addEventListener('url', (event) => {
      const { path, queryParams } = Linking.parse(event.url);
      handleDeepLinking(path as string, queryParams as any, router);
    });

    return () => subscription.remove();
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

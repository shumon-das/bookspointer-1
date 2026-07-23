import 'react-native-reanimated';
import { 
  getMessaging, 
  getToken, 
  requestPermission, 
  onMessage, 
  onNotificationOpenedApp, 
  getInitialNotification, 
  onTokenRefresh,
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
import * as Notifications from 'expo-notifications';
import { requestAndroidNotificationPermission } from './utils/notification/requestPermission';
import * as Linking from 'expo-linking';
import { handleDeepLinking } from './utils/notification/deepLinkingHandler';
import { useUserStore } from './store/userStore';
import { useSystemStore } from './store/systemStore';

const messagingInstance = getMessaging();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,   // no popup banner
    shouldShowList: true,      // keep in notification tray
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

setBackgroundMessageHandler(messagingInstance, async (remoteMessage: any) => {
  console.log('Message handled in the background!', remoteMessage);
});

export default function RootLayout() {
  const router = useRouter();
  const authUser = useUserStore((state) => state.authUser);
  useSystemStore((state) => state.lang);

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
    // A token must be registered after authentication. On a fresh install the
    // auth store is restored asynchronously, so registering on mount could
    // associate the device with the wrong user (or user id 1).
    if (!authUser?.id) return;

    let active = true;
    const registerToken = async (token?: string) => {
      if (!active) return;
      try {
        const hasPermission = await requestAndroidNotificationPermission();
        if (!hasPermission) return;

        const authStatus = await requestPermission(messagingInstance);
        const enabled = authStatus === AuthorizationStatus.AUTHORIZED || authStatus === AuthorizationStatus.PROVISIONAL;
        if (!enabled) return;

        const currentToken = token ?? await getToken(messagingInstance);
        if (currentToken) await saveToken(currentToken, authUser.id);
      } catch (error) {
        console.error('Push notification setup failed:', error);
      }
    };

    registerToken();
    const unsubscribeTokenRefresh = onTokenRefresh(messagingInstance, (token) => registerToken(token));

    // 2. Handle Foreground Messages (App is OPEN)
    const unsubscribeOnMessage = onMessage(messagingInstance, async (remoteMessage: any) => {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: remoteMessage.notification?.title ?? '',
          body: remoteMessage.notification?.body ?? '',
          data: remoteMessage.data,
          channelId: 'high_importance_channel_v2',
          sound: 'default',
        },
        trigger: null,
      });
    });

    // 3. Handle Notification Tap (App was in BACKGROUND)
    const unsubscribeOnNotificationOpened = onNotificationOpenedApp(messagingInstance, async (remoteMessage: any) => {
      console.log('Notification tapped:', remoteMessage.data);
      
      handleNotificationNavigation(remoteMessage.data, router);
    });

    // 4. Handle Cold Start (App was CLOSED/KILLED)
    getInitialNotification(messagingInstance).then((remoteMessage: any) => {
      if (remoteMessage) {
        handleNotificationNavigation(remoteMessage.data, router);
      }
    });

    return () => {
      active = false;
      unsubscribeTokenRefresh();
      unsubscribeOnMessage();
      unsubscribeOnNotificationOpened();
    };
  }, [authUser?.id]);

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

  useEffect(() => {
    useUserStore.getState().fetchAuthUserFromDb();
  }, [])

  return (
    <KeyboardProvider>
      <ThemeProvider value={DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar hidden />
      </ThemeProvider>
    </KeyboardProvider>
  );
}

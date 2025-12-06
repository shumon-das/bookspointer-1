import 'react-native-reanimated';
import * as Notifications from 'expo-notifications';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { KeyboardProvider } from "react-native-keyboard-controller";
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
  const subscription = Notifications.addNotificationResponseReceivedListener(
      response => {
        const data = response.notification.request.content.data;
        console.log("Notification pressed!", data);

        if (data?.screenname === "notifications") {
          router.push({
            pathname: "/screens/notifications", 
            params: { data: JSON.stringify(data)}
          });
        }

        if (data?.screenname === "book") {
          router.push({
            pathname: `/screens/book/details`, 
            params: { data: JSON.stringify(data) } 
          });
        } else {
          const responseData = response.notification.request.content.data as any;
          router.push({
            pathname: responseData.absolutePath.pathname, 
            params: { [responseData.absolutePath.key]: JSON.stringify(responseData.absolutePath.value) } 
          });
        }
      }
    );

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

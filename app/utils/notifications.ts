// import * as Device from 'expo-device';
// import * as Notifications from 'expo-notifications';
// import { Platform } from 'react-native';

// export async function registerForPushNotificationsAsync() {
//   let token;
  
//   if (Device.isDevice) {
//     const { status: existingStatus } = await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;
    
//     if (existingStatus !== 'granted') {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }
    
//     if (finalStatus !== 'granted') {
//       alert('Failed to get push token for push notification!');
//       return null;
//     }
    
//     try {
//       const tokenData = await Notifications.getExpoPushTokenAsync();
//       const token = tokenData.data;
    
//       return token;
//     } catch (error) {
//       console.error('🚨 Error getting push token:', error);
//     }
//   } else {
//     // alert('Must use physical device for Push Notifications');
//     console.log('Must use physical device for Push Notifications');
//   }

//   if (Platform.OS === 'android') {
//     Notifications.setNotificationChannelAsync('default', {
//       name: 'default',
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: '#FF231F7C',
//     });
//   }

//   return token;
// }

// export default registerForPushNotificationsAsync;

import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import API_CONFIG from './config';

export async function registerForPushNotificationsAsync() {
  // Initialize token outside of conditional blocks
  let token = null; 

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification! Status:' + finalStatus);
      /** this function created for testing perpose */
      const endpoint = API_CONFIG.BASE_URL + '/test/save-to-dictionary';
      const response = await fetch(endpoint, {
          method: 'POST',
          headers: API_CONFIG.HEADERS,
          body: JSON.stringify({'index screen: ': 'Failed to get push token for push notification! Status:' + finalStatus})
      })
      return null;
    }

    try {
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: '5a76b2dc-30dc-4701-a88c-d837cf10eed1'
      });
      
      // FIX: Assign to the outer 'token' variable
      token = tokenData.data; 

    } catch (error) {
      console.error('🚨 Error getting push token:', error);
      /** this function created for testing perpose */
      const endpoint = API_CONFIG.BASE_URL + '/test/save-to-dictionary';
      const response = await fetch(endpoint, {
          method: 'POST',
          headers: API_CONFIG.HEADERS,
          body: JSON.stringify({'index screen: ': '🚨 Error getting push token:', error})
      })
      return null; // Return null on error
    }
  } else {
    console.log('⚠️ Must use a physical device or a properly configured emulator/simulator for Push Notifications.');
    /** this function created for testing perpose */
      const endpoint = API_CONFIG.BASE_URL + '/test/save-to-dictionary';
      const response = await fetch(endpoint, {
          method: 'POST',
          headers: API_CONFIG.HEADERS,
          body: JSON.stringify({'index screen: ': '⚠️ Must use a physical device or a properly configured emulator/simulator for Push Notifications.'})
      })
    // Optional: You might want to return a dummy token for development/testing
    // token = 'DEV_SIMULATOR_TOKEN'; 
  }

  // Android Channel setup (Only runs if on Android device/emulator)
  if (Platform.OS === 'android' && token) {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  /** this function created for testing perpose */
  const endpoint = API_CONFIG.BASE_URL + '/test/save-to-dictionary';
  const response = await fetch(endpoint, {
      method: 'POST',
      headers: API_CONFIG.HEADERS,
      body: JSON.stringify({'index screen: ': 'return token: ' + token})
  })
  // Return the token (which is null if permissions failed or on a non-device)
  return token;
}
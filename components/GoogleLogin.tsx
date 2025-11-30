import React, { useEffect } from 'react';
import { Button, View, Text } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants'; // To access extra config from app.json

// This is important for handling redirects on web platforms
WebBrowser.maybeCompleteAuthSession();

export default function GoogleLogin() {
  // Retrieve client IDs from app.json extra field (use optional chaining to avoid runtime errors in strict mode)
  const webClientId = Constants.expoConfig?.extra?.googleClientId?.web;
  const androidClientId = Constants.expoConfig?.extra?.googleClientId?.android;

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: androidClientId,
    webClientId: webClientId,
    // Add other client IDs if you have them for iOS, etc.
    // iosClientId: 'YOUR_IOS_CLIENT_ID',
    scopes: ['profile', 'email'], // Request necessary scopes
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      console.log('Authentication successful:', authentication);
      // You can now use authentication.accessToken to fetch user info from Google APIs
      // For example: fetch('https://www.googleapis.com/userinfo/v2/me', {
      //   headers: { Authorization: `Bearer ${authentication.accessToken}` },
      // }).then(res => res.json()).then(console.log);
      alert('Signed in successfully!');
    } else if (response?.type === 'error') {
      console.error('Authentication error:', response.error);
      alert(`Sign-in failed: ${response?.error?.message}`);
    }
  }, [response]);

  return (
    // <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    //   <Text>Google Sign-In Example</Text>
      <Button
        title="Sign in with Google"
        disabled={!request} // Button is disabled until the request object is ready
        onPress={() => {
          promptAsync(); // This initiates the OAuth flow
        }}
      />
    // </View>
  );
}

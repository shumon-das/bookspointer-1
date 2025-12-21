import { useAuthStore } from '@/app/store/auth';
import labels from '@/app/utils/labels';
import goToProfile from '@/helper/redirectToProfile';
import { googleSignin } from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin, isErrorWithCode, statusCodes } from '@react-native-google-signin/google-signin';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, View, Text, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from 'react-native';

GoogleSignin.configure({
  webClientId: "995445721362-vs6lio6ova5qedcotndpik6c6olg4ohp.apps.googleusercontent.com",
  offlineAccess: true,
});

const GoogleLogin = () => {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    if (loading) return; // prevent double press
    setLoading(true);

    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const response = await GoogleSignin.signIn();

      const idToken = response?.data?.idToken;
      if (!idToken) {
        Alert.alert("Google Sign-In failed", "No ID token received");
        return;
      }

      const loginResponse = await googleSignin(idToken);

      if (!loginResponse) {
        Alert.alert("Login failed");
        return;
      }

      await AsyncStorage.setItem("auth-user", JSON.stringify(loginResponse.user));
      await AsyncStorage.setItem("auth-token", loginResponse.token);

      useAuthStore.getState().setAuthenticatedUser(loginResponse.user);
      await GoogleSignin.signOut();
      goToProfile(router, useAuthStore);

    } catch (error: any) {
      console.log("Google Sign-In error", error);

      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            Alert.alert(`Sign-in already in progress: ${JSON.stringify(error, null, 2)}`);
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            Alert.alert(`Google Play Services not available: ${JSON.stringify(error, null, 2)}`);
            break;
          default:
            Alert.alert(`Google Sign-In failed: ${JSON.stringify(error, null, 2)}`);
        }
      } else {
        Alert.alert(`Unexpected error occurred: ${JSON.stringify(error, null, 2)}`);
      }
    } finally {
      setLoading(false);
    }
  }

  return (<View>
    <View style={{ width: '80%', margin: 'auto'}}>
      <Text style={{textAlign: 'center', paddingVertical: 10}}>{labels.or}</Text>
      {loading 
        ? (<TouchableOpacity style={styles.button}>
              <ActivityIndicator></ActivityIndicator>
              <Text style={{color: 'white', marginLeft: 10}}>{labels.signInLoading}</Text>
            </TouchableOpacity>
        ) : (<TouchableOpacity onPress={handleGoogleSignIn} style={styles.button}>
              <Image source={require('../assets/logo/sign_in_with_google.png')} style={styles.image} />
              <Text style={{color: 'white'}}>{labels.signInWithGoogle}</Text>
            </TouchableOpacity>
        )
        }
    </View>
    
  </View>)
}

export default GoogleLogin

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#085a80', 
    flexDirection: 'row', 
    paddingVertical: 10,
    borderRadius: 50,
    justifyContent: 'center'
  },
  image: {
    width: 20, 
    height: 20, 
    borderRadius: 20, 
    marginHorizontal: 10
  }
})
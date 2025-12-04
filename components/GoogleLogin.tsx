import { useAuthStore } from '@/app/store/auth';
import labels from '@/app/utils/labels';
import goToProfile from '@/helper/redirectToProfile';
import { googleSignin } from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin, isErrorWithCode, isSuccessResponse, statusCodes } from '@react-native-google-signin/google-signin';
import { router } from 'expo-router';
import { Alert, View, Text, TouchableOpacity, Image } from 'react-native';

GoogleSignin.configure({
  webClientId: "995445721362-vs6lio6ova5qedcotndpik6c6olg4ohp.apps.googleusercontent.com",
});

const GoogleLogin = () => {
  const handleGoogleSignIn = async () => {
    GoogleSignin.signOut(); // Ensure previous sessions are cleared
    try {
      await GoogleSignin.hasPlayServices()
      const response = await GoogleSignin.signIn();

      if (isSuccessResponse(response)) {
        if (response.data.idToken) {
          const loginResponse: {token: string; user: any} = await googleSignin(response.data.idToken)
          if (loginResponse) {
              await AsyncStorage.setItem("auth-user", JSON.stringify(loginResponse.user))
              await AsyncStorage.setItem("auth-token", loginResponse.token)
              useAuthStore.getState().setAuthenticatedUser(loginResponse.user)
              goToProfile(router, useAuthStore)
          } else {
              GoogleSignin.signOut();
              alert("login failed, unauthorized Google Sign-In attempt")
          }
        } else {
            GoogleSignin.signOut();
            alert("IdToken not found in Google Sign-In response")
        }
      } else {
        console.log("sign in was cancelled by user")
      }
      
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            Alert.alert("operation (eg. sign in) already in progress")
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            Alert.alert("Android only, play services not available or outdated")
            break;
          default:
            Alert.alert("other error happened")
        }
      } else {
        Alert.alert(JSON.stringify(error))
      }
    }
  }

  return (<View>
    <View style={{ width: '80%', margin: 'auto'}}>
      <Text style={{textAlign: 'center', paddingVertical: 10}}>{labels.or}</Text>
      <TouchableOpacity 
        onPress={handleGoogleSignIn} 
        style={{
          backgroundColor: '#085a80', 
          flexDirection: 'row', 
          paddingVertical: 10,
          borderRadius: 50,
          justifyContent: 'center'
        }}
      >
        <Image 
          source={require('../assets/logo/sign_in_with_google.png')} 
          style={{width: 20, height: 20, borderRadius: 20, marginHorizontal: 10}} 
        />
        <Text style={{color: 'white'}}>{labels.signInWithGoogle}</Text>
      </TouchableOpacity>
    </View>
    
  </View>)
}

export default GoogleLogin
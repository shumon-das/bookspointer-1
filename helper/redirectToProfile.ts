import AsyncStorage from "@react-native-async-storage/async-storage"

const goToProfile = async (router: any, authStore: any) => {
    const storageUser = await AsyncStorage.getItem('auth-user')
    if (!storageUser) {
      router.push('/auth/login')
      return
    }
    authStore.getState().setUser(JSON.parse(storageUser))
    router.push('/screens/user/user-profile');
}

export default goToProfile;
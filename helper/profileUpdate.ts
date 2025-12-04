import { useAuthStore } from "@/app/store/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export const logout = async (router:any) => {
    await GoogleSignin.signOut();
    await AsyncStorage.multiRemove(['auth-user', 'auth-token']);
    useAuthStore.getState().setAuthenticatedUser(null);
    router.replace("/");
}

export default {
    logout
}
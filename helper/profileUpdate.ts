import { useAuthStore } from "@/app/store/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const logout = async (router:any) => {
    await AsyncStorage.multiRemove(['auth-user', 'auth-token']);
    useAuthStore.getState().setAuthenticatedUser(null);
    router.replace("/");
}

export default {
    logout
}
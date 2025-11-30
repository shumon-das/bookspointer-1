import { useAuthStore } from "@/app/store/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export const logout = async () => {
    const router = useRouter();
    await AsyncStorage.multiRemove(['auth-user', 'auth-token']);
    useAuthStore.getState().setAuthenticatedUser(null);
    useAuthStore.getState().setUser(null);
    router.replace("/");
}


export default {
    logout
}
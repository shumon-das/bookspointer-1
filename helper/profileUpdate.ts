import useAuthStore from "@/app/store/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export const logout = async () => {
    const router = useRouter();
    await AsyncStorage.multiRemove(['auth-user', 'auth-token']);
    useAuthStore.getState().setUser(null);
    router.push("/");
}


export default {
    logout
}
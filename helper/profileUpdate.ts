import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserStore } from "@/app/store/userStore";

export const logout = async (router:any) => {
    await AsyncStorage.multiRemove(['auth-user', 'auth-token']);
    useUserStore.getState().resetAuthUser();
    router.replace("/");
}

export default {
    logout
}
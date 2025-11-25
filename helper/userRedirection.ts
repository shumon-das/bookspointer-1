import { fetchUserProfileData } from "@/services/profileApi";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const redirectToUserProfile = async (uuid: string, router: any, authStore: any) => {
    const { user, setUser } = authStore;
    if (user && user.uuid === uuid) {
        router.push('/screens/user/userProfile');
        return;
    }
    const data = await fetchUserProfileData(uuid);
    setUser(data as any)
    router.push('/screens/user/userProfile');
}

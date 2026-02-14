import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAnonymousId } from "../annonymous";
import API_CONFIG from "../config";

export const percentage = (active_page: number, total_pages: number) => {
   const percent = (active_page / total_pages) * 100;
   return Math.floor(percent);
}

export const fetchActivities = async () => {
    const anonymous = getAnonymousId();
    const token = await AsyncStorage.getItem('auth-token');
    if (!token) return;

    const response = await fetch(`${API_CONFIG.BASE_URL}/admin/activities/${anonymous}`, {
        method: 'GET',
        headers: { "Authorization": `Bearer ${token}`},
    }) as any

    const data = await response.json();

    return data;
}
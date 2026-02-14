import AsyncStorage from '@react-native-async-storage/async-storage';
import API_CONFIG from '@/app/utils/config';

export const pingServer = async () => {
    const token = await AsyncStorage.getItem('auth-token');
    const storageUser = await AsyncStorage.getItem('auth-user');
    const user = storageUser ? JSON.parse(storageUser) : null;
    if (!token || !user) {
        return;
    }

    try {
        await fetch(`${API_CONFIG.BASE_URL}/admin/user/ping`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` }
        });
        // console.log("Global Ping Sent");
    } catch (e) {
        console.error("Ping Error:", e);
    }

}
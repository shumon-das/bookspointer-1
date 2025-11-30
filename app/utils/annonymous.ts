import AsyncStorage from "@react-native-async-storage/async-storage";
import API_CONFIG from "./config";
import * as Crypto from 'expo-crypto';

export async function getAnonymousId() {
    // prefer localStorage; fallback to cookie
    let id = await AsyncStorage.getItem('bp_anon_id');
    if (!id) {
        id = cryptoRandomUuid();
        await AsyncStorage.setItem('bp_anon_id', id);
    }
    return id;
}


export async function getStorageUser() {
    const storageUser = await AsyncStorage.getItem('auth-user');
    return storageUser ? JSON.parse(storageUser) : null;
}

function cryptoRandomUuid() {
    return Crypto.randomUUID();
}


export async function sendActivity({type, targetId = null, details = null}: { type: string; targetId?: number | string | null; details?: any | null }) {
    const anonymousId = await getAnonymousId();
    const storageUser = await AsyncStorage.getItem('auth-user');
    const userId = storageUser ? JSON.parse(storageUser).id : null;
    const payload = { 
        type, 
        target_id: targetId, 
        details, 
        anonymous_user_id: anonymousId, 
        userId: userId 
    };
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/activity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    const data = await response.json()
    return data;
}

export default {getAnonymousId, getStorageUser, sendActivity}
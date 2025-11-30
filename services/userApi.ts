import { useAuthStore } from "@/app/store/auth";
import { API_CONFIG } from "@/app/utils/config";
import labels from "@/app/utils/labels";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

export const getAuthor = async (uuid: string) => {
    const endpoint = `${API_CONFIG.BASE_URL}/single-user/${uuid}`;
    const response = await fetch(endpoint);
    if (!response.ok) {
        // @ts-ignore
        throw new Error('Failed to fetch author', response.message);
    }
    const data = await response.json();
    return data;
}

export const updateProfileImage = async (image: string, userId: number) => {
    const token = await AsyncStorage.getItem('auth-token')
    if (!token || !userId) {
        Alert.alert(labels.sorry, labels.pleaseLoginToContinue)
        return
    }
    
    const endpoint = `${API_CONFIG.BASE_URL}/upload-book`;
    const headers = {
        'Authorization': `Bearer ${token}` 
    }
    const formData = new FormData();
    formData.append('file', {uri: image, name: image.split('/').pop(), type: 'image/*'} as any);
    formData.append('operationType', "user");
    formData.append('id', `${userId}`);
    console.log(formData)
    const response = await fetch(endpoint, {method: 'POST', headers: headers, body: formData})

    if (!response.ok) {
        const text = await response.text();
        alert(`Failed to save token: ${response.status} ${text}`);
    }
        
    const data = await response.json();
    useAuthStore.setState({ user: data.user })
    console.log(useAuthStore.getState().user)
    await AsyncStorage.removeItem('auth-user')
    await AsyncStorage.setItem('auth-user', JSON.stringify(data.user))

    return data;
}

export const resetUserPassword = async (token: string, newPassword: string) => {
    const endpoint = `${API_CONFIG.BASE_URL}/reset-password/change-password`;
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            confirm_password: newPassword, 
            new_password: newPassword
        })
    })
    if (!response.ok) {
        // @ts-ignore
        throw new Error('Failed to save token', response.message)
    }
    const data = await response.json();
    return data;
}

export const updateProfileInfo = async (value: any, description: string) => {
    const token = useAuthStore((state) => state.token)
    if (!token) return
    
    const endpoint = `${API_CONFIG.BASE_URL}/update-user`;
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            user: value,
            details: {birthAt: null, deadAt: null, description: description},
        })
    })
    if (!response.ok) {
        // @ts-ignore
        throw new Error('Failed to save token', response.message)
    }
    const data = await response.json();
    return data;
}
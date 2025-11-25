import { API_CONFIG } from "@/app/utils/config";

export const saveToken = async (token: string, userId: number) => {
    try {
        const endpoint = `${API_CONFIG.BASE_URL}/update-device-token`;
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: API_CONFIG.HEADERS,
            body: JSON.stringify({token: token, userId: userId})
        })
        
        const data = await response.json();
        
        return data;
    } catch (error) {
        console.log('save device tokain failed ::: ', error)
        return `save device tokain failed ::: ${error}`
    }
}
import { API_CONFIG } from "@/app/utils/config";

export const saveToken = async (token: string, userId: number) => {
    const endpoint = `${API_CONFIG.BASE_URL}/update-device-token`;
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify({token: token, userId: userId})
    })
    
    if (!response.ok) {
        // @ts-ignore
        throw new Error('Failed to save token', response.message)
    }

    const data = await response.json();
    
    return data;
}
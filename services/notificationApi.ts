import { getAnonymousId } from "@/app/utils/annonymous";
import { API_CONFIG } from "@/app/utils/config";

export const saveToken = async (token: string, userId: number) => {
    try {
        const anonymousId = await getAnonymousId();
        const endpoint = `${API_CONFIG.BASE_URL}/update-device-token`;
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: API_CONFIG.HEADERS,
            body: JSON.stringify({token: token, anonymousId: anonymousId, userId: userId})
        })
        
        if (!response.ok) {
            console.error('Device token registration failed:', response.status, response.statusText);
            return null;
        }
        const data = await response.json();
        
        return data;
    } catch (error) {
        console.log('save device tokain failed ::: ', error)
        return `save device tokain failed ::: ${error}`
    }
}

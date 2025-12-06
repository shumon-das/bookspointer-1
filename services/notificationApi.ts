import annonymous, { getAnonymousId } from "@/app/utils/annonymous";
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
        
        const data = await response.json();
        
        return data;
    } catch (error) {
        console.log('save device tokain failed ::: ', error)
        return `save device tokain failed ::: ${error}`
    }
}

export const getNotificationBooks = async () => {
    try {
        const anonymousId = await getAnonymousId();
        const endpoint = `${API_CONFIG.BASE_URL}/notification-books`;
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: API_CONFIG.HEADERS,
            body: JSON.stringify({anonymousId: anonymousId})
        })
        
        const data = await response.json();
        
        return data;
    } catch (error) {
        console.log('get notification books failed ::: ', error)
        return `get notification books failed ::: ${error}`
    }
}

export const getNoViewNotificationCount = async () => {
    try {
        const anonymousId = await getAnonymousId();
        const endpoint = `${API_CONFIG.BASE_URL}/user-notifications-count`;
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: API_CONFIG.HEADERS,
            body: JSON.stringify({anonymousId: anonymousId})
        })
        
        const data = await response.json();
        
        return data;
    } catch (error) {
        console.log('get notification count failed ::: ', error)
        return `get notification count failed ::: ${error}`
    }
}

export const markNotificationAsRead = async (notificationId: number) => {
    const endpoint = `${API_CONFIG.BASE_URL}/mark-notification-as-read/${notificationId}`;
    const response = await fetch(endpoint)
    
    if (!response.ok) {
        console.log('Failed to mark notification as read', response.status, response.statusText);
    }
    
    const data = await response.json();
    console.log('markNotificationAsRead response ::: ', data);
    
    return data;
}
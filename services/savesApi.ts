import { API_CONFIG } from "@/app/utils/config";

export const saveNewUser = async (value: object) => {
    const endpoint = `${API_CONFIG.BASE_URL}/create-user`;
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify(value)
    })
    
    if (!response.ok) {
        // @ts-ignore
        throw new Error('Failed to fetch authors', response.message)
    }

    const data = await response.json();
    
    return data;
}

export const saveBookIntoLibrary = async (value: object, token: string) => {
    const endpoint = `${API_CONFIG.BASE_URL}/like-unlike`;
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(value)
    })
    
    if (!response.ok) {
        // @ts-ignore
        throw new Error('Failed to save book', response.message)
    }

    const data = await response.json();
    
    return data;
}
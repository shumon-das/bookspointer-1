import { API_CONFIG } from "@/app/utils/config";

export const searchData = async (text: string) => {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/search?q=${text}`)
    
    if (!response.ok) {
        // @ts-ignore
        throw new Error('Failed to fetch authors', response.message)
    }

    const data = await response.json();
    
    return data;
}
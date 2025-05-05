import { API_CONFIG } from "@/app/utils/config";

export const fetchIniitialCategories = async (limit = 0) => {
    const endpoint = `${API_CONFIG.BASE_URL}/categories/limited/${limit}`;
    const response = await fetch(endpoint, {
        method: 'GET',
        headers: API_CONFIG.HEADERS,
    })
    

    if (!response.ok) {
        // @ts-ignore
        throw new Error('Failed to fetch categories', response.message)
    }

    const data = await response.json();
    
    return data;
}

export const fetchFilteredAuthorsData = async (text: string) => {
    const endpoint = `${API_CONFIG.BASE_URL}/api/authors/${text}`;
    const response = await fetch(endpoint, {
        method: 'GET',
        headers: API_CONFIG.HEADERS,
    })
    
    if (!response.ok) {
        // @ts-ignore
        throw new Error('Failed to fetch authors', response.message)
    }
    
    const data = await response.json();
    
    return data;
}

export const fetchInitialAuthors = async (from = 0, to = 20) => {
    const endpoint = `${API_CONFIG.BASE_URL}/api/authors/${from}/${to}`;
    const response = await fetch(endpoint, {
        method: 'GET',
        headers: API_CONFIG.HEADERS,
    })
    
    if (!response.ok) {
        // @ts-ignore
        throw new Error('Failed to fetch authors', response.message)
    }

    const data = await response.json();
    
    return data;
}

export const searchData = async (text: string) => {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/search?q=${text}`)
    
    if (!response.ok) {
        // @ts-ignore
        throw new Error('Failed to fetch authors', response.message)
    }

    const data = await response.json();
    
    return data;
}
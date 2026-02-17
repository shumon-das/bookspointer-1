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
        console.log('Failed to fetch authors', response.message)
    }

    const data = await response.json();
    
    return data;
}

export const separateSearchByBookAndAuthorOrAll = async (text: string, searchSubject: string, page: number = 1, limit: number = 20) => {
    console.log(text, searchSubject, page, limit)
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/suggessions`, {
            method: 'POST',
            headers: API_CONFIG.HEADERS,
            body: JSON.stringify({
                search: { 
                    query: text, 
                    subject: searchSubject,
                    page: page,
                    limit: limit 
                }
            })
        })
    
        const data = await response.json();
        
        return data;
    } catch (error) {
        console.log('Failed to fetch authors', error)
    }
}

export const searchAuthorData = async (text: string, authorId: number) => {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/author-books/${authorId}/${text}`)
    
    if (!response.ok) {
        // @ts-ignore
        alert('Failed to fetch authors', response?.message)
        console.log('Failed to fetch authors', response.status)
    }

    const data = await response.json();
    
    return data;
}
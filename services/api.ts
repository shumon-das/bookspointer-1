import { API_CONFIG } from "@/app/utils/config";

export const fetchBooks = async ({pageNumber, limit, categoryName}: {pageNumber: number, limit: number, categoryName?: string}) => {
    let endpoint = API_CONFIG.BASE_URL + '/books';
    if (categoryName) {
        endpoint = `${API_CONFIG.BASE_URL}/books/${categoryName}`
    }

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify({page: pageNumber, limit: limit})
    })
    
    if (!response.ok) {
        // @ts-ignore
        throw new Error('Failed to fetch books', response.message)
    }

    const data = await response.json();
    
    return data.books;
}

export const singleBook = async (query: {id: number, page: number}) => {
    const endpoint = API_CONFIG.BASE_URL + '/single';
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify(query)
    })
    

    if (!(200 === response.status)) {
        const e = await response.json();
        throw new Error('Failed to fetch book ' + e.message);
    }

    const data = await response.json();
    
    return data;
}

export const fetchAuthors = async () => {
    const endpoint = API_CONFIG.BASE_URL + '/api/authors';
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

export const fetchCategories = async () => {
    const endpoint = API_CONFIG.BASE_URL + '/categories';
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

export const login = async (email: string, password: string) => {
    const endpoint = API_CONFIG.BASE_URL + '/api/login';
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify({ email: email, password: password })
    })
    
    if (401 === response.status) {
        return null;
    }

    const data = await response.json();
    
    return data;
}

export const userBooks = async (id: number) => {
    const endpoint = API_CONFIG.BASE_URL + '/api/author-series';
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify({ id: id })
    })
    
    console.log(response.status, response.json())
    if (401 === response.status) {
        return null;
    }

    const data = await response.json();
    return data;
}

export const authorBooks = async (authorId: number, isCreator: number) => {
    const endpoint = API_CONFIG.BASE_URL + '/api/author-series';
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify({ id: authorId, isCreator: isCreator })
    })
    
    if (401 === response.status) {
        return null;
    }

    const data = await response.json();
    
    return data;
}

export const fullBook = async (uuid: string) => {
    const endpoint = API_CONFIG.BASE_URL + '/book';
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify({uuid: uuid})
    })
    

    if (!(200 === response.status)) {
        const e = await response.json();
        throw new Error('Failed to fetch book ' + e.message);
    }

    const data = await response.json();
    
    return data;
}

export const saveBook = async (value: SaveRequestParams, token: string) => {
    const endpoint = API_CONFIG.BASE_URL + '/admin/create-book';
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
    }
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(value)
    })
    
    if (401 === response.status) {
        return null;
    }

    const data = await response.json();
    
    return data;
}

export const saveBookWithFile = async (data: SaveRequestParams, token: string) => {
    const formData = new FormData();
    if (data.image) {
        const uri = data.image;
        const fileName = uri.split('/').pop();
        const match = /\.(\w+)$/.exec(fileName || '');
        const fileType = match ? `image/${match[1]}` : `image`;
    
        formData.append('file', {
          uri,
          name: fileName,
          type: fileType,
        } as any);
    }

    // Add other form fields
    formData.append('data', JSON.stringify(data));

    try {
      const endpoint = API_CONFIG.BASE_URL + '/admin/create-book';
      const headers = {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` 
      }
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: formData,
      });
      
      const responseData = await response.json();
      console.log(responseData, data.id)

      return responseData;
    } catch (error) {
      console.error('Upload failed:', error);
    }
}
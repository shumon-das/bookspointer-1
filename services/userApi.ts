import { API_CONFIG } from "@/app/utils/config";

export const updateProfileImage = async (image: string, token: string, userId: number) => {
    const endpoint = `${API_CONFIG.BASE_URL}/upload-book`;
    const headers = {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}` 
    }
    const formData = new FormData();
    formData.append('file', {
        uri: image,
        name: image.split('/').pop(),
        type: 'image'
    } as any);
    formData.append('operationType', "user");
    formData.append('id', `${userId}`);
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({token: token, userId: userId})
    })
    
    if (!response.ok) {
        // @ts-ignore
        throw new Error('Failed to save token', response.message)
    }

    const data = await response.json();
    
    return data;
}
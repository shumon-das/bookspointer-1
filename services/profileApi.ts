import { API_CONFIG } from "@/app/utils/config";
import { Alert } from "react-native";

export const fetchBooksBySeriesName = async (seriesName: string, authorId: number, isLibrary: boolean, isCreator: boolean) => {
    const endpoint = `${API_CONFIG.BASE_URL}/api/books-by-series`;
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify({
            series: seriesName,
            authorId: authorId,
            isLibrary: isLibrary,
            isCreator: isCreator,
        })
    })

    const data = await response.json();

    if (data && data.status && data.status !== 200) {
        // @ts-ignore
        console.log('Failed to fetch ', response.message)
    }

    return data;
}

export const fetchUserProfileData = async (userUuid: string) => {
    const response = await fetch(`${API_CONFIG.BASE_URL}/single-user/${userUuid}`)
    const data = await response.json();

    if (data && data.status && !data.status) {
        // @ts-ignore
        console.log('Failed to fetch user profile', response.message)
    }

    return data;
}

export const createAndUpdateSeries = async (user: any, token: string) => {
    const endpoint = `${API_CONFIG.BASE_URL}/admin/update-user`;
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user),
    })
    if (!response.ok) {
        Alert.alert('API ERROR', `${response.status}: internal server error`)
    }
    
    const data = await response.json();
    
    return data;
}
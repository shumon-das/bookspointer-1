import API_CONFIG from "@/app/utils/config";

export const getLastVersionDetails = async () => {
    try {
        const endpoint = API_CONFIG.BASE_URL + '/api/android/version';
        const response = await fetch(endpoint)
        const data = await response.json();
        
        return data;
    } catch (error) {
        console.log('version details api error ', error)
        return null
    }
}
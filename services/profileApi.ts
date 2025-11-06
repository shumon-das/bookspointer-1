import { API_CONFIG } from "@/app/utils/config";

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
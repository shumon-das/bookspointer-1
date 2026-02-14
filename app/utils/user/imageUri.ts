import API_CONFIG from "../config";

export const userImageUri = (image: string) => {
  if (image.startsWith('http')) return { uri: image }
  return { uri: `${API_CONFIG.BASE_URL}/uploads/${image}` }
} 

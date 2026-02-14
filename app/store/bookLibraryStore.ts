import { create } from 'zustand';
import API_CONFIG from '../utils/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BookInterface } from '@/types/interfeces';
import { getAnonymousId } from '../utils/annonymous';

interface BookLibraryState {
  addToLibrary: (value: {
    bookId: number; 
    userId: number; 
    isSave: boolean, 
    action: string;
    anonymous?: string;
  }) => Promise<void>;
}

export const useBookLibraryStore = create<BookLibraryState>((set, get) => ({
  addToLibrary: async (value: {bookId: number; userId: number; isSave: boolean, action: string, anonymous?: string}) => {
    const token = await AsyncStorage.getItem('auth-token')
    value.anonymous = await getAnonymousId();
    if (!token) {
        alert('No token found')
        return;
    }
    const endpoint = `${API_CONFIG.BASE_URL}/like-unlike`;
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(value),
        })
        if (!response.ok) {
            alert('API ERROR: Something went wrong')
        }
    
        const data = await response.json();
        
        return data;
  },
}));
import { User } from '@/components/types/User';
import { create } from 'zustand';
import API_CONFIG from '../utils/config';

// Temporary Store
interface TempStore {
    bookContent: string;
    setBookContent: (bookContent: string) => void;
    visitUser: User|null;
    setVisitUser: (visitUser: User) => void;
    fetchVisitUser: (uuid: string) => void;
    selectedReview: any;
    setSelectedReview: (selectedReview: any) => void;
}

export const useTempStore = create<TempStore>((set: any, get: any) => ({
    bookContent: '',
    setBookContent: (bookContent: string) => set({ bookContent }),
    visitUser: null,
    setVisitUser: (visitUser: User) => set({ visitUser }),
    fetchVisitUser: async (uuid: string) => {
        const response = await fetch(`${API_CONFIG.BASE_URL}/single-user/${uuid}`)
        const data = await response.json();
    
        if (data && data.status && !data.status) {
            // @ts-ignore
            console.log('Failed to fetch user profile', response.message)
        }
        
        set({ visitUser: data });
    },
    selectedReview: null,
    setSelectedReview: (selectedReview: any) => set({ selectedReview }),
}));

import { User } from '@/components/types/User';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

interface AuthStore {
    token: string | null;
    setToken: (token: string) => void;
    user: User | null;
    setUser: (user: User|null) => void;
    // loadAuth: () => any,
    logout: () => void;
}

export const useAuthStore = create<AuthStore>((set: any, get: any) => ({
    token: null as string | null,
    setToken: (token: string) => set({ token }),
    user: null as User | null,
    setUser: (user: User|null) => set({ user }),
    // loadAuth: async () => {
    //     const storedUser = await AsyncStorage.getItem('auth-user');
    //     const storedToken = await AsyncStorage.getItem('auth-token');
    //     set({
    //         user: storedUser ? JSON.parse(storedUser) : null,
    //         token: storedToken || null,
    //     });
    // },
    logout: () => set({ user: null, token: null }),
}));

export default useAuthStore;
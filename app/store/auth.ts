import { User } from '@/components/types/User';
import { create } from 'zustand';

interface AuthStore {
    token: string | null;
    setToken: (token: string) => void;
    user: User | null;
    setUser: (user: User) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthStore>((set: any, get: any) => ({
    token: null as string | null,
    setToken: (token: string) => set({ token }),
    user: null as User | null,
    setUser: (user: User) => set({ user }),
    logout: () => set({ user: null, token: null }),
}));
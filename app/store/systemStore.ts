import { create } from 'zustand'

interface SystemState {
    lang: string;
    setLang: (language: string) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
}

export const useSystemStore = create<SystemState>((set, get) => ({
    lang: 'en',
    setLang: (language: string) => set({lang: language}),
    loading: false,
    setLoading: (loading: boolean) => set({loading: loading})
}))
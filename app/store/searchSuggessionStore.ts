import { create } from "zustand";

export const useSearchSuggessionStore = create((set) => ({
    suggessions: [],
    setSuggessions: (suggessions: any) => set({ suggessions })
}))

export default useSearchSuggessionStore

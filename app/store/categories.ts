import { create } from 'zustand';

interface CategoryStore {
    categories: Category[];
    setCategories: (value: Category[]) => Category[]
}

export const useCategoryStore = create<CategoryStore>((set: any) => ({
    categories: [],
    setCategories: (categories: Category[]) => set({ categories }),
}))
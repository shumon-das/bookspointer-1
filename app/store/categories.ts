import { create } from 'zustand';
import { CategoryInterface } from '../types/interfeces';

interface CategoryStore {
    categories: CategoryInterface[];
    setCategories: (value: CategoryInterface[]) => CategoryInterface[],
}

export const useCategoryStore = create<CategoryStore>((set: any) => ({
    categories: [],
    setCategories: (categories: CategoryInterface[]) => set({ categories }),
}))
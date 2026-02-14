import { create } from 'zustand';
import { CategoryInterface } from '../../types/interfeces';

interface CategoryStore {
    categoryTab: any,
    setCategoryTab: (value: any) => any,
    categories: CategoryInterface[];
    setCategories: (value: CategoryInterface[]) => CategoryInterface[],
}

export const useCategoryStore = create<CategoryStore>((set: any) => ({
    categoryTab: null as any,
    setCategoryTab: (categoryTab: any) => set({categoryTab}),
    categories: [],
    setCategories: (categories: CategoryInterface[]) => set({ categories }),
}))

export default useCategoryStore;
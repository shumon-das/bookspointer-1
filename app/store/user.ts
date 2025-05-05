import { create } from 'zustand';

interface UserStore {
    userBooks: Book[];
    authorBooks: Book[];
    selectCategories: Book[];
    setSelectCategories: (value: Book[]) => Book;
    authors: User[];
    setAuthors: (value: User[]) => User[]
}

export const useUserStore = create<UserStore>((set: any) => ({
    userBooks: [],
    authorBooks: [],
    selectCategories: [],
    setSelectCategories: (selectCategories: Book[]) => set({ selectCategories }),
    authors: [],
    setAuthors: (authors) => set({ authors })
}))
import { create } from 'zustand';

interface BookStore {
    userBooks: Book[];
    authorBooks: Book[];
    selectCategories: Book[];
    setSelectCategories: (value: Book[]) => Book;
    authors: User[];
    setAuthors: (value: User[]) => User[]
}

export const useBookStore = create<BookStore>((set: any) => ({
    userBooks: [],
    authorBooks: [],
    selectCategories: [],
    setSelectCategories: (selectCategories: Book[]) => set({ selectCategories }),
    authors: [],
    setAuthors: (authors) => set({ authors })
}))
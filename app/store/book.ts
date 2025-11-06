import { create } from 'zustand';
import { BookInterface, UserInterface } from '../../types/interfeces';

interface BookStore {
    userBooks: BookInterface[];
    authorBooks: BookInterface[];
    selectCategories: BookInterface[];
    setSelectCategories: (value: BookInterface[]) => BookInterface;
    authors: UserInterface[];
    setAuthors: (value: UserInterface[]) => UserInterface[]
}

export const useBookStore = create<BookStore>((set: any) => ({
    userBooks: [],
    authorBooks: [],
    selectCategories: [],
    setSelectCategories: (selectCategories: BookInterface[]) => set({ selectCategories }),
    authors: [],
    setAuthors: (authors) => set({ authors })
}))

export default useBookStore;
import { create } from 'zustand';
import { BookInterface, UserInterface } from '../../types/interfeces';

interface BookStore {
    homeBooks: BookInterface[];
    setHomeBooks: (value: any[]) => void;
    userBooks: BookInterface[];
    authorBooks: BookInterface[];
    selectCategories: BookInterface[];
    setSelectCategories: (value: BookInterface[]) => BookInterface;
    authors: UserInterface[];
    setAuthors: (value: UserInterface[]) => UserInterface[],
    notificationBooks: any[];
    setNotificationBooks: (value: any[]) => any[],
}

export const useBookStore = create<BookStore>((set: any, get: any) => ({
    homeBooks: [],
    setHomeBooks: (homeBooks: any[]) => set({ homeBooks }),
    userBooks: [],
    authorBooks: [],
    selectCategories: [],
    setSelectCategories: (selectCategories: BookInterface[]) => set({ selectCategories }),
    authors: [],
    setAuthors: (authors) => set({ authors }),
    notificationBooks: [],
    setNotificationBooks: (notificationBooks) => set({ notificationBooks }),
}))

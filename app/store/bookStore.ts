import { create } from 'zustand';
import API_CONFIG from '../utils/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BookInterface } from '@/types/interfeces';

interface BooksState {
  books: BookInterface[];
  page: number;
  limit: number;
  totalPages: number;
  loading: boolean;
  // Queries
  fetchBooks: () => Promise<void>;
  // CRUD
  addBook: (book: Omit<BookInterface, 'id'>) => Promise<void>;
  updateBook: (id: number, updates: Partial<BookInterface>) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  // Utils
  resetBooks: () => void;
  updateBookPermission: (event: { uuid: string, isPublished: boolean; isDeleted: boolean }) => Promise<void>;
}

export const useBooksStore = create<BooksState>((set, get) => ({
  books: [],
  page: 1,
  limit: 20,
  totalPages: 1,
  loading: false,

  // --- READ (Infinite Scroll / Pagination) ---
  fetchBooks: async () => {
    const { loading, page, totalPages, books, limit } = get();
    if (loading || (page > totalPages && books.length > 0)) return;

    set({ loading: true });

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/books-paginated?page=${page}&limit=${limit}`
      );
      const result = await response.json();

      if (result.status) {
        set({
          books: [...books, ...result.data.books],
          totalPages: result.data.totalPages,
          page: page + 1,
        });
      }
    } catch (error) {
      console.error("Failed to fetch books:", error);
    } finally {
      set({ loading: false });
    }
  },

  // --- CREATE ---
  addBook: async (bookData) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData),
      });
      const result = await response.json();
      if (result.status) {
        // Optimistic update: add new book to the start of the list
        set((state) => ({ books: [result.data, ...state.books] }));
      }
    } catch (error) {
      console.error("Error adding book:", error);
    }
  },

  // --- UPDATE ---
  updateBook: async (id, updates) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/books/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (response.ok) {
        set((state) => ({
          books: state.books.map((b) => (b.id === id ? { ...b, ...updates } : b)),
        }));
      }
    } catch (error) {
      console.error("Error updating book:", error);
    }
  },

  // --- DELETE ---
  deleteBook: async (id) => {
      try {
        const token = await AsyncStorage.getItem('auth-token')
        if (!token) {
            alert('No token found')
            return;
        }
        const endpoint = `${API_CONFIG.BASE_URL}/admin/delete-book/${id}`;
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {'Authorization': `Bearer ${token}`},
        })
    
        if (!response.ok) {
            alert('API ERROR: Something went wrong')
        }
    
        const data = await response.json();
        
        return data;
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  },

  updateBookPermission: async (event) => {
    const token = await AsyncStorage.getItem('auth-token')
    if (!token) {
        alert('No token found')
        return;
    }
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/update-book-permission`, {
        method: 'POST',
        headers: { "Authorization": `Bearer ${token}` },
        body: JSON.stringify(event),
    })
    const data = await response.json()
    const newBook = data as BookInterface;
    if (newBook) {
        set((state) => ({
            books: state.books.map((b: BookInterface) => (b.id === newBook.id ? { ...b, ...newBook } : b)),
        }));
    }
  },

  resetBooks: () => set({ books: [], page: 1, totalPages: 1, loading: false }),
}));
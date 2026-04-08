import { create } from 'zustand';
import API_CONFIG from '../utils/config';
import { getAllAuthors, inserSingleUser } from '../utils/database/insertAllUsers';
import { User } from '@react-native-google-signin/google-signin';
import { getRegionCode } from '../utils/regionCode';

interface AuthorsState {
  currentlyVisitedAuthor: any,
  setCurrentlyVisitedAuthor: (data: any) => void,
  authors: any[];
  page: number;
  limit: number;
  totalPages: number;
  loading: boolean;
  fetchAuthors: () => Promise<void>;
  findUserByUuid: (uuid: string, isConnected: boolean|null) => Promise<User|null>;
  fetchUserByUuidApi: (uuid: string) => Promise<User|null>;
  resetAuthors: () => void;
}

export const useAuthorsStore = create<AuthorsState>((set, get) => ({
  currentlyVisitedAuthor: null,
  setCurrentlyVisitedAuthor: (data: any) => set({ currentlyVisitedAuthor: data }),
  authors: [],
  page: 1,
  limit: 20,
  totalPages: 1,
  loading: false,

  fetchAuthors: async () => {
    console.log('one...')
    const { loading, page, totalPages, authors, limit } = get();
    
    if (loading || (page > totalPages && authors.length > 0)) return;
    console.log('two...')

    set({ loading: true });
    console.log('three...')

    try {
      const lang = await getRegionCode();
      const url = `${API_CONFIG.BASE_URL}/authors-paginated?page=${page}&limit=${limit}&lang=${lang}`;
      const response = await fetch(url);
      const result = await response.json();
      console.log(lang, url, result.data.authors)

      if (result.status) {
        set({
          authors: [...authors, ...result.data.authors],
          totalPages: result.data.totalPages,
          page: page + 1,
        });
      }
    } catch (error) {
      console.error("Failed to fetch authors:", error);
    } finally {
      set({ loading: true }); // Wait, set loading to false!
      set({ loading: false });
    }
  },

  findUserByUuid: async (uuid: string, isOnline: boolean|null) => {
    const authorsData = get().authors;
    if (authorsData.length > 0) {
      const user = authorsData.find((author: any) => author.uuid === uuid);
      if (user) {
        return user;
      }
    } else if (authorsData.length === 0) {
      const authorsData = await getAllAuthors();
      if (authorsData.length > 0) {
        const user = authorsData.find((author: any) => author.uuid === uuid);
        if (user) {
          return user;
        }
      }
    }
    return null;
  },
  fetchUserByUuidApi: async (uuid: string) => {
      const endpoint = `${API_CONFIG.BASE_URL}/single-author/${uuid}`;
      const response = await fetch(endpoint);
      if (!response.ok) {
        // @ts-ignore
        console.log('Failed to fetch author', response.message);
        return null;
      }
      const data = await response.json();

      await inserSingleUser(data);
      
      return data;
  },

  resetAuthors: () => set({ authors: [], page: 1, totalPages: 1, loading: false }),
}));
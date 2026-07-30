import { create } from 'zustand';
import API_CONFIG from '../utils/config';
import { Book } from '@/components/types/Book';
import { createFeedBooksTable, getAllFeedBooks, getBookIdsOnly, replaceFeedBooksCache } from '../utils/database/bookFeedDb';
import { getAnonymousId } from '../utils/annonymous';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getRegionCode } from '../utils/regionCode';

interface HomeState {
  feedBooks: Book[],
  page: number;
  limit: number;
  totalPages: number;
  loading: boolean;
  headerReloadLoading: boolean;
  bannerStyle: {height: number, backgroundColor: string, margin: number};
  bannerMessage: string;
  clearFeedBooks: () => void,
  fetchFeedBooks: (isConnected: boolean|null, version?: string) => Promise<boolean>,
  refreshFeedBooks: (version?: string) => Promise<boolean>,
  fetchCacheBooks: () => Promise<void>,
  onRefresh: (version: string) => Promise<boolean>,
}

export const useHomeStore = create<HomeState>((set, get) => ({
  feedBooks: [],
  page: 1,
  limit: 20,
  bannerStyle: {height: 0, backgroundColor: '#085a80', margin: 0},
  bannerMessage: "",
  totalPages: 1000,
  loading: false,
  headerReloadLoading: false,
  clearFeedBooks: () => set({ feedBooks: [], page: 1, loading: false }),
  
  fetchFeedBooks: async (isOnline: boolean|null, version?: string) => {
    if (isOnline === false) return false;

    await createFeedBooksTable();

    const { page, totalPages, limit } = get();

    set({ loading: true });
    try {

        const lang = await getRegionCode();
        const anonymousId = await getAnonymousId();
        const storageUser = await AsyncStorage.getItem('auth-user');
        const userId = storageUser ? JSON.parse(storageUser).id : 0;
        let endpoint = `${API_CONFIG.BASE_URL}/user-feed/${anonymousId}/${page}/${userId}/${limit}?lang=${lang}&refresh=${Date.now()}`;
        const response = await fetch(endpoint, {
          cache: 'no-store',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Version': version || '13_02_2026',
            'Cache-Control': 'no-cache, no-store',
            'Pragma': 'no-cache',
          }
        });
        if (!response.ok) {
          throw new Error(`Feed request failed with status ${response.status}`);
        }

        const books = await response.json();
        if (!Array.isArray(books)) {
          throw new Error('Feed response did not contain a list of books');
        }

        console.log(books.length)
        set(state => {
          const map = new Map<number, any>();
          [...state.feedBooks, ...books].forEach(b => map.set(b.id, b));
          
          return {
            feedBooks: Array.from(map.values()),
            page: state.page + 1,
          };
        });
        set({loading: false})
        await replaceFeedBooksCache(books);

        const bannerStyle = response.headers.get('x-banner-style');
        const bannerMessage = response.headers.get('x-banner-message');
        set({ 
          bannerStyle: bannerStyle ? JSON.parse(bannerStyle || '{}') : get().bannerStyle, 
          bannerMessage: bannerMessage || '' 
        })
        return true;

    } catch (error) {
        console.error("Failed to fetch Feed Books:", error);
        return false;
    } finally {
        set({ loading: false });
    }
  },

  fetchCacheBooks: async () => {
    const books = await getAllFeedBooks();
    set({ feedBooks: books });
  },

  refreshFeedBooks: async (version?: string) => {
    await createFeedBooksTable();

    try {
      const lang = await getRegionCode();
      const anonymousId = await getAnonymousId();
      const storageUser = await AsyncStorage.getItem('auth-user');
      const userId = storageUser ? JSON.parse(storageUser).id : 0;
      const endpoint = `${API_CONFIG.BASE_URL}/user-feed/${anonymousId}/1/${userId}/${get().limit}?lang=${lang}&refresh=${Date.now()}`;
      const response = await fetch(endpoint, {
        cache: 'no-store',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Version': version || '13_02_2026',
          'Cache-Control': 'no-cache, no-store',
          'Pragma': 'no-cache',
        }
      });

      if (!response.ok) throw new Error(`Feed refresh failed with status ${response.status}`);

      const books = await response.json();
      if (!Array.isArray(books)) throw new Error('Feed refresh response did not contain a list of books');

      set(state => {
        const map = new Map<number, any>();
        [...books, ...state.feedBooks].forEach(book => {
          if (!map.has(book.id)) map.set(book.id, book);
        });
        return { feedBooks: Array.from(map.values()), page: Math.max(state.page, 2) };
      });

      const mergedBooks = [...books, ...get().feedBooks].reduce<any[]>((merged, book) => {
        if (!merged.some(item => item.id === book.id)) merged.push(book);
        return merged;
      }, []);
      await replaceFeedBooksCache(mergedBooks);

      const bannerStyle = response.headers.get('x-banner-style');
      const bannerMessage = response.headers.get('x-banner-message');
      set({
        bannerStyle: bannerStyle ? JSON.parse(bannerStyle) : get().bannerStyle,
        bannerMessage: bannerMessage || ''
      });
      return true;
    } catch (error) {
      console.error('Failed to refresh Feed Books:', error);
      return false;
    }
  },

  onRefresh: async (version: string) => {
    const refreshed = await get().refreshFeedBooks(version);
    if (!refreshed && get().feedBooks.length === 0) {
      await get().fetchCacheBooks();
    }
    return refreshed;
  },
}));

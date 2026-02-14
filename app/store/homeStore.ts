import { create } from 'zustand';
import API_CONFIG from '../utils/config';
import { Book } from '@/components/types/Book';
import { createFeedBooksTable, getAllFeedBooks, getBookIdsOnly, replaceFeedBooksCache } from '../utils/database/bookFeedDb';
import { getAnonymousId } from '../utils/annonymous';

interface HomeState {
  feedBooks: Book[],
  page: number;
  limit: number;
  totalPages: number;
  loading: boolean;
  bannerStyle: {height: number, backgroundColor: string, margin: number};
  bannerMessage: string;
  clearFeedBooks: () => void,
  fetchFeedBooks: (isConnected: boolean|null, version?: string) => Promise<void>,
  fetchCacheBooks: () => Promise<void>,
  onRefresh: (version: string) => void,
}

export const useHomeStore = create<HomeState>((set, get) => ({
  feedBooks: [],
  page: 1,
  limit: 20,
  bannerStyle: {height: 0, backgroundColor: '#085a80', margin: 0},
  bannerMessage: "",
  totalPages: 1000,
  loading: false,
  clearFeedBooks: () => set({ feedBooks: [], page: 1, loading: false }),
  
  fetchFeedBooks: async (isOnline: boolean|null, version?: string) => {
    await createFeedBooksTable();

    const { page, totalPages, limit } = get();

    if (page > totalPages) return;

    set({ loading: true });
    if (!isOnline) {
        return;
    }

    try {
        const anonymousId = await getAnonymousId();
        let endpoint = `${API_CONFIG.BASE_URL}/user-feed/${anonymousId}/${page}/${0}/${limit}`;
        const response = await fetch(endpoint, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Version': version || '13_02_2026'
          }
        });
        const books = await response.json();

        set({ feedBooks: [] });
        set(state => {
          const map = new Map<number, any>();
          [...state.feedBooks, ...books].forEach(b => map.set(b.id, b));
          
          return {
            feedBooks: Array.from(map.values()),
            page: state.page + 1,
          };
        });
        await replaceFeedBooksCache(books);

        const bannerStyle = response.headers.get('x-banner-style');
        const bannerMessage = response.headers.get('x-banner-message');

        set({ 
          bannerStyle: bannerStyle ? JSON.parse(bannerStyle || '{}') : get().bannerStyle, 
          bannerMessage: bannerMessage || '' 
        })
        // console.log(bannerStyle, bannerMessage)

    } catch (error) {
        console.error("Failed to fetch Feed Books:", error);
    } finally {
        set({ loading: false });
    }
  },

  fetchCacheBooks: async () => {
    const books = await getAllFeedBooks();
    set({ feedBooks: books });
  },

  onRefresh: (version: string) => {
    get().fetchFeedBooks(true);
  },
}));

import { create } from 'zustand';
import API_CONFIG from '../utils/config';
import { getAnonymousId } from '../utils/annonymous';
import { User } from '@/components/types/User';

interface Response {
    status: boolean,
    author: null|User,
    current_page: {page_number: number, text: string},
    total_pages: number,
    nextPage: {page_number: number|null, text: string|null},
    prevPage: {page_number: number|null, text: string|null},
    selectedBook: any,
}

interface BookDetailsState {
  pages: {page_number: number, text: string}[];
  current_page_number: number;
  total_pages: number;
  textsWithPrevAndNextPage: (bookId: number, page: number, isFirstRequest?: boolean) => Promise<Response>;
  selectedBook: any;
  setSelectedBook: (book: any) => void;
}

export const useBookDetailsStore = create<BookDetailsState>((set, get) => ({
    pages: [],
    current_page_number: 1,
    total_pages: 0,
    textsWithPrevAndNextPage: async (bookId, page, isFirstRequest = false) => {
        const annonymousId = await getAnonymousId();
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/book-text-with-next-and-prev-page`, {
                method: 'POST',
                headers: API_CONFIG.HEADERS,
                body: JSON.stringify({ 
                    id: bookId,
                    page: page, 
                    firstRequest: isFirstRequest,
                    anonymous: annonymousId
                })
            });

            const data = await response.json();
            set({total_pages: data.total_pages})
            set({current_page_number: data.current_page.page_number})
            const {pages} = get()
            if (pages.length > 0) {
                if (!pages.find((p) => p.page_number === data.current_page.page_number)) {
                    set({pages: [...pages, data.current_page]})
                }
                if (!pages.find((p) => p.page_number === data.nextPage.page_number)) {
                    set({pages: [...pages, data.nextPage]})
                }
                if (!pages.find((p) => p.page_number === data.prevPage.page_number)) {
                    set({pages: [...pages, data.prevPage]})
                }
            } else {
                set({pages: [data.current_page, data.nextPage, data.prevPage].filter((p) => p.page_number !== null)})
            }
            return data;
        } catch (error) {
            console.error("Failed to fetch page", error);
        }
    },
    selectedBook: null,
    setSelectedBook: (book: any) => set({selectedBook: book})
}))
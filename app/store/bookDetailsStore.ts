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
  current_page_number: number;
  total_pages: number;
  currentPageTexts: string;
  prevPageTexts: string;
  nextPageTexts: string;
  textsWithPrevAndNextPage: (bookId: number, page: number, isFirstRequest?: boolean) => Promise<Response>;
  selectedBook: any;
  setSelectedBook: (book: any) => void;
  relatedBooks: any[];
  fetchRelatedBooks: (bookId: number) => Promise<any[]>;
}

export const useBookDetailsStore = create<BookDetailsState>((set, get) => ({
    current_page_number: 1,
    total_pages: 0,
    relatedBooks: [],
    currentPageTexts: '',
    prevPageTexts: '',
    nextPageTexts: '',
    textsWithPrevAndNextPage: async (bookId, page, isFirstRequest = false) => {
        if ((get().current_page_number -1) === page && !isFirstRequest) { // prev page
            set({currentPageTexts: get().prevPageTexts, nextPageTexts: get().currentPageTexts})
        }
        if ((get().current_page_number +1) === page && !isFirstRequest) { // next page
            set({prevPageTexts: get().currentPageTexts, currentPageTexts: get().nextPageTexts})
        }

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
            set({current_page_number: data.current_page.page_number, total_pages: data.total_pages})

            if (isFirstRequest) {
                set({ prevPageTexts: data.prevPage.text, currentPageTexts: data.current_page.text, nextPageTexts: data.nextPage.text })
            } else {
                if ((get().current_page_number -1) === page && !isFirstRequest) { // prev page
                    set({prevPageTexts: data.prevPage.text})
                }
                if ((get().current_page_number +1) === page && !isFirstRequest) { // next page
                    set({nextPageTexts: data.nextPage.text})
                }

                if ((get().current_page_number -1) !== page && (get().current_page_number +1) !== page) {
                    set({currentPageTexts: data.current_page.text, nextPageTexts: data.nextPage.text, prevPageTexts: data.prevPage.text})
                }
            }
            return data;
        } catch (error) {
            console.error("Failed to fetch page", error);
        }
    },
    selectedBook: null,
    setSelectedBook: (book: any) => set({selectedBook: book}),
    fetchRelatedBooks: async (bookId: number) => {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/book-related-books`, {
                method: 'POST',
                headers: API_CONFIG.HEADERS,
                body: JSON.stringify({ id: bookId })
            });
            const data = await response.json();
            set({relatedBooks: data.relatedBooks})
            return data.relatedBooks;
        } catch (error) {
            console.error("Failed to fetch related books", error);
        }
    }
}))
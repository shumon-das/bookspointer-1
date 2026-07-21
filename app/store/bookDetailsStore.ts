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

export interface ChapterItem {
    index: number;
    title: string;
    page_count: number;
}

interface BookDetailsState {
  current_page_number: number;
  total_pages: number;
  currentPageTexts: string;
  prevPageTexts: string;
  nextPageTexts: string;
  current_chapter: number;
  has_chapters: boolean;
  chapters_list: ChapterItem[];
  textsWithPrevAndNextPage: (bookId: number, page: number, isFirstRequest?: boolean, chapter?: number) => Promise<Response | undefined>;
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
    current_chapter: 1,
    has_chapters: false,
    chapters_list: [],
    textsWithPrevAndNextPage: async (bookId, page, isFirstRequest = false, chapter) => {
        const annonymousId = await getAnonymousId();
        try {
            const requestBody: Record<string, unknown> = {
                id: bookId,
                page,
                firstRequest: isFirstRequest,
                anonymous: annonymousId,
            };

            // Omitting chapter on the first request allows the API to restore
            // the user's saved chapter and page.
            if (!isFirstRequest) {
                requestBody.chapter = chapter ?? get().current_chapter;
            }

            const response = await fetch(`${API_CONFIG.BASE_URL}/book-text-with-next-and-prev-page`, {
                method: 'POST',
                headers: API_CONFIG.HEADERS,
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();

            set({
                current_page_number: data.current_page.page_number,
                total_pages: data.total_pages,
                currentPageTexts: data.current_page.text,
                prevPageTexts: data.prevPage?.text ?? '',
                nextPageTexts: data.nextPage?.text ?? '',
                current_chapter: data.current_chapter ?? chapter ?? get().current_chapter,
                has_chapters: data.has_chapters === true,
                chapters_list: data.chapters_list ?? [],
            });
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

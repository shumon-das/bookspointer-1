import { create } from 'zustand';
import API_CONFIG from '../utils/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ReviewState {
  reviews: any[];
  fetchReviews: (bookId: number) => Promise<any>;
  replyToReview: (reviewId: number, bookId: number, reply: string) => Promise<any>;
  editReview: (review: any, content: string) => Promise<any>;
  deleteReview: (reviewId: number) => Promise<any>;
  resetReviews: () => void;
}

export const useReviewStore = create<ReviewState>((set, get) => ({
  reviews: [],
  fetchReviews: async (bookId: number) => {
    try {
      const token = await AsyncStorage.getItem('auth-token')
      if (!token) {
        alert('No token found')
        return;
      }
      const response = await fetch(`${API_CONFIG.BASE_URL}/admin/reviews/${bookId}`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      const result = await response.json();

      set({ reviews: result });
      return result;
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      return [];
    }
  },
  replyToReview: async (reviewId: number, bookId: number, reply: string) => {
    try {
      const storageUser = await AsyncStorage.getItem('auth-user')
      const loggedInUser = storageUser ? JSON.parse(storageUser) : null;
      const token = await AsyncStorage.getItem('auth-token')
      if (!token || !loggedInUser) {
        alert('No token found')
        return;
      }
      const response = await fetch(`${API_CONFIG.BASE_URL}/admin/review/create`, {
        method: 'POST',
        headers: { "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
          book_id: bookId,
          reviewer_id: loggedInUser.id,
          content: reply,
          anonymous: false,
          parent_id: reviewId
        }),
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Failed to reply to review:", error);
      return null;
    }
  },
  editReview: async (review: any, content: string) => {
    try {
      const storageUser = await AsyncStorage.getItem('auth-user')
      const loggedInUser = storageUser ? JSON.parse(storageUser) : null;
      const token = await AsyncStorage.getItem('auth-token')
      if (!token || !loggedInUser) {
        alert('No token found')
        return;
      }

      const response: any = await fetch(`${API_CONFIG.BASE_URL}/admin/review/create`, {
        method: 'POST',
        headers: {"Authorization": `Bearer ${token}`},
        body: JSON.stringify({
          book_id: review.bookId,
          review_id: review.id,
          reviewer_id: loggedInUser.id,
          content: content,
          parent_id: review.parent ? review.parent.id : null,
          anonymous: ''
        })
      })
      const result = await response.json();
      if (result.status) {
        const updatedReviews = get().reviews.map((r: any) => r.id === review.id ? r.content = content : r);
        set({ reviews: updatedReviews });
      }
      return result;
    } catch (error) {
      console.error("Failed to edit review:", error);
      return null;
    }
  },
  deleteReview: async (reviewId: number) => {
    try {
      const token = await AsyncStorage.getItem('auth-token')
      if (!token) {
        alert('No token found')
        return;
      }
      const response = await fetch(`${API_CONFIG.BASE_URL}/admin/book/review/delete/${reviewId}`, {
        headers: {"Authorization": `Bearer ${token}`},
      });
      if (!response.ok) {
        throw new Error('Failed to delete review');
      }

      const updatedReviews = get().reviews.filter((r: any) => r.id !== reviewId);
      set({ reviews: updatedReviews });

      return { status: true, data: get().reviews };
    } catch (error) {
      console.error("Failed to delete review:", error);
      return null;
    }
  },
  resetReviews: () => set({ reviews: [] }),
}));
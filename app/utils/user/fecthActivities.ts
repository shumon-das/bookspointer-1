import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAnonymousId } from "../annonymous";
import API_CONFIG from "../config";

export type ReadingActivity = {
    book_id: number | string;
    book_title: string;
    book_image?: string | null;
    book_url?: string | null;
    author_first_name?: string | null;
    author_last_name?: string | null;
    active_page: number | string;
    total_pages: number | string;
    reading_status?: 'reading' | 'completed';
    last_read_at?: string;
}

export type RecentActivity = {
    target_id?: number | string | null;
    type: string;
    last_activity_at?: string;
    book_id?: number | string | null;
    book_title?: string | null;
    profile_first_name?: string | null;
    profile_last_name?: string | null;
    field?: string | null;
}

export type ActivitiesResponse = {
    activities: ReadingActivity[];
    recentActivities: RecentActivity[];
    reviews?: unknown[];
}

export const percentage = (active_page: number, total_pages: number) => {
   if (!Number.isFinite(total_pages) || total_pages <= 0) return 0;
   const percent = (active_page / total_pages) * 100;
   return Math.max(0, Math.min(100, Math.floor(percent)));
}

export const fetchActivities = async (): Promise<ActivitiesResponse> => {
    const anonymous = await getAnonymousId();
    const token = await AsyncStorage.getItem('auth-token');
    if (!token) throw new Error('Please sign in again to view your reading activity.');

    const response = await fetch(`${API_CONFIG.BASE_URL}/admin/activities/${anonymous}`, {
        method: 'GET',
        headers: { "Authorization": `Bearer ${token}`},
    });

    const data = await response.json().catch(() => null);
    if (!response.ok || !data?.status) {
        throw new Error(data?.message || 'Could not load your reading activity.');
    }

    return {
        activities: Array.isArray(data.activities) ? data.activities : [],
        recentActivities: Array.isArray(data.recentActivities) ? data.recentActivities : [],
        reviews: Array.isArray(data.reviews) ? data.reviews : [],
    };
}

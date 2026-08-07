import { create } from 'zustand';
import { API_CONFIG } from '../utils/config';
import { createTable, getAllUsersIds, insertAllUsers } from '../utils/database/insertAllUsers';
import AsyncStorage from '@react-native-async-storage/async-storage';

let activeCreatorSync: Promise<void> | null = null;

interface AllUsersState {
  syncAllUsers: () => Promise<void>;
}

export const useSyncAllUsersStore = create<AllUsersState>((set, get) => ({
  syncAllUsers: async () => {
    if (activeCreatorSync) {
      return activeCreatorSync;
    }

    activeCreatorSync = (async () => {
      const today = new Date().toISOString().split('T')[0].replace(/-/g, '_');
      const isCheckedToday = await AsyncStorage.getItem('last_time_sync_all_users');

      if (isCheckedToday === today) {
        return;
      }

      await createTable();

      const ids = await getAllUsersIds();
      let page = 1;
      const limit = 40;
      let hasMore = true;
      while (hasMore) {
        const res = await fetch(`${API_CONFIG.BASE_URL}/api/creators`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            page,
            limit,
          }),
        });

        const json = await res.json();

        if (!res.ok || !Array.isArray(json.data)) {
          throw new Error(json?.message || 'Could not load creators for local sync.');
        }

        if (json.totalCreators === ids.length) {
          hasMore = false;
          break;
        }

        await insertAllUsers(json.data);

        if (page >= json.totalPages) {
          hasMore = false;
        } else {
          page += 1;
        }
      }

      await AsyncStorage.setItem('last_time_sync_all_users', today);
      console.log('✅ Author sync completed');
    })();

    try {
      await activeCreatorSync;
    } finally {
      activeCreatorSync = null;
    }
  },
}));

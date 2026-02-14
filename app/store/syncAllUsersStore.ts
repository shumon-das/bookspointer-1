import { create } from 'zustand';
import API_CONFIG from '../utils/config';
import { createTable, getAllUsersIds, insertAllUsers } from '../utils/database/insertAllUsers';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AllUsersState {
  syncAllUsers: () => Promise<void>;
}

export const useSyncAllUsersStore = create<AllUsersState>((set, get) => ({
  syncAllUsers: async () => {
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '_');
    const isCheckedToday = await AsyncStorage.getItem('last_time_sync_all_users');

    if (isCheckedToday === today) {
      return;
    }

    await createTable();

    const ids = await getAllUsersIds();
    let page = 1;
    let limit = 40;
    let hasMore = true;
    while (hasMore) {
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/creators`, {
        method: 'POST',
        body: JSON.stringify({
          page,
          limit
        })
      });

      const json = await res.json();

      if (json.totalCreators === ids.length) {
        hasMore = false;
        return;
      }
      // 1️⃣ Save immediately to SQLite
      await insertAllUsers(json.data);

      // 2️⃣ Stop condition
      if (json.totalPages < page) {
        hasMore = false;
      } else {
        page += 1;
      }
    }

    await AsyncStorage.setItem('last_time_sync_all_users', today);
    console.log('✅ Author sync completed');
  },
}));
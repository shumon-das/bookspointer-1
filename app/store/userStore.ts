import { create } from 'zustand';
import API_CONFIG from '../utils/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthUser } from '@/components/types/User';
import { getAnonymousId } from '../utils/annonymous';

interface UserState {
  authUser: AuthUser|null,
  authToken: string|null,
  loading: boolean,
  blockedUsers: any[],
  fetchAuthUserFromDb: () => Promise<AuthUser|null>;
  fetchAuthUserByAPi: () => Promise<AuthUser|null>;
  setAuthUser: (user: AuthUser) => void;
  setAuthToken: (token: string) => void;
  updateAuthUser: (user: AuthUser) => void;
  updateAuthUserImage: (image: string, type: 'profile' | 'cover') => Promise<any>;
  fetchBlockedUsers: () => Promise<void>;
  blockUser: (id: string) => Promise<void>;
  unblockUser: (id: string) => Promise<void>;
  resetAuthUser: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  authUser: null,
  authToken: null,
  loading: true,
  blockedUsers: [],
  fetchAuthUserFromDb: async () => {
    if (get().authUser) {
      return get().authUser;
    }

    const user = await AsyncStorage.getItem('auth-user');
    if (user) {
      set({ authUser: JSON.parse(user) });
      return JSON.parse(user);
    }

    const authUser = await get().fetchAuthUserByAPi();
    if (authUser) {
      set({ authUser: authUser });
    }

    return null;
  },
  fetchAuthUserByAPi: async (): Promise<AuthUser|null> => {
    try {
      const token = await AsyncStorage.getItem('auth-token');
      if (!token) {
        return null;
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}/admin/user/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      set({ authUser: data.data });
      await AsyncStorage.setItem('auth-user', JSON.stringify(data.data));
      return data.data;

    } catch (error) {
      console.error("Failed to fetch auth user:", error);
    } finally {
      set({ loading: false });
    }
    return get().authUser;
  },
  setAuthUser: (user: AuthUser) => {
    set({ authUser: user })
  },
  setAuthToken: (token: string) => set({ authToken: token }),
  updateAuthUser: (user: AuthUser) => {
  },
  updateAuthUserImage: async (image: string, type: 'profile' | 'cover') => {
      const token = await AsyncStorage.getItem('auth-token')
      const storageUser = await AsyncStorage.getItem('auth-user')
      if (!token || !storageUser) {
          return
      }
      
      const endpoint = `${API_CONFIG.BASE_URL}${type === 'profile' ? '/admin/user-image' : '/admin/cover-image'}`;
      const headers = {
          'Authorization': `Bearer ${token}` 
      }
      const formData = new FormData();
      formData.append('image', {uri: image, name: image.split('/').pop(), type: 'image/*'} as any);
      const response = await fetch(endpoint, {method: 'POST', headers: headers, body: formData})

      if (!response.ok) {
          const text = await response.text();
          alert(`Failed to save token: ${response.status} ${text}`);
      }
          
      const data = await response.json();
      const authUser = JSON.parse(storageUser);
      if (type === 'profile') {
        authUser.image = data.url;
      } else if (type === 'cover') {
        authUser.profileImage = data.url;
      }
      await AsyncStorage.removeItem('auth-user')
      await AsyncStorage.setItem('auth-user', JSON.stringify(authUser))
      set({ authUser: authUser })

      return data;
  },
  fetchBlockedUsers: async () => {
    const token = await AsyncStorage.getItem('auth-token')
    const storageUser = await AsyncStorage.getItem('auth-user')
    if (!token || !storageUser) {
        return
    }
    const endpoint = `${API_CONFIG.BASE_URL}/admin/user/blocked-users`;
    const headers = {
        'Authorization': `Bearer ${token}` 
    }
    const response = await fetch(endpoint, { method: 'POST', headers: headers})

    if (!response.ok) {
        const text = await response.text();
        alert(`Failed to save token: ${response.status} ${text}`);
    }
        
    const data = await response.json();
    set({ blockedUsers: data.blockedUsers });
  },
  blockUser: async (targetUserId: string) => {
    const anonymous = await getAnonymousId()
    const token = await AsyncStorage.getItem('auth-token')
    if (!token) return

    const endpoint = `${API_CONFIG.BASE_URL}/admin/user/block/${targetUserId}`;
    const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
            anonymous: anonymous
        })
    });
    const data = await response.json()
    return data
  },
  unblockUser: async (id: string) => {
    const token = await AsyncStorage.getItem('auth-token')
    const storageUser = await AsyncStorage.getItem('auth-user')
    if (!token || !storageUser) {
        return
    }

    const anonymous = await getAnonymousId();
    const response = await fetch(`${API_CONFIG.BASE_URL}/admin/user/unblock/${id}`, { 
      method: 'POST', 
      headers: { "Authorization": `Bearer ${token}` },
      body: JSON.stringify({anonymous: anonymous})
    })

    if (!response.ok) {
        const text = await response.text();
        alert(`Failed to save token: ${response.status} ${text}`);
    }
        
    set({ blockedUsers: get().blockedUsers.filter((bu) => bu.id !== id) });
  },
  resetAuthUser: () => set({ authUser: null, loading: false }),
}));
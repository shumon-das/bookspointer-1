import { create } from 'zustand';
import API_CONFIG from '../utils/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EventSource from 'react-native-sse';
import 'react-native-url-polyfill/auto'
import { useNotificationStore } from './notificationStore';

interface MercureState {
  mercureToken: string | null;
  // Store the actual instance so we can close it later
  eventSourceInstance: EventSource | null;
  isConnecting: boolean;
  setMercureToken: (token: string) => void;
  fetchMercureToken: () => Promise<string | null>;
  setupMercureHub: () => Promise<void>;
  closeMercureHub: () => void; // New cleanup action
}

export const useMercureStore = create<MercureState>((set, get) => ({
  mercureToken: null,
  eventSourceInstance: null,
  isConnecting: false,
  setMercureToken: (token: string) => set({ mercureToken: token }),
  fetchMercureToken: async () => {
    const token = await AsyncStorage.getItem('auth-token')
    if (!token) {
        console.log('user token not found')
        return null
    }
    const endpoint = `${API_CONFIG.BASE_URL}/admin/mercure-auth`;
    const headers = {
        'Authorization': `Bearer ${token}` 
    }
    const response = await fetch(endpoint, { method: 'POST', headers: headers})

    if (!response.ok) {
        const text = await response.text();
        alert(`Failed to save token: ${response.status} ${text}`);
    }
        
    const data = await response.json();
    set({ mercureToken: data.token });
    return data.token;
  },
  setupMercureHub: async () => {
    console.log('setting up mercure hub')
    if (get().eventSourceInstance) {
        console.log('Mercure is already connected. Skipping setup.');
        return;
    }
    if (get().isConnecting) {
        console.log('Connection already in progress.');
        return;
    }

    set({ isConnecting: true });

    try {
    const storageUser = await AsyncStorage.getItem('auth-user');
    if (!storageUser) {
      set({ isConnecting: false });
      return;
    }

    const user = JSON.parse(storageUser);
    let token = get().mercureToken || await get().fetchMercureToken();
    if (!token) {
      set({ isConnecting: false });
      return;
    }

    const hubUrl = new URL(API_CONFIG.MERCURE_HUB_URL);
    hubUrl.searchParams.append('topic', `user/${user.id}/messages`);
    hubUrl.searchParams.append('topic', `user/${user.id}/notifications`);

    const es = new EventSource(hubUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });

    es.addEventListener('message', (event: any) => {
      useNotificationStore.getState().onGetNewMessage(event);
    });

    es.addEventListener('error', (event: any) => {
      console.error("Mercure error:", event);
    });

    set({ eventSourceInstance: es });
    console.log('Mercure connected');

  } catch (error) {
    console.log('Mercure setup failed', error);
  } finally {
    set({ isConnecting: false });
  }

    // const storageUser = await AsyncStorage.getItem('auth-user')
    // if (!storageUser) {
    //     console.log('storage user not found')
    //     return
    // }
    // const user = JSON.parse(storageUser)
    // let token = get().mercureToken || await get().fetchMercureToken();
    // if (!token) return;

    // const hubUrl = new URL(API_CONFIG.MERCURE_HUB_URL);
    
    // // 2. Add the topics you want to listen to (must match your PHP claims)
    // hubUrl.searchParams.append('topic', `user/${user.id}/messages`);
    // hubUrl.searchParams.append('topic', `user/${user.id}/notifications`);

    // // 3. Get your token (fetch it from your /admin/mercure-auth route first)
    // const myMercureToken = token;

    // // 4. Initialize EventSource with the Authorization header
    // const es = new EventSource(hubUrl, {
    //   headers: {
    //     Authorization: `Bearer ${myMercureToken}`,
    //   },
    // });

    // es.addEventListener('message', (event: any) => {
    //   useNotificationStore.getState().onGetNewMessage(event);
    // });

    // es.addEventListener('error', (event: any) => {
    //   console.error("Mercure Connection Error:", event.message);
    // });
    
    // console.log('mercure hub seted up')
    // set({ eventSourceInstance: es });
  },
  closeMercureHub: () => {
    const es = get().eventSourceInstance;
    if (es) {
      es.removeAllEventListeners();
      es.close();
      set({ eventSourceInstance: null });
      console.log('Mercure Hub Closed');
    }
  }
}));
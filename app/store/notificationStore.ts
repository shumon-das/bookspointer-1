import { create } from 'zustand';
import API_CONFIG from '../utils/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-url-polyfill/auto'
import { useConversationStore } from './conversationStore';

interface NotificationState {
  onGetNewMessage: (message: any) => void;
  badgeCount: number,
  getNotifications: () => Promise<any>;
  getNoViewNotificationCount: () => Promise<any>;
  markAllNotificationAsRead: () => Promise<any>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  badgeCount: 0,
  onGetNewMessage: (event: any) => {
    if (event.data) {
      const data = JSON.parse(event.data);

      if (Object.keys(data).includes('mark_as_read_ids') && Array.isArray(data.mark_as_read_ids) && data.mark_as_read_ids.length > 0) {
          useConversationStore.getState().updateMarkAsRead(data)
          return;
      }

      if (Object.keys(data).includes('deleted') && data.deleted) {
        useConversationStore.getState().removeMessageFromSelectedConversation(data.id);
        return;
      }
      // if (data.conversationId) {
        useConversationStore.getState().addNewMessageToSelectedConversation(data);
      // }
      // console.log("New Mercure Update:", data);
    } else {
      console.log('No data received')
    }
  },
  getNotifications: async () => {
    const token = await AsyncStorage.getItem('auth-token');
    if (!token) {
        console.log('no token found for getNotifications')
        return null;
    }
    try {
        const endpoint = `${API_CONFIG.BASE_URL}/admin/user/notifications`;
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {'Authorization': `Bearer ${token}` },
        })
        
        const data = await response.json();
        
        return data;
    } catch (error) {
        console.log('get notification books failed ::: ', error)
        return `get notification books failed ::: ${error}`
    }
  },

  getNoViewNotificationCount: async () => {
    const token = await AsyncStorage.getItem('auth-token');
    if (!token) {
        console.log('no token found for getNotifications')
        return null;
    }
    try {
        const endpoint = `${API_CONFIG.BASE_URL}/admin/user-notifications-count`;
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {'Authorization': `Bearer ${token}` },
        })
        
        const data = await response.json();
        set({badgeCount: data.count})
        return data;
    } catch (error) {
        console.log('get notification count failed ::: ', error)
        return `get notification count failed ::: ${error}`
    }
  },

  markAllNotificationAsRead: async () => {
    const token = await AsyncStorage.getItem('auth-token');
    if (!token) {
        console.log('no token found for getNotifications')
        return null;
    }
    
    try {
        const endpoint = `${API_CONFIG.BASE_URL}/admin/mark-as-read-notifications`;
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {'Authorization': `Bearer ${token}` },
        })
        
        if (!response.ok) {
            console.log('Failed to mark notification as read', response.status, response.statusText);
        }
        
        const data = await response.json();
        set({badgeCount: data.count})
        
        return data;
    } catch (error) {
        console.log('mark all notification error: ' + error)
    }
  }
}));
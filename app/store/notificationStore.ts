import { create } from 'zustand';
import API_CONFIG from '../utils/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EventSource from 'react-native-sse';
import 'react-native-url-polyfill/auto'
import { useConversationStore } from './conversationStore';

interface NotificationState {
  onGetNewMessage: (message: any) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
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
}));
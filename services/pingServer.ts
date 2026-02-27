import AsyncStorage from '@react-native-async-storage/async-storage';
import API_CONFIG from '@/app/utils/config';
import { useConversationStore } from '@/app/store/conversationStore';

export const pingServer = async () => {
    const token = await AsyncStorage.getItem('auth-token');
    const storageUser = await AsyncStorage.getItem('auth-user');
    const user = storageUser ? JSON.parse(storageUser) : null;
    const state = useConversationStore.getState();
    const selectedConversationUserId = state.selectedConversation?.user_id;
    if (!token || !user) {
        return;
    }

    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/admin/user/ping`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: JSON.stringify({receiverId: selectedConversationUserId})
        });
        const data = await response.json();
        // {"receiverOnlineStatus": {"lastSeenAt": {"date": "2026-02-26", "time": "18:06:01"}, "status": false}, "status": "online"}
        if (Object.keys(data).includes('receiverOnlineStatus') && Object.keys(data.receiverOnlineStatus).includes('status') && selectedConversationUserId) {
            useConversationStore.setState((state) => ({
            selectedConversation: {
                    ...state.selectedConversation,
                    isOnline: data.receiverOnlineStatus.status,
                    lastSeenAt: data.receiverOnlineStatus.lastSeenAt
                }
            }));
        }
    } catch (e) {
        console.error("Ping Error:", e);
    }
}

export const lastSeenDate = (date: string) => {
  if (!date) return false;

  // 1. Create a Date object from the backend string
  const checkDate = new Date(date);
  
  // 2. Create a Date object for "Now" and strip the time
  const today = new Date();
  today.setHours(0, 0, 0, 0); 

  // 3. Compare
  return checkDate < today;
}
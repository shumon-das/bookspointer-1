import AsyncStorage from '@react-native-async-storage/async-storage';
import API_CONFIG from '@/app/utils/config';
import { useConversationStore } from '@/app/store/conversationStore';

const asOnlineBoolean = (value: unknown) =>
    value === true || value === 1 || value === '1' || value === 'true' || value === 'online';

export const pingServer = async (receiverId?: string | number) => {
    const token = await AsyncStorage.getItem('auth-token');
    const storageUser = await AsyncStorage.getItem('auth-user');
    const user = storageUser ? JSON.parse(storageUser) : null;
    const state = useConversationStore.getState();
    const selectedConversationUserId = receiverId ?? state.selectedConversation?.user_id ?? state.selectedConversation?.uuid;
    if (!token || !user) {
        return;
    }

    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/admin/user/ping`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({receiverId: selectedConversationUserId})
        });
        const responseText = await response.text();
        let data: any = {};
        if (responseText.trim()) {
            try {
                data = JSON.parse(responseText);
            } catch {
                console.warn('Ping endpoint returned a non-JSON response:', response.status);
                return;
            }
        }
        if (!response.ok) return;
        if (Object.keys(data).includes('receiverOnlineStatus') && Object.keys(data.receiverOnlineStatus).includes('status') && selectedConversationUserId) {
            useConversationStore.setState((state) => ({
            selectedConversation: {
                    ...state.selectedConversation,
                    isOnline: asOnlineBoolean(data.receiverOnlineStatus.status),
                    lastSeenAt: data.receiverOnlineStatus.lastSeenAt
                }
            }));
        }
        if (Array.isArray(data.conversationListStatus)) {
            useConversationStore.setState((state) => ({
                conversationList: state.conversationList.map((item: any) => {
                    const status = data.conversationListStatus.find((d: any) =>
                        [d.uuid, d.user_uuid, d.userUuid, d.userId, d.user_id, d.id].filter(Boolean).some((key: any) =>
                            [item.uuid, item.user_uuid, item.userUuid, item.userId, item.user_id, item.id].filter(Boolean).some((itemKey: any) => String(key) === String(itemKey)),
                        ),
                    )
                    if (status) {
                        return {
                            ...item,
                            isOnline: [status.online, status.isOnline, status.status, status.is_online].some(asOnlineBoolean),
                        };
                    }
                    return item;
                })
            }))
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

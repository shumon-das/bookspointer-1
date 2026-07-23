import { create } from 'zustand';
import API_CONFIG from '../utils/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserStore } from './userStore';
import { router } from 'expo-router';

interface ConversationState {
    conversationList: any[];
    selectedConversation: any;
    selectedConversationMessages: any[];
    conversationsListLoading: boolean;
    loading: boolean;
    sending: boolean;
    selectedEditMessage: any;
    selectedReplyMessage: any;
    fetchConversations: () => Promise<void>;
    setSelectedConversation: (conversation: any) => void;
    fetchSelectedConversationMessages: (conversationId: string) => Promise<void>;
    sendMessage: (text: string, editableMessage: any, selectReplyMessage: any) => Promise<void>;
    addNewMessageToSelectedConversation: (message: any) => void;
    updateMarkAsRead: (data: any) => void;
    deleteMessage: (messageId: string) => Promise<void>;
    editMessage: (messageId: string, text: string) => Promise<void>;
    forwardMessage: (messageId: string, text: string) => Promise<void>;
    removeMessageFromSelectedConversation: (messageId: string) => void;
    updateMessageInSelectedConversation: (messageId: string, text: string) => void;
    setSelectedEditMessage: (message: any) => void;
    setSelectedReplyMessage: (message: any) => void;
    markAsRead: (messageIds: string[]) => Promise<void>;
    redirectToChatting: (user: any) => Promise<void>;
}

export const useConversationStore = create<ConversationState>((set, get) => ({
    conversationList: [],
    selectedConversation: null,
    selectedConversationMessages: [],
    conversationsListLoading: false,
    loading: false,
    sending: false,
    selectedEditMessage: null,
    selectedReplyMessage: null,
    fetchConversations: async () => {
        const token = await AsyncStorage.getItem('auth-token')
        const storageUser = await AsyncStorage.getItem('auth-user');
        const user = storageUser ? JSON.parse(storageUser) : null;
        if (!token || !user) {
            return;
        }

        const { conversationsListLoading } = get();
        if (conversationsListLoading) return;

        set({ conversationsListLoading: true });
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/admin/user/conversation/${user.uuid}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const result = await response.json();
            if (result.status) {
                set({ conversationList: result.data });
            }
        } catch (error) {
            console.error("Failed to fetch conversations:", error);
        } finally {
            set({ conversationsListLoading: false });
        }
    },
    setSelectedConversation: (conversation: any) => {
        set({ selectedConversation: conversation });
    },
    fetchSelectedConversationMessages: async (conversationId: string) => {
        const token = await AsyncStorage.getItem('auth-token')
        const storageUser = await AsyncStorage.getItem('auth-user');
        const user = storageUser ? JSON.parse(storageUser) : null;
        if (!token || !user || !conversationId) {
            return;
        }

        set({ loading: true });

        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/admin/messages/${conversationId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const result = await response.json();
            if (result.status) {
                set({ selectedConversationMessages: result.messages, loading: false });
            }
        } catch (error) {
            console.error("Failed to fetch messages:", error);
            set({ loading: false})
        } finally {
            set({ loading: false });
        }
    },
    sendMessage: async (text: string) => {
        const storageUser = await AsyncStorage.getItem('auth-user');
        const user = storageUser ? JSON.parse(storageUser) : null;
        const jwtToken = await AsyncStorage.getItem('auth-token')
        if (!text || !jwtToken || !user || !get().selectedConversation?.uuid) {
            return;
        }
        set({ sending: true });
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/admin/messages/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwtToken}` },
                body: JSON.stringify({
                    id: get().selectedEditMessage ? get().selectedEditMessage.id : null,
                    receiverId: get().selectedConversation.uuid,
                    content: text,
                    replyId: get().selectedReplyMessage ? get().selectedReplyMessage.id : null,
                })
            });
            const result = await response.json();
            if (result.status) get().addNewMessageToSelectedConversation(result.message);
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            set({ sending: false });
        }
        get().setSelectedReplyMessage(null);
        get().setSelectedEditMessage(null);
    },
    
    addNewMessageToSelectedConversation: (message: any) => {
        if (!message.id) return;

        const user = useUserStore.getState().authUser;
        message.me = user && user.id !== message.receiverId;
        const exists = get().selectedConversationMessages.some(item => String(item.id) === String(message.id));
        const newMessages = message.isUpdate 
            ? get().selectedConversationMessages.map(item => item.id === message.id ? message : item) 
            : exists ? get().selectedConversationMessages.map(item => String(item.id) === String(message.id) ? message : item) : [message, ...get().selectedConversationMessages]
        set({ selectedConversationMessages: newMessages }) 
    },

    updateMarkAsRead: (message: {mark_as_read_ids: number[]}) => {
        set((state) => ({
            selectedConversationMessages: state.selectedConversationMessages.map((item: any) => {
                if (message.mark_as_read_ids.includes(item.id)) {
                    return { ...item, isRead: true };
                }
                return item;
            }),
        }));
    },
    deleteMessage: async (messageId: string) => {
        const token = await AsyncStorage.getItem('auth-token')
        if (!token) {
            alert('No token found')
            return;
        }

        const response = await fetch(`${API_CONFIG.BASE_URL}/admin/messages/delete/${messageId}`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` }
        })
        const result = await response.json();
        if (result.status !== false) get().removeMessageFromSelectedConversation(messageId);
    },
    removeMessageFromSelectedConversation: (messageId: string) => {
        set((state) => ({
            selectedConversationMessages: state.selectedConversationMessages.filter((item: any) => item.id !== messageId),
        }));
    },
    editMessage: async (messageId: string, text: string) => {
        const token = await AsyncStorage.getItem('auth-token')
        if (!token) {
            alert('No token found')
            return;
        }
        const response = await fetch(`${API_CONFIG.BASE_URL}/admin/messages/${messageId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ content: text })
        })
        const result = await response.json();
        if (result.status) {
            get().updateMessageInSelectedConversation(messageId, text)
        }
    },
    updateMessageInSelectedConversation: (messageId: string, text: string) => {
        set((state) => ({
            selectedConversationMessages: state.selectedConversationMessages.map((item: any) => {
                if (item.id === messageId) {
                    return { ...item, text };
                }
                return item;
            }),
        }));
    },
    forwardMessage: async (messageId: string, text: string) => {
        
    },
    setSelectedEditMessage: (message: any) => {
        set({ selectedEditMessage: message });
    },
    setSelectedReplyMessage: (message: any) => {
        set({ selectedReplyMessage: message });
    },
    markAsRead: async (messageIds: string[]) => {
        const token = await AsyncStorage.getItem('auth-token');
        if (!token) {
            console.log('No token found')
            return;
        }
        set((state) => ({
            selectedConversationMessages: state.selectedConversationMessages.map(msg => 
                messageIds.map(String).includes(String(msg.id)) ? { ...msg, isRead: true } : msg
            )
        }));
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/admin/messages/mark-read`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify({ ids: messageIds, conversationId: get().selectedConversation?.id })
            });
            const data = await response.json();   
            console.log('completed', data)
        } catch (error) {
            console.error("Failed to mark as read:", error);
        }
    },
    redirectToChatting: async (user: any) => {
        const token = await AsyncStorage.getItem('auth-token');
        if (!token) {
            console.log('No token found')
            return;
        }
        const response = await fetch(`${API_CONFIG.BASE_URL}/admin/single-conversation/${user.uuid}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const result = await response.json();
        if (result.status) {
            set({ selectedConversation: result.data });
            router.push('/screens/conversation/chatting')
        }
    }
}))

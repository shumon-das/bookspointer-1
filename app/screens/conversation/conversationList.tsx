import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect, useNavigation, useRouter } from 'expo-router';
import { useConversationStore } from '@/app/store/conversationStore';
import { useUserStore } from '@/app/store/userStore';
import API_CONFIG from '@/app/utils/config';
import { pingServer } from '@/services/pingServer';

const isOnline = (value: unknown) =>
  value === true || value === 1 || value === '1' || value === 'true' || value === 'online';

const ConversationList = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const authUser = useUserStore((state) => state.authUser);
  const conversations = useConversationStore((state) => state.conversationList);
  const loading = useConversationStore((state) => state.conversationsListLoading);
  const fetchConversations = useConversationStore((state) => state.fetchConversations);
  const setSelectedConversation = useConversationStore((state) => state.setSelectedConversation);
  const [query, setQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: true, title: 'Messages' });
  }, [navigation]);

  useFocusEffect(useCallback(() => {
    if (!authUser) return;
    const refreshStatuses = async () => {
      await fetchConversations();
      const firstConversation = useConversationStore.getState().conversationList[0];
      await pingServer(firstConversation?.uuid ?? firstConversation?.user_id ?? firstConversation?.id);
    };
    refreshStatuses();
  }, [authUser, fetchConversations]));

  const filteredConversations = useMemo(() => {
    if (!Array.isArray(conversations)) return [];
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return conversations;
    return conversations.filter((item) =>
      `${item.fullName ?? ''} ${String(item.lastMessage?.text ?? '')}`.toLowerCase().includes(normalizedQuery),
    );
  }, [conversations, query]);

  const refresh = async () => {
    setRefreshing(true);
    await fetchConversations();
    setRefreshing(false);
  };

  if (!authUser) {
    return <View style={styles.center}><Feather name="lock" size={28} color="#8B5CF6" /><Text style={styles.emptyTitle}>Sign in to view your messages</Text></View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <Feather name="search" size={18} color="#94A3B8" />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search conversations"
          placeholderTextColor="#94A3B8"
          style={styles.searchInput}
          returnKeyType="search"
        />
        {!!query && <TouchableOpacity onPress={() => setQuery('')} hitSlop={10}><Feather name="x-circle" size={18} color="#94A3B8" /></TouchableOpacity>}
      </View>
      {loading && conversations.length === 0 ? (
        <View style={styles.center}><ActivityIndicator size="large" color="#7C3AED" /><Text style={styles.muted}>Loading conversations…</Text></View>
      ) : (
        <FlatList
          data={filteredConversations}
          keyExtractor={(item, index) => String(item.id ?? item.uuid ?? index)}
          renderItem={({ item }) => {
            const unread = Number(item.unread ?? 0);
            const preview = String(item.lastMessage?.text ?? '').trim() || 'Start a conversation';
            const online = [item.isOnline, item.online, item.status, item.is_online].some(isOnline);
            return (
              <TouchableOpacity
                style={styles.conversationItem}
                activeOpacity={0.75}
                onPress={() => { setSelectedConversation(item); router.push('/screens/conversation/chatting'); }}
              >
                <View style={styles.avatarWrap}>
                  <Image source={item.image ? { uri: `${API_CONFIG.BASE_URL}/uploads/${item.image}` } : require('@/assets/images/user.png')} style={styles.avatar} />
                  <View style={[styles.onlineDot, { backgroundColor: online ? '#22C55E' : '#CBD5E1' }]} />
                </View>
                <View style={styles.conversationBody}>
                  <View style={styles.nameRow}>
                    <Text numberOfLines={1} style={[styles.name, unread > 0 && styles.unreadName]}>{item.fullName || 'Unknown user'}</Text>
                    {!!item.lastMessage?.time && <Text style={styles.time}>{item.lastMessage.time}</Text>}
                  </View>
                  <View style={styles.previewRow}>
                    <Text numberOfLines={1} style={[styles.preview, unread > 0 && styles.unreadPreview]}>{preview}</Text>
                    {unread > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{unread > 99 ? '99+' : unread}</Text></View>}
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor="#7C3AED" colors={['#7C3AED']} />}
          contentContainerStyle={filteredConversations.length === 0 ? styles.emptyList : styles.list}
          ListEmptyComponent={<View style={styles.center}><Feather name={query ? 'search' : 'message-circle'} size={32} color="#C4B5FD" /><Text style={styles.emptyTitle}>{query ? 'No matches found' : 'No conversations yet'}</Text><Text style={styles.muted}>{query ? 'Try another name or message.' : 'Messages from readers and authors will appear here.'}</Text></View>}
        />
      )}
    </View>
  );
};

export default ConversationList;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  searchBox: { flexDirection: 'row', alignItems: 'center', margin: 16, paddingHorizontal: 14, height: 46, borderRadius: 14, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E2E8F0' },
  searchInput: { flex: 1, marginHorizontal: 10, color: '#1E293B', fontSize: 15 },
  list: { paddingBottom: 24 },
  emptyList: { flexGrow: 1, paddingHorizontal: 32 },
  conversationItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 14, backgroundColor: '#FFF', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E2E8F0' },
  avatarWrap: { position: 'relative', marginRight: 13 },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#EDE9FE' },
  onlineDot: { position: 'absolute', right: 0, bottom: 1, width: 13, height: 13, borderRadius: 7, borderWidth: 2, borderColor: '#FFF' },
  conversationBody: { flex: 1, minWidth: 0 },
  nameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 },
  name: { flex: 1, color: '#1E293B', fontSize: 16, fontWeight: '600', marginRight: 8 },
  unreadName: { fontWeight: '800' },
  time: { color: '#94A3B8', fontSize: 11 },
  previewRow: { flexDirection: 'row', alignItems: 'center' },
  preview: { flex: 1, color: '#64748B', fontSize: 14 },
  unreadPreview: { color: '#334155', fontWeight: '600' },
  badge: { minWidth: 22, height: 22, borderRadius: 11, paddingHorizontal: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: '#7C3AED', marginLeft: 8 },
  badgeText: { color: '#FFF', fontSize: 11, fontWeight: '800' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { color: '#334155', fontSize: 16, fontWeight: '700', marginTop: 12, textAlign: 'center' },
  muted: { color: '#94A3B8', fontSize: 13, marginTop: 6, textAlign: 'center' },
});

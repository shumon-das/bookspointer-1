import React, { useState, useRef, useEffect, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, StatusBar, Keyboard, Image, ActivityIndicator } from 'react-native';
import { useFocusEffect, useNavigation, useRouter } from 'expo-router';
import { styles } from '@/styles/chatting.styles';
import { useConversationStore } from '@/app/store/conversationStore';
import API_CONFIG from '@/app/utils/config';
import Message from '@/components/screens/conversation/Message';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { lastSeenDate } from '@/services/pingServer';

const viewabilityConfig = {
    itemVisiblePercentThreshold: 70 // Message is "read" if 70% of it is visible
};

const Chatting = () => {
  const navigation = useNavigation();
  const router = useRouter();
  useEffect(() => navigation.setOptions({ headerShown: false }), [navigation]);
  const chatStore = useConversationStore();
  const fetchSelectedConversationMessages = useConversationStore((state) => state.fetchSelectedConversationMessages);
  useFocusEffect(useCallback(() => {
    if (chatStore.selectedConversation?.id) {
      fetchSelectedConversationMessages(chatStore.selectedConversation.id);
    }
  }, [chatStore.selectedConversation?.id, fetchSelectedConversationMessages]));

  const [inputText, setInputText] = useState(chatStore.selectedEditMessage ? chatStore.selectedEditMessage.text : '');
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const flatListRef = useRef<any>(null);
  
  useEffect(() => {
    setInputText(chatStore.selectedEditMessage ? chatStore.selectedEditMessage.text : '');
  }, [chatStore.selectedEditMessage]);

  const sendMessage = async () => {
    const text = inputText.trim();
    if (!text || chatStore.sending) return;
    await chatStore.sendMessage(text, null, null);
    setInputText('');
  };

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () =>  setKeyboardOpen(true));
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => setKeyboardOpen(false));
    
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    }
  }, []);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
      const unreadIds = viewableItems
          .filter((v: any) => !v.item.isRead && !v.item.me)
          .map((v: any) => v.item.id);

      if (unreadIds.length > 0) {
          chatStore.markAsRead(unreadIds);
      }
  }).current;

  if (!chatStore.selectedConversation) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.fallback}>
          <Text style={styles.fallbackTitle}>Conversation unavailable</Text>
          <Text style={styles.fallbackText}>Choose a conversation to start chatting.</Text>
          <TouchableOpacity style={styles.fallbackButton} onPress={() => router.back()}><Text style={styles.fallbackButtonText}>Go back</Text></TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const lastSeen = chatStore.selectedConversation.lastSeenAt;
  const lastSeenLabel = lastSeenDate(lastSeen) ? `${lastSeen.date ?? ''} ${lastSeen.time ?? ''}`.trim() : (lastSeen?.time ?? 'Offline');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} hitSlop={8}>
          <Feather name="arrow-left" size={22} color="#FFF" />
        </TouchableOpacity>
        <Image 
          style={styles.statusDot} 
          source={chatStore.selectedConversation.image 
            ? {uri: `${API_CONFIG.BASE_URL}/uploads/${chatStore.selectedConversation.image}`} 
            : require('@/assets/images/user.png')}
          />
        <View>
          <Text style={styles.headerTitle}>{chatStore.selectedConversation.fullName}</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={[styles.headerOnlineDot, { backgroundColor: chatStore.selectedConversation.isOnline ? '#86EFAC' : '#CBD5E1' }]} />
            <Text style={styles.headerSubtitle}>{chatStore.selectedConversation.isOnline ? 'Online' : `Last seen ${lastSeenLabel}`}</Text>
          </View>
        </View>
      </View>

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        style={{ flex: 1 }}
      >
        {/* Message List */}
        <FlatList
          ref={flatListRef}
          data={chatStore.selectedConversationMessages.filter((item, index, self) =>
            index === self.findIndex((b) => b.id === item.id)
          )}
          keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
          renderItem={(item) => <Message message={item.item} />}
          inverted
          contentContainerStyle={[
            styles.listContent, 
            { flexGrow: 1, justifyContent: 'flex-end' }
          ]}
          automaticallyAdjustContentInsets={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          ListEmptyComponent={chatStore.loading ? <View style={styles.emptyMessages}><ActivityIndicator size="large" color="#7C3AED" /><Text style={styles.muted}>Loading messages…</Text></View> : <View style={styles.emptyMessages}><Feather name="message-circle" size={30} color="#C4B5FD" /><Text style={styles.emptyTitle}>Start the conversation</Text><Text style={styles.muted}>Say hello and begin chatting.</Text></View>}
          style={{ flex: 1 }}
        />
        {chatStore.selectedReplyMessage && (
            <View style={styles.replyPreviewContainer}>
              <View style={styles.replyBarAccent} />
              <View style={styles.replyPreviewContent}>
                <Text style={styles.replyPreviewTitle}>
                  Replying to {chatStore.selectedReplyMessage.me ? 'yourself' : chatStore.selectedReplyMessage.fullName}
                </Text>
                <Text numberOfLines={1} style={styles.replyPreviewText}>
                  {chatStore.selectedReplyMessage.text}
                </Text>
              </View>
              <TouchableOpacity 
                onPress={() => chatStore.setSelectedReplyMessage(null)} 
                style={styles.closeReplyButton}
              >
                <Feather name="x" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          )}
        {chatStore.selectedEditMessage && <View style={styles.editPreview}><Feather name="edit-2" size={14} color="#7C3AED" /><Text style={styles.editText}>Editing message</Text><TouchableOpacity onPress={() => { chatStore.setSelectedEditMessage(null); setInputText(''); }}><Feather name="x" size={18} color="#64748B" /></TouchableOpacity></View>}
        <View style={[styles.inputContainer, {paddingBottom: !keyboardOpen ? 8 : 8}]}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={inputText}
            onChangeText={setInputText}
            placeholderTextColor="#999"
            multiline
            maxLength={2000}
            onSubmitEditing={Platform.OS === 'ios' ? undefined : sendMessage}
          />
          <TouchableOpacity disabled={!inputText.trim() || chatStore.sending} style={[styles.sendButton, (!inputText.trim() || chatStore.sending) && styles.sendButtonDisabled]} onPress={sendMessage}>
            {chatStore.sending ? <ActivityIndicator size="small" color="#FFF" /> : <MaterialIcons name="send" size={21} color="#FFF" />}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Chatting;

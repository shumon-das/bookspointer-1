import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, SafeAreaView, StatusBar, Keyboard, Image, ActivityIndicator } from 'react-native';
import { useFocusEffect, useNavigation } from 'expo-router';
import { styles } from '@/styles/chatting.styles';
import { useConversationStore } from '@/app/store/conversationStore';
import API_CONFIG from '@/app/utils/config';
import Message from '@/components/screens/conversation/Message';
import { Feather } from '@expo/vector-icons';

const viewabilityConfig = {
    itemVisiblePercentThreshold: 70 // Message is "read" if 70% of it is visible
};

const Chatting = () => {
  const navigation = useNavigation();
  useEffect(() => navigation.setOptions({ headerShown: false }), []);
  const chatStore = useConversationStore();
  useFocusEffect(useCallback(() => {
    chatStore.fetchSelectedConversationMessages(chatStore.selectedConversation.id);
  }, [chatStore.selectedConversation.id]));

  const [inputText, setInputText] = useState(chatStore.selectedEditMessage ? chatStore.selectedEditMessage.text : '');
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const flatListRef = useRef<any>(null);
  
  useEffect(() => {
    setInputText(chatStore.selectedEditMessage ? chatStore.selectedEditMessage.text : '');
  }, [chatStore.selectedEditMessage]);

  const sendMessage = async () => {
     await chatStore.sendMessage(inputText, null, null);
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Image 
          style={styles.statusDot} 
          source={chatStore.selectedConversation.image 
            ? {uri: `${API_CONFIG.BASE_URL}/uploads/${chatStore.selectedConversation.image}`} 
            : require('@/assets/images/user.png')}
          />
        <View>
          <Text style={styles.headerTitle}>{chatStore.selectedConversation.fullName}</Text>
          <Text style={styles.headerSubtitle}>Mercure Live</Text>
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
          data={chatStore.selectedConversationMessages}
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
          ListEmptyComponent={<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size="large" color="#764ba2" />
            <Text>Loading messages...</Text>
          </View>}
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
        <View style={[styles.inputContainer, {paddingBottom: !keyboardOpen ? 5 : 40}]}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={inputText}
            onChangeText={setInputText}
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Chatting;
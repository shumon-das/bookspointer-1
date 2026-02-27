import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, SafeAreaView, StatusBar, Keyboard, Image, ActivityIndicator } from 'react-native';
import { useFocusEffect, useNavigation } from 'expo-router';
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
    if (inputText.trim().length > 0) {
      await chatStore.sendMessage(inputText, null, null);
      setInputText('');  
    }
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
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={chatStore.selectedConversation.isOnline 
                ? {width: 10, height: 10, borderRadius: 5, backgroundColor: 'lightgreen'} 
                : {width: 10, height: 10, borderRadius: 5, backgroundColor: 'gray'}}></View>
            {!chatStore.selectedConversation.isOnline && <Text style={{marginLeft: 5}}>Last seen at {
              lastSeenDate(chatStore.selectedConversation?.lastSeenAt)
                    ? chatStore.selectedConversation?.lastSeenAt.date + ' ' + chatStore.selectedConversation?.lastSeenAt.time
                    : chatStore.selectedConversation?.lastSeenAt.time
            }</Text>}
            {chatStore.selectedConversation.isOnline && <Text style={{marginLeft: 5, color: 'lightgray', fontSize: 12}}>Online</Text>}
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
          ListEmptyComponent={chatStore.loading ? <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size="large" color="#764ba2" />
            <Text>Loading messages...</Text>
          </View> : <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>No messages found</Text>
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
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <MaterialIcons name="send" size={24} color="blue" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Chatting;
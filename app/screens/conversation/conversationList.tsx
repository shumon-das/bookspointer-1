import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useCallback, useState, useLayoutEffect } from 'react'
import { useFocusEffect, useNavigation, useRouter } from 'expo-router'
import { useConversationStore } from '@/app/store/conversationStore'
import { useUserStore } from '@/app/store/userStore'
import API_CONFIG from '@/app/utils/config'

const conversationList = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => { navigation.setOptions({ headerShown: true, title: 'Conversations' });}, []);
    const chatStore = useConversationStore();
    const authUser = useUserStore().authUser
    const router = useRouter();
    useFocusEffect(useCallback(() => {
      const fetchConList = async () => {
        await chatStore.fetchConversations();
      }
      fetchConList()
    }, []));

    if (!authUser) {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>Please login to continue</Text>
        </View>
      )
    }

    if (chatStore.conversationsListLoading) {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size="large" color="#764ba2" />
        </View>
      )
    }

    const message = (item: any) => {
      const shortText = item.lastMessage?.text.split(' ').slice(0, 5).join(' ');
      return shortText.length > 5 ? shortText + '...' : shortText
    }

    const renderItem = (item: any) => {
      return (<TouchableOpacity style={styles.conversationItem} onPress={() => {
            chatStore.setSelectedConversation(item)
            router.push('/screens/conversation/chatting')
          }}>
            <View style={{flexDirection: 'row', alignItems: 'center', marginHorizontal: 5}}>
              <View>
                <Image 
                  source={item.image ? {uri: `${API_CONFIG.BASE_URL}/uploads/${item.image}`} : require('@/assets/images/user.png')} 
                  style={styles.conversationImage}
                />
              </View>
              <View style={{marginHorizontal: 10}}>
                <Text style={styles.conversationName}>{item.fullName}</Text>
                <Text style={{
                  fontWeight: item.me ? 'normal' : 'bold', 
                  color: !item.me && item.unread > 0 ? '#000' : 'gray',
                  fontSize: !item.me && item.unread > 0 ? 16 : 14
                }}>
                  {message(item)}
                </Text>
              </View>
            </View>
            <View></View>
            {item.unread > 0 && <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.conversationUnreadCount}>{item.unread}</Text>
            </View>}
          </TouchableOpacity>)
    }
    
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <FlatList
        data={chatStore.conversationList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => renderItem(item)}
        contentContainerStyle={{paddingBottom: 50}}
        ListEmptyComponent={() => {
          if (chatStore.conversationsListLoading) {
            return <ActivityIndicator size="large" color="#764ba2" />
          }
          return <Text>No conversations found</Text>
        }}
        ListFooterComponent={<View style={{paddingBottom: 50}}><Text></Text></View>}
      />
    </View>
  )
}

export default conversationList

const styles = StyleSheet.create({
  conversationItem: {
    backgroundColor: '#fff',
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  conversationImage: {
    width: 40,
    height: 40,
    borderRadius: 25,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  conversationUnreadCount: {
    fontSize: 12,
    color: '#fff',
    backgroundColor: '#764ba2',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    textAlign: 'center',
  },
})
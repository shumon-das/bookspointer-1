import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation, useRouter } from 'expo-router'
import { useUserStore } from '@/app/store/userStore';
import { userImageUri } from '@/app/utils/user/imageUri';

const BlockedUsers = () => {
    const navigation = useNavigation();
    useLayoutEffect(() => { navigation.setOptions({ headerShown: true, title: 'Blocked Users' });}, []);
    const router = useRouter();
    const userStore = useUserStore();
    const [unblockingUser, setUnblockingUser] = useState(null as any)
    const [loading, setLoading] = useState(true)
    const [unblockLoading, setUnblockLoading] = useState(false)

    useEffect(() => {
      const fetchBlockedUsers = async () => {
        await userStore.fetchBlockedUsers();
        setLoading(false)
      }
      fetchBlockedUsers();
    }, [userStore.blockedUsers])

    const handleUnblock = async (user: any) => {
      setUnblockLoading(true)
      setUnblockingUser(user)
      await userStore.unblockUser(user.id);
      setUnblockLoading(false)
    }

    if (loading) {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator size="large" color="#e63946" />
            </View>
        )
    }

    if (userStore.blockedUsers.length === 0) {
        return (
            <View>
                <Text>No blocked users</Text>
            </View>
        )
    }

    const renderItem = (item: any) => {
        return (
            <View style={styles.card}>
                <TouchableOpacity onPress={() => router.push({
                  pathname: '/screens/user/visit-user',
                  params: { uuid: item.uuid }
                })}>
                  <Image source={userImageUri(item.image)} style={{width: 50, height: 50, borderRadius: 25}} />
                  <Text>{item.fullName}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.unblockButton} onPress={() => handleUnblock(item)} disabled={unblockLoading}>
                  <Text style={{color: '#e63946', fontWeight: 'bold', }}>Unblock</Text>
                  {unblockLoading && unblockingUser && unblockingUser.id === item.id && <ActivityIndicator size="small" color="#e63946" />}
                </TouchableOpacity>
              </View>
        )
    }

    return (
      <View style={{flex: 1, backgroundColor: '#f9f0eb'}}>
        <FlatList
          data={userStore.blockedUsers}
          renderItem={({ item }) => renderItem(item)}
          keyExtractor={(item) => item.id}
          ListFooterComponent={() => (
            <View style={{paddingBottom: 20, height: 100, justifyContent: 'center', alignItems: 'center'}}>
              <Text>*******</Text>
            </View>
          )}
        />
      </View>
    )
}

export default BlockedUsers

const styles = StyleSheet.create({
 card: {
  padding: 10, 
  flexDirection: 'row', 
  alignItems: 'center', 
  justifyContent: 'space-between',
  borderBottomWidth: 1,
  borderBottomColor: '#ccc',
  marginHorizontal: 10,
 },
 unblockButton: {
  borderWidth: 1, 
  paddingHorizontal: 20, 
  paddingVertical: 10, 
  borderRadius: 5,
  backgroundColor: 'rgba(230, 57, 70, 0.1)'
 }
})
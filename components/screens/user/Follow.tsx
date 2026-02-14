import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { User } from '@/components/types/User'
import { styles } from '@/styles/author.styles'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import englishNumberToBengali from '@/app/utils/englishNumberToBengali';
import labels from '@/app/utils/labels';
import API_CONFIG from '@/app/utils/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { getAnonymousId } from '@/app/utils/annonymous';
import { useUserStore } from '@/app/store/userStore';

interface FollowProps {
    author: User | null
    onFollowUnfollow: (value: boolean) => void
    onPressSearch: (value: boolean) => void,
    onTryLogin: (value: boolean) => void
}

const Follow = ({author, onFollowUnfollow, onPressSearch, onTryLogin}: FollowProps) => {
  const [isFollowing, setIsFollowing] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter();

  const fetchIsFollowingInfo = async () => {
    if (!useUserStore.getState().authUser) return
    const token = await AsyncStorage.getItem("auth-token")
    try {
      const url = `${API_CONFIG.BASE_URL}/admin/follow/status/${author?.id}`;

      const response = await fetch(url, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}`},
      }) as any

      const data = await response.json()

      setIsFollowing(data.isFollowing)
    } catch (e) {
      console.error('Follow action failed', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (author) {
      fetchIsFollowingInfo()
    }
  }, [author])

  const toggleFollow = async () => {
    if (!useUserStore.getState().authUser) {
      onTryLogin(true)
      return
    }
    if (loading) return
    onFollowUnfollow(!isFollowing)
    
    setLoading(true)
    const anonymous = await getAnonymousId()
    const token = await AsyncStorage.getItem("auth-token")
    try {
      const url = isFollowing 
          ? `${API_CONFIG.BASE_URL}/admin/follow/delete/${author?.id}`
          : `${API_CONFIG.BASE_URL}/admin/follow/${author?.id}`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`},
        body: JSON.stringify({anonymous: anonymous})
      }) as any

      const data = await response.json()

      setIsFollowing(data.isFollowing)
      if (author) {
        // await updateFollowerCount(author.id, data.followerCount)
      }
    } catch (e) {
      console.error('Follow action failed', e)
    } finally {
      setLoading(false)
    }
  }
  return (
    <View style={styles.followersCountSection}>
      <View style={[styles.followTotalBooksInfo]}>
          <View style={{}}>
              <Text style={{textAlign: 'center'}}>{ englishNumberToBengali(author ? author.totalBooks : 0)}</Text>
              <Text style={styles.followTotalBooks}>{labels.books}</Text>
          </View>
      </View>
      <View style={[styles.followersButtonFollow]}>
        <View style={styles.followAndSearch}>
          <TouchableOpacity style={styles.followSearchButton} onPress={() => onPressSearch(true)}>
            <FontAwesome name="search" style={{}} size={20} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.followButton} onPress={toggleFollow}>
            <Text style={styles.followMessageTextBtn}>{isFollowing ? "Following" : "Follow"}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.followersButtonMessage}>
        {/* <TouchableOpacity style={styles.messageButton} onPress={() => {
          router.push({pathname: '/screens/conversation/conversationList', params: {userId: author?.id}})
        }}>
          <Text style={styles.messageMessageTextBtn}>Message</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  )
}

export default Follow
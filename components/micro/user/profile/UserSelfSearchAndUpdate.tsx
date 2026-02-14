import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { User } from '@/components/types/User'
import { styles } from '@/styles/author.styles'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import englishNumberToBengali from '@/app/utils/englishNumberToBengali';
import labels from '@/app/utils/labels';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/app/store/userStore';

const UserSelfSearchAndUpdate = ({author, onPressSearch}: {author: User | null, onPressSearch: (value: boolean) => void}) => {
  const [search, setSearch] = useState(false)
  const router = useRouter()

  const onSearch = () => {
    setSearch(!search)
    onPressSearch(!search)
  }

  const onPressProfileUpdate = async () => {
    let authUser = useUserStore.getState().authUser;
    if (!authUser) {
        await useUserStore.getState().fetchAuthUserFromDb();
        authUser = useUserStore.getState().authUser;
    }
    if (!authUser) {
        router.push('/auth/login')
        return
    }
    router.push('/screens/user/settings')
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
          <TouchableOpacity style={styles.followSearchButton} onPress={onSearch}>
            <FontAwesome name="search" style={{}} size={20} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={{marginRight: 20}} onPress={onPressProfileUpdate}>
            <Feather name="settings" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default UserSelfSearchAndUpdate
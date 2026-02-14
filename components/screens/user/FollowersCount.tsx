import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { User } from '@/components/types/User'
import { styles } from '@/styles/author.styles'
import englishNumberToBengali from '@/app/utils/englishNumberToBengali'

const FollowersCount = ({author, changedValue}: {author: User | null, changedValue: boolean|null}) => {
  const [user, setUser] = useState<User | null>(null)
  const [followerCount, setFollowerCount] = useState(user?.followerCount ?? 0)

  useEffect(() => {
    setUser(author as any)
    setFollowerCount(author?.followerCount ?? 0)
  }, [author])
  useEffect(() => {
    if (null === changedValue) return
    if (changedValue) {
      setFollowerCount(followerCount + 1)
      return
    }
    if (!changedValue && followerCount > 0) {
      setFollowerCount(followerCount - 1)
    }
  }, [changedValue])
  
  return (
    <View style={styles.followersCountSection}>
      <View style={[styles.followersCountEach, {borderRightWidth: 2,borderColor: 'lightgray'}]}>
        <Text>Followers</Text>
        <Text style={{fontWeight: 'bold'}}>{englishNumberToBengali(followerCount)}</Text>
      </View>
      <View style={[styles.followersCountEach, {borderRightWidth: 2,borderColor: 'lightgray'}]}>
        <Text>Following</Text>
        <Text style={{fontWeight: 'bold'}}>{englishNumberToBengali(user?.followingCount ?? 0)}</Text>
      </View>
      <View style={styles.followersCountEach}>
        <Text>Reviews</Text>
        <Text style={{fontWeight: 'bold'}}>{englishNumberToBengali(user?.reviewCount ?? 0)}</Text>
      </View> 
    </View>
  )
}

export default FollowersCount
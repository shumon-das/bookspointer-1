import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router';
import { useUserStore } from '@/app/store/user';

const BookUpdate = () => {
  const {id, creator} = useLocalSearchParams();
  const userBooks = useUserStore((state) => state.userBooks)
  const book = userBooks.find(ub => ub.id === parseInt(id as string))

  return (
    <View>
      <Text>BookUpdate {id}</Text>
    </View>
  )
}

export default BookUpdate
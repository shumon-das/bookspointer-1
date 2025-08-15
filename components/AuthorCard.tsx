import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { User } from './types/User';
import { labels } from '@/app/utils/labels';
import { englishNumberToBengali } from '@/app/utils/englishNumberToBengali';

export default function AuthorCard(author: User) {
    const authorImg = `https://api.bookspointer.com/uploads/${author.image}`
    const router = useRouter()
  return (
    <View className='postHeader'>
        <TouchableOpacity  style={styles.postHeader} onPress={() => router.push({
            pathname: '/(tabs)/authorProfile', 
            params: { authorUuid: author.uuid }
          })}>
          <Image  source={{ uri: authorImg }} style={styles.image} />
          <View>
              <Text style={styles.userName}>{author.fullName}</Text>
              <Text style={styles.userRole}> {englishNumberToBengali(author.totalBooks)} টি {labels.book}</Text>
          </View>
        </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  postHeader: {
    flex: 1,
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "gray",
    paddingVertical: 12,
    backgroundColor: 'white',
    paddingHorizontal: 12
  },
  image: {
    width: 40, // Image width
    height: 40, // Image height
    borderRadius: 25, // Makes it circular
    marginLeft: 12,
    marginRight: 10, // Space between image and text
    paddingLeft: 16
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userRole: {
    fontSize: 14,
    color: 'gray',
  },
})

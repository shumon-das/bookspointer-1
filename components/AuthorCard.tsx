import { useRouter } from 'expo-router';
import React from 'react'
import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function AuthorCard(author: User) {
    const authorImg = `https://api.bookspointer.com/uploads/${author.image}`
    const router = useRouter()
  return (
    <View className='postHeader'>
        <TouchableOpacity  style={styles.postHeader} onPress={() => router.push({
            pathname: '/user/profile', 
            params: { authorId: author.id }
          })}>
          <Image  source={{ uri: authorImg }} style={styles.image} />
          <View>
              <Text style={styles.userName}>{author.fullName}</Text>
              <Text style={styles.userRole}>লেখক</Text>
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

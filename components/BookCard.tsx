import { labels } from '@/app/utils/labels';
import { userRole } from '@/app/utils/userRole';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import SaveButton from './micro/bookCardFooter/SaveButton';
import ShareButton from './micro/bookCardFooter/ShareButton';
import HtmlContent from './micro/HtmlContent';


interface BookCardProps {
  id: number;
  uuid: string;
  image: string;
  title: string;
  content: string;
  author: { fullName: string };
  createdBy: { fullName: string; image: string, roles: string[] };
  category: { label: string }|string;
  url: string;
}

const BookCard = ({book, snackMessage}: {book: BookCardProps, snackMessage: (value: string) => void}) => {
  const createdByImg = `https://api.bookspointer.com/uploads/${book.createdBy.image}`;
  const postImg = `https://api.bookspointer.com/uploads/${book.image}`;
  const router = useRouter();

  return (
    <View style={styles.cardBackground}>
      <View className='postHeader' style={styles.postHeader}>
        <Image  source={{ uri: createdByImg }} style={styles.image} />
        <View>
          <Text style={styles.userName}>{book.createdBy.fullName}</Text>
          <Text style={styles.userRole}>{userRole(book.createdBy.roles)}</Text>
        </View>
      </View>
      <View className='postBody' style={styles.postBodyHeader}>
         <View style={styles.postImageAndTitle}>
           <Image source={{ uri: postImg }} style={styles.postImage} />
           <View>
              <Text style={styles.postTitle}>{book.title}</Text>
              <Text style={styles.postAuthorName}>{book.author.fullName}</Text>
              <Text style={styles.postCategory}>{typeof book.category === 'string' ? book.category : book.category.label}</Text>
           </View>
         </View>
         
         <TouchableOpacity onPress={() => router.push({pathname: "/(tabs)/book/[id]", params: {id: book.id, title: book.title, author: book.author.fullName}})}>
            <ScrollView style={styles.postContent}>
              <HtmlContent content={book.content} />
            </ScrollView>
         </TouchableOpacity>
      </View>

      <View className='postFooter' style={styles.postFooter}>
        <Text>
          <FontAwesome name="heart-o" size={20} color="gray" />
        </Text>
        <Text>
          <ShareButton
            title="Check this out!"
            message={book.title}
            url={`https://bookspointer.com${book.url}`}
          />
        </Text>
        <Text>
          <SaveButton bookId={book.id} onSaveToLibrary={() => snackMessage(labels.saveBookIntoLibrary)} />
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  cardBackground: {
    backgroundColor: "white",
    marginVertical: 5,
  },
  postHeader: {
    flex: 1,
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "gray",
    marginBottom: 10,
    paddingVertical: 12,
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
    fontSize: 12,
    // color: 'gray',
  },

  postImageAndTitle: {
    flex: 1,
    flexDirection: "row",
  },

  postImage: {
    width: 70,
    height: 80,
    marginRight: 12,
  },

  postTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },

  postAuthorName: {
    fontSize: 12,
    fontWeight: "bold",
  },

  postCategory: {
    fontSize: 10,
    fontWeight: "600"
  },

  postBodyHeader: {
    paddingHorizontal: 10,
  },
  postContent: {
    paddingHorizontal: 0
  },

  postFooter: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: "space-around",
    paddingVertical: 6,
    borderTopWidth: 0.2,
    borderTopColor: "gray",
    // borderBottomWidth: 0.2,
    // borderBottomColor: "gray",
    marginBottom: 10
  }
})

export default BookCard
import { labels } from '@/app/utils/labels';
import { userRole } from '@/app/utils/userRole';
import { styles } from '@/styles/bookCard.styles';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import SaveButton from './micro/bookCardFooter/SaveButton';
import ShareButton from './micro/bookCardFooter/ShareButton';
import HtmlContent from './micro/HtmlContent';


interface BookCardProps {
  id: number;
  uuid: string;
  image: string;
  title: string;
  content: string;
  author: { id: number; fullName: string };
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
          <TouchableOpacity onPress={() => router.push({pathname: "/(tabs)/profile", params: {authorId: book.author.id}})}>
            <Text style={styles.userName}>{book.createdBy.fullName}</Text>
          </TouchableOpacity>
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

export default BookCard
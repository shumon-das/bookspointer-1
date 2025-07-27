import { labels } from '@/app/utils/labels';
import { userRole } from '@/app/utils/userRole';
import { styles } from '@/styles/bookCard.styles';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import AudioBookButton from './micro/bookCardFooter/AudioBookButton';
import DownloadButton from './micro/bookCardFooter/DownloadButton';
import ShareButton from './micro/bookCardFooter/ShareButton';
import DefaultPostImage from './micro/DefaultPostImage';
import HtmlContent from './micro/HtmlContent';
import { BookCardProps } from './types/BookCard';


const BookCard = ({book, snackMessage}: {book: BookCardProps, snackMessage: (value: string) => void}) => {
  const createdByImg = `https://api.bookspointer.com/uploads/${book.createdBy.image}`;
  const postImg = `https://api.bookspointer.com/uploads/${book.image}`;
  const router = useRouter();

  return (
    <View style={styles.cardBackground} key={book.id}>
      <View className='postHeader' style={styles.postHeader}>
        <Image  source={{ uri: createdByImg }} style={styles.image} />
        <View>
          {/* <TouchableOpacity onPress={() => router.push({pathname: "/(tabs)/userProfile", params: {authorId: book.createdBy.id}})}> */}
            <Text style={styles.userName}>{book.createdBy.fullName}</Text>
          {/* </TouchableOpacity> */}
          <Text style={styles.userRole}>{userRole(book.createdBy.roles)}</Text>
        </View>
      </View>
      <View className='postBody' style={styles.postBodyHeader}>
         <View style={styles.postImageAndTitle}>
           {/* <Image source={{ uri: postImg }} style={styles.postImage} /> */}
           {/* <Image source={require('../assets/images/default_post_image.jpg')} style={styles.postImage} /> */}
           <DefaultPostImage book={book} />
           <View>
              <Text style={styles.postTitle}>{book.title}</Text>
              <Text style={styles.postAuthorName}>{book.author.fullName}</Text>
              <Text style={styles.postCategory}>{typeof book.category === 'string' ? book.category : book.category.label}</Text>
           </View>
         </View>
         
         <TouchableOpacity onPress={() => router.push({pathname: "/(tabs)/book/details", params: {id: book.id, title: book.title, author: book.author.fullName}})}>
            <HtmlContent content={book.content} />
         </TouchableOpacity>
      </View>

      <View className='postFooter' style={styles.postFooter}>
        <Text>
          <DownloadButton bookId={book.id} title={book.title} author={book.author.fullName} uuid={book.uuid} onDownloaded={() => snackMessage(labels.downloadedAlready)}/>
        </Text>
        <Text>
          <ShareButton
            title="Check this out!"
            message={book.title}
            url={`https://bookspointer.com${book.url}`}
          />
        </Text>
        <Text>
          <AudioBookButton book={book} onClickToPlay={() => snackMessage(labels.audioBookNotAvailable)} />
          {/* <SaveButton bookId={book.id} onSaveToLibrary={() => snackMessage(labels.saveBookIntoLibrary)} /> */}
        </Text>
      </View>
    </View>
  )
}

export default BookCard
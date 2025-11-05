import { labels } from '@/app/utils/labels';
import { userRole } from '@/app/utils/userRole';
import { styles } from '@/styles/bookCard.styles';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import SaveButton from './micro/bookCardFooter/SaveButton';
import ShareButton from './micro/bookCardFooter/ShareButton';
import HtmlContent from './micro/HtmlContent';
import AudioBookButton from './micro/bookCardFooter/AudioBookButton';
import DownloadButton from './micro/bookCardFooter/DownloadButton';
import DefaultPostImage from './micro/DefaultPostImage';
import PopoverExample from './Popover';


interface BookCardProps {
  id: number;
  uuid: string;
  image: string;
  title: string;
  content: string;
  author: { id: number; uuid: string; image: string; fullName: string };
  createdBy: { id: number; fullName: string; image: string, roles: string[] };
  category: { label: string }|string;
  url: string;
}

const BookCard = ({book, snackMessage, backurl}: {book: BookCardProps, snackMessage: (value: string) => void, backurl: string}) => {
  const createdByImg = `https://api.bookspointer.com/uploads/${book.createdBy.image}`;
  const postImg = `https://api.bookspointer.com/uploads/${book.image}`;
  const router = useRouter();

  return (
    <View style={styles.cardBackground} key={book.id}>
      <View className='postHeader' style={styles.postHeader}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image  source={{ uri: createdByImg }} style={styles.image} />
          <View>
            {/* <TouchableOpacity onPress={() => router.push({pathname: "/(tabs)/userProfile", params: {authorId: book.createdBy.id}})}> */}
              <Text style={styles.userName}>{book.createdBy.fullName}</Text>
            {/* </TouchableOpacity> */}
            <Text style={styles.userRole}>{userRole(book.createdBy.roles)}</Text>
          </View>
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity style={{paddingRight: 20}} onPress={() => router.push({pathname: '/screens/book/write-book', params: {bookuuid: book.uuid}})}>
            {/* <FontAwesome name="ellipsis-v" size={24} color="gray" /> */}
            <PopoverExample menues={[
              {label: 'Edit', onPressed: {pathname: "/screens/book/write-book", params: { bookuuid: book.uuid, }}}
            ]} />
          </TouchableOpacity>
        </View>
        
      </View>
      <TouchableOpacity style={styles.postBodyHeader} onPress={() => router.push({pathname: "/(tabs)/book/details", params: {id: book.id, title: book.title, author: book.author.fullName}})}>
      {/* <View className='postBody' style={styles.postBodyHeader}> */}
         <View style={styles.postImageAndTitle}>
           {/* <Image source={{ uri: postImg }} style={styles.postImage} /> */}
           {/* <Image source={require('../assets/images/default_post_image.jpg')} style={styles.postImage} /> */}
           <DefaultPostImage book={book} />
           <View style={{marginTop: 10}}>
              <Text style={styles.postTitle}>{book.title}</Text>
              <Text style={styles.postAuthorName}>{book.author.fullName}</Text>
              <Text style={styles.postCategory}>{typeof book.category === 'string' ? book.category : book.category.label}</Text>
           </View>
         </View>
         
         <TouchableOpacity onPress={() => router.push({pathname: "/(tabs)/book/details", params: {
            id: book.id, 
            title: book.title, 
            author: book.author.fullName,
            content: null,
            isQuote: 'no',
            backurl: backurl
          }})}>
            <HtmlContent content={book.content} />
         </TouchableOpacity>
      {/* </View> */}
      </TouchableOpacity>

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
          <AudioBookButton bookId={book.id} onClickToPlay={() => snackMessage(labels.audioBookNotAvailable)} />
          {/* <SaveButton bookId={book.id} onSaveToLibrary={() => snackMessage(labels.saveBookIntoLibrary)} /> */}
        </Text>
      </View>
    </View>
  )
}

export default BookCard
import { labels } from '@/app/utils/labels';
import { userRole } from '@/app/utils/userRole';
import { styles } from '@/styles/bookCard.styles';
import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import SaveButton from './micro/bookCardFooter/SaveButton';
import ShareButton from './micro/bookCardFooter/ShareButton';
import HtmlContent from './micro/HtmlContent';
import AudioBookButton from './micro/bookCardFooter/AudioBookButton';
import DownloadButton from './micro/bookCardFooter/DownloadButton';
import DefaultPostImage from './micro/DefaultPostImage';
import PopOver from './micro/PopOver';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


interface BookCardProps {
  id: number;
  uuid: string;
  image: string;
  title: string;
  content: string;
  author: { id: number; uuid: string; image: string; fullName: string };
  createdBy: { id: number; uuid: string; fullName: string; image: string, roles: string[] };
  category: { label: string }|string;
  url: string;
}

const BookCard = ({book, snackMessage, backurl}: {book: BookCardProps, snackMessage: (value: string) => void, backurl: string}) => {
  const createdByImg = `https://api.bookspointer.com/uploads/${book.createdBy.image}`;
  const router = useRouter();
  const [loggedInUser, setLoggedInuUer] = React.useState<{ uuid: string }|null>(null);

  const popoverIcon = <FontAwesome name="ellipsis-v" size={24} color="gray" />
  const popoverMenus = [
    {label: 'Edit'}
  ];
  const popoverAction = (item: any) => { 
    if ('edit' === item.item.label.toLowerCase()) {
      router.push({pathname: "/screens/book/write-book", params: { bookuuid: book.uuid, }});
    }
  }

  useFocusEffect(
    useCallback(() => {
      const loadUserAndToken = async () => {
          const storedUser = await AsyncStorage.getItem('auth-user');
          const loggedInUser = storedUser ? JSON.parse(storedUser) : null
            setLoggedInuUer(loggedInUser);
      };
      loadUserAndToken();
    }, [])
  );

  return (
    <View style={styles.cardBackground} key={book.id}>
      <View className='postHeader' style={styles.postHeader}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity onPress={() => router.push({pathname: "/screens/user/userProfile", params: {useruuid: book.createdBy.uuid}})}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image  source={{ uri: createdByImg }} style={styles.image} />
              <View>
                  <Text style={styles.userName}>{book.createdBy.fullName}</Text>
                <Text style={styles.userRole}>{userRole(book.createdBy)}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          { loggedInUser && loggedInUser.uuid === book.createdBy.uuid &&
             (<PopOver icon={popoverIcon} menus={popoverMenus} action={popoverAction} />)
          }
        </View>
        
      </View>
      <TouchableOpacity style={styles.postBodyHeader} onPress={() => router.push({pathname: "/(tabs)/book/details", params: {id: book.id, title: book.title, author: book.author.fullName}})}>
         <View style={styles.postImageAndTitle}>
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
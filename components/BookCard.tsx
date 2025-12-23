import { labels } from '@/app/utils/labels';
import { userRole } from '@/app/utils/userRole';
import { styles } from '@/styles/bookCard.styles';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import ShareButton from './micro/bookCardFooter/ShareButton';
import HtmlContent from './micro/HtmlContent';
import AudioBookButton from './micro/bookCardFooter/AudioBookButton';
import DownloadButton from './micro/bookCardFooter/DownloadButton';
import PopOver from './micro/PopOver';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { redirectToUserProfile } from '@/helper/userRedirection';
import { useAuthStore } from '@/app/store/auth';
import AddToLibrary from './micro/bookCardFooter/AddToLibraryButton';
import Entypo from '@expo/vector-icons/Entypo';


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
  const [loggedInUser, setLoggedInUser] = React.useState<{ uuid: string }|null>(null);
  const { user } = useAuthStore();
  const authStore = useAuthStore();

  const popoverIcon = <FontAwesome name="ellipsis-v" size={24} color="gray" />
  const popoverMenus = loggedInUser && loggedInUser.uuid === book.createdBy.uuid ? [
    {label: 'Edit'},
    {label: `রিপোর্ট (Report)`},
    {label: `ব্লক করুন (Block)`},
  ] : [
    {label: `রিপোর্ট (Report)`},
    {label: `ব্লক করুন (Block)`},
  ];

  const popoverAction = (item: any) => { 
    if ('edit' === item.item.label.toLowerCase()) {
      if (loggedInUser && loggedInUser.uuid === book.createdBy.uuid) {
        router.push({pathname: "/screens/book/write-book", params: { bookuuid: book.uuid, }})
      } else {
        alert(labels.pleaseLoginToContinue)
      }
    }

    if ('রিপোর্ট (report)' === item.item.label.toLowerCase()) {
      if (loggedInUser) {
        router.push({pathname: "/screens/report/report-post", params: { targetPost: book.id, targetUser: book.createdBy.id, title: book.title }});
      } else {
        alert(labels.pleaseLoginToContinue)
      }
    }

    if ('ব্লক করুন (block)' === item.item.label.toLowerCase()) {
      if (loggedInUser) {
        router.push({pathname: "/screens/block/block-user", params: { id: book.createdBy.id, username: book.createdBy.fullName, }});
      } else {
        alert(labels.pleaseLoginToContinue)
      }
    }
  }
  
  useEffect(() => {
    const loadLoggedInUser = async () => {
        const storedUser = await AsyncStorage.getItem('auth-user');
        setLoggedInUser(storedUser ? JSON.parse(storedUser) : null);
    }

    loadLoggedInUser()
  }, [user]);

  return (
    <View style={styles.cardBackground} key={book.id}>
      <View className='postHeader' style={styles.postHeader}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity onPress={() => redirectToUserProfile(book.createdBy.uuid, router, authStore)}>
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
          {/* { loggedInUser && loggedInUser.uuid === book.createdBy.uuid && */}
             <PopOver icon={popoverIcon} menus={popoverMenus} action={popoverAction} />
          {/* } */}
        </View>
        
      </View>
      <TouchableOpacity style={{}} onPress={() => router.push({pathname: "/screens/book/details", params: {
        id: book.id, 
        title: book.title, 
        author: book.author.fullName,
        content: null,
        isQuote: 'no',
        backurl: backurl
      }})}>
         <View style={styles.postImageAndTitle}>
           {/* {!book.content.includes('<img src=') && <DefaultPostImage book={book} />} */}
           <View style={{width: '11%', marginTop: 10, marginLeft: 5}}>
              <Entypo name="open-book" size={40} color="black" style={{transform: [{ rotate: '18deg' }]}} />
           </View>
           <View style={{width: '87%', marginTop: 10, marginLeft: 5}}>
              <Text style={styles.postTitle}>{book.title}</Text>
              <Text style={styles.postAuthorName}>{book.author.fullName}</Text>
              <Text style={styles.postCategory}>{typeof book.category === 'string' ? book.category : book.category.label}</Text>
           </View>
         </View>
          
         <HtmlContent content={book.content} />
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
          <AddToLibrary book={book} />
        </Text>
        <Text>
          <AudioBookButton bookId={book.id} onClickToPlay={() => snackMessage(labels.audioBookNotAvailable)} />
        </Text>
      </View>
    </View>
  )
}

export default React.memo(BookCard)
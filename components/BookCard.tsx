import { useUserStore } from '@/app/store/userStore';
import { labels } from '@/app/utils/labels';
import { userRole } from '@/app/utils/userRole';
import { styles } from '@/styles/bookCard.styles';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import AddToLibrary from './micro/bookCardFooter/AddToLibraryButton';
// import AudioBookButton from './micro/bookCardFooter/AudioBookButton';
import DownloadButton from './micro/bookCardFooter/DownloadButton';
import ShareButton from './micro/bookCardFooter/ShareButton';
import PopOver from './micro/PopOver';
import TextContent from './screens/book/TextContent';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useReviewStore } from '@/app/store/reviewStore';
import { useBookDetailsStore } from '@/app/store/bookDetailsStore';
import englishNumberToBengali from '@/app/utils/englishNumberToBengali';
import { Foundation } from '@expo/vector-icons';

interface BookCardProps {
  id: number;
  uuid: string;
  image: string;
  title: string;
  content: string;
  author: { id: number; uuid: string; image: string; fullName: string };
  createdBy: { id: number; uuid: string; fullName: string; image: string, roles: string[] };
  category: { label: string } | string;
  url: string;
  reviewcount: number;
}

const BookCard = ({ book, snackMessage, backurl }: { book: BookCardProps, snackMessage: (value: string) => void, backurl: string}) => {
  const createdByImg = `https://api.bookspointer.com/uploads/${book.createdBy.image}`;
  const router = useRouter();
  const [loggedInUser, setLoggedInUser] = React.useState<{ uuid: string } | null>(useUserStore.getState().authUser);

  const popoverIcon = <MaterialIcons name="more-vert" size={24} color="black" />
  const popoverMenus = loggedInUser && loggedInUser.uuid === book.createdBy.uuid ? [
    { label: 'Edit', icon: <FontAwesome name="edit" size={18} color="black" /> },
  ] : [
    { label: `রিপোর্ট (Report)`, icon: <MaterialIcons name="report" size={18} color="black" /> },
    { label: `ব্লক করুন (Block)`, icon: <FontAwesome name="ban" size={18} color="black" /> },
  ];

  const popoverAction = (item: any) => {
    if ('edit' === item.label.toLowerCase()) {
      if (loggedInUser && loggedInUser.uuid === book.createdBy.uuid) {
        router.push({ pathname: "/screens/book/write-book", params: { bookuuid: book.uuid, id: book.id } })
      } else {
        alert(labels.pleaseLoginToContinue)
      }
    }

    if ('রিপোর্ট (report)' === item.label.toLowerCase()) {
      if (loggedInUser) {
        router.push({ pathname: "/screens/report/report-post", params: { targetPost: book.id, targetUser: book.createdBy.id, title: book.title } });
      } else {
        alert(labels.pleaseLoginToContinue)
      }
    }

    if ('ব্লক করুন (block)' === item.label.toLowerCase()) {
      if (loggedInUser) {
        router.push({ pathname: "/screens/block/block-user", params: { id: book.createdBy.id, username: book.createdBy.fullName, } });
      } else {
        alert(labels.pleaseLoginToContinue)
      }
    }
  }

  // useEffect(() => {
  //   let authUser = userStore.authUser;
  //   if (!authUser) {
  //     userStore.fetchAuthUserFromDb();
  //     authUser = userStore.authUser;
  //   }
  //   setLoggedInUser(authUser);
  // }, [userStore.authUser]);

  return (
    <View style={styles.cardBackground} key={book.id}>
      <View className='postHeader' style={styles.postHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => router.push({
            pathname: useUserStore.getState().authUser && useUserStore.getState()?.authUser?.uuid === book.createdBy.uuid ? '/screens/user/user-profile' : '/screens/user/visit-user',
            params: { uuid: book.createdBy.uuid }
          })}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={{ uri: createdByImg }} style={styles.image} />
              <View>
                <Text style={styles.userName}>{book.createdBy.fullName}{useUserStore.getState().authUser && useUserStore.getState()?.authUser?.uuid === book.createdBy.uuid ? ' (You)' : ''}</Text>
                <Text style={styles.userRole}>{userRole(book.createdBy)}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 }}>
          {/* { loggedInUser && loggedInUser.uuid === book.createdBy.uuid && */}
          <PopOver icon={popoverIcon} menus={popoverMenus} action={popoverAction} />
          {/* } */}
        </View>

      </View>
      <TouchableOpacity style={{}} onPress={() => {
        useBookDetailsStore.getState().setSelectedBook(book);
        router.push({
          pathname: "/screens/book/details", params: {
            id: book.id,
            title: book.title,
            author: book.author.fullName,
            content: null,
            isQuote: 'no',
            backurl: backurl
          }
        })}}>
        <View style={styles.postImageAndTitle}>
          {/* {!book.content.includes('<img src=') && <DefaultPostImage book={book} />} */}
          <View style={{ width: '11%', marginTop: 10, marginLeft: 5 }}>
            <Entypo name="open-book" size={40} color="black" style={{ transform: [{ rotate: '18deg' }] }} />
          </View>
          <View style={{ width: '87%', marginTop: 10, marginLeft: 5 }}>
            <Text style={styles.postTitle}>{book.title}</Text>
            <Text style={styles.postAuthorName}>{book.author.fullName}</Text>
            <Text style={styles.postCategory}>{typeof book.category === 'string' ? book.category : book.category.label}</Text>
          </View>
        </View>

        <View style={{ padding: 10 }}><TextContent content={book.content} fontSize={15} /></View>
      </TouchableOpacity>

      <View className='postFooter' style={styles.postFooter}>
        <Text>
          <DownloadButton bookId={book.id} title={book.title} author={book.author.fullName} uuid={book.uuid} onDownloaded={() => snackMessage(labels.downloadedAlready)} />
        </Text>
        <Text>
          <ShareButton title="Check this out!" message={book.title} url={`https://bookspointer.com${book.url}`} />
        </Text>
        <Text>
          <AddToLibrary book={book} />
        </Text>
        <Text>
          {/* <AudioBookButton bookId={book.id} onClickToPlay={() => snackMessage(labels.audioBookNotAvailable)} /> */}
          <TouchableOpacity onPress={() => {
            useReviewStore.getState().setSelectedBook(book);
            setTimeout(() => {
              router.push({ pathname: "/screens/book/single-book-reviews" });
            }, 50);
          }}>
            <Text style={{textAlign: 'center'}}><Foundation name="comment-quotes" size={18} color="gray" /></Text>
            <Text style={{ color: '#282C35', fontSize: 10 }}>{englishNumberToBengali(book.reviewcount)} {labels.review}</Text>
          </TouchableOpacity>
        </Text>
      </View>
    </View>
  )
}

export default React.memo(BookCard)
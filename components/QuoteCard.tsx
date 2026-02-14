import { quoteThemes } from '@/app/utils/QuoteThemes';
import { userRole } from '@/app/utils/userRole';
import { styles } from '@/styles/bookCard.styles';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
// import DownloadButton from './micro/bookCardFooter/DownloadButton';
import useCategoryStore from '@/app/store/categories';
import { useUserStore } from '@/app/store/userStore';
import { QuoteStyles } from '@/styles/quoteCard.styles';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import ShareButton from './micro/bookCardFooter/ShareButton';
import PopOver from './micro/PopOver';
import QuoteContent from './micro/QuoteContent';


interface BookCardProps {
  id: number;
  uuid: string;
  image: string;
  title: string;
  content: string;
  author: { id: number; fullName: string };
  createdBy: { id: number; uuid: string; fullName: string; image: string, roles: string[] };
  category: { label: string } | string;
  url: string;
  seriesName: string;
}


const QuoteCard = React.memo(({ book, snackMessage }: { book: BookCardProps, snackMessage: (value: string) => void }) => {
  const createdByImg = !book || !book.createdBy ? '' : `https://api.bookspointer.com/uploads/${book.createdBy.image}`;
  const router = useRouter();
  const userStore = useUserStore();

  const randomThemeIndex = Math.floor(Math.random() * quoteThemes.length);

  const popoverIcon = <FontAwesome name="ellipsis-v" size={24} color="gray" />
  const popoverMenus = [
    { label: 'Edit' }
  ];
  const popoverAction = (item: any) => {
    if ('edit' === item.item.label.toLowerCase()) {
      useCategoryStore.getState().setCategoryTab(book.category)
      router.push({ pathname: "/screens/book/create-ethernal-word", params: { bookuuid: book.uuid, } });
    }
  }

  if (!book) {
    return (
      <View>
        <Text>Error: Book data is missing</Text>
      </View>
    )
  }

  return (
    <View style={styles.cardBackground} key={book.id}>
      <View className='postHeader' style={QuoteStyles.postHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => router.push({
            pathname: userStore.authUser && userStore.authUser.uuid === book.createdBy.uuid ? '/screens/user/user-profile' : '/screens/user/visit-user',
            params: { uuid: book.createdBy.uuid }
          })}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={{ uri: createdByImg }} style={styles.image} />
              <View>
                <Text style={styles.userName}>{book.createdBy.fullName}</Text>
                <Text style={styles.userRole}>{userRole(book.createdBy)}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {userStore.authUser && userStore.authUser.uuid === book.createdBy.uuid &&
            (<PopOver icon={popoverIcon} menus={popoverMenus} action={popoverAction} />)
          }
        </View>
      </View>
      <View className='postBody' style={[QuoteStyles.card, { backgroundColor: quoteThemes[randomThemeIndex].backgroundColor, }]}>
        <Text style={[QuoteStyles.quote, { color: quoteThemes[randomThemeIndex].textColor }]}>
          {book && book.content ? <QuoteContent content={book.content} /> : ''}
        </Text>
        <Text style={[QuoteStyles.author, { color: quoteThemes[randomThemeIndex].authorColor }]}>{book.seriesName}</Text>
      </View>

      <View className='postFooter' style={styles.postFooter}>
        <Text>
          {/* <DownloadButton bookId={book.id} title={book.title} author={book.author.fullName} uuid={book.uuid} onDownloaded={() => snackMessage(labels.downloaded)}/> */}
        </Text>
        <Text>
          <ShareButton
            title="Check this out!"
            message={book.title}
            url={`https://bookspointer.com${book.url}`}
          />
        </Text>
        <Text>
          {/* <SaveButton bookId={book.id} onSaveToLibrary={() => snackMessage(labels.saveBookIntoLibrary)} /> */}
        </Text>
      </View>
    </View>
  )
})

export default React.memo(QuoteCard)
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
import { stripHtmlTags } from '@/app/utils/htmlNormalizer';
import { Foundation } from '@expo/vector-icons';
import { useReviewStore } from '@/app/store/reviewStore';
import labels from '@/app/utils/labels';
import englishNumberToBengali from '@/app/utils/englishNumberToBengali';


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


const QuoteCard = React.memo(({ book, snackMessage, compact = false }: { book: BookCardProps, snackMessage: (value: string) => void, compact?: boolean }) => {
  const createdByImg = !book || !book.createdBy ? '' : `https://api.bookspointer.com/uploads/${book.createdBy.image}`;
  const router = useRouter();
  const userStore = useUserStore();

  const themeIndex = Math.abs(book?.id ?? 0) % quoteThemes.length;

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
      <View className='postBody' style={[QuoteStyles.card, { backgroundColor: quoteThemes[themeIndex].backgroundColor, }]}>
        <Text style={[QuoteStyles.quote, { color: quoteThemes[themeIndex].textColor }]}>
          {book && book.content ? (compact ? <Text numberOfLines={6}>{stripHtmlTags(book.content)}</Text> : <QuoteContent content={book.content} />) : ''}
        </Text>
        <Text style={[QuoteStyles.author, { color: quoteThemes[themeIndex].authorColor }]}>{book.seriesName}</Text>
      </View>

      <View className='postFooter' style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingVertical: 2, borderTopWidth: 0.2, borderTopColor: "gray" }}>
        <Text>
          {/* <DownloadButton bookId={book.id} title={book.title} author={book.author.fullName} uuid={book.uuid} onDownloaded={() => snackMessage(labels.downloaded)}/> */}
        </Text>
        <Text style={{marginRight: 15}}>
          <ShareButton
            title="Check this out!"
            message={book.title}
            url={`https://bookspointer.com${book.url}`}
          />
        </Text>
        <Text style={{marginRight: 15}}>
          {/* <SaveButton bookId={book.id} onSaveToLibrary={() => snackMessage(labels.saveBookIntoLibrary)} /> */}
          <TouchableOpacity onPress={() => { useReviewStore.getState().setSelectedBook(book); router.push({ pathname: '/screens/book/single-book-reviews' }); }}>
            <Text style={styles.reviewIcon}><Foundation name="comment-quotes" size={14} color="gray" /></Text>
            <Text style={styles.reviewText}>{englishNumberToBengali((book as any).reviewcount ?? 0)} {labels.review}</Text>
          </TouchableOpacity>
        </Text>
      </View>
    </View>
  )
})

export default React.memo(QuoteCard)
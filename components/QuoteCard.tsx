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
import { category } from '@/app/utils/bookCard';
import { useSystemStore } from '@/app/store/systemStore';


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
  const lang = useSystemStore((state) => state.lang);
  const categoryName = category(book, lang);

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
        {book && book.content ? (compact ?
          <Text style={[QuoteStyles.quote, { color: quoteThemes[themeIndex].textColor }]} numberOfLines={6}>
            {stripHtmlTags(book.content)}
          </Text> :
          <QuoteContent content={book.content} />
        ) : null}
        <Text style={[QuoteStyles.author, { color: quoteThemes[themeIndex].authorColor }]}>{book.seriesName}</Text>
        {!!categoryName && <Text style={[QuoteStyles.category, { color: quoteThemes[themeIndex].authorColor }]}>{categoryName}</Text>}
      </View>

      <View className="postFooter" style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center", paddingHorizontal: 12, paddingVertical: 4, borderTopWidth: 0.5, borderTopColor: "#e6e6e6" }}>
        <View style={{ width: 72, alignItems: "center" }}>
          <ShareButton title="Check this out!" message={book.title} url={"https://bookspointer.com" + book.url} iconColor="#8a8a8a" style={{ width: "100%", alignItems: "center" }} />
        </View>
        <View style={{ width: 72, alignItems: "center", marginLeft: 8 }}>
          <TouchableOpacity style={{ width: "100%", alignItems: "center" }} onPress={() => { useReviewStore.getState().setSelectedBook(book); router.push({ pathname: "/screens/book/single-book-reviews" }); }}>
            <Text style={styles.reviewIcon}><Foundation name="comment-quotes" size={12} color="#8a8a8a" /></Text>
            <Text style={styles.reviewText}>{englishNumberToBengali((book as any).reviewcount ?? 0)} {labels.review}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
})

export default React.memo(QuoteCard)
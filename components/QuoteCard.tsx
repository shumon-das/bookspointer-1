import { quoteThemes } from '@/app/utils/QuoteThemes';
import { styles } from '@/styles/bookCard.styles';
import { labels } from '@/app/utils/labels';
import { userRole } from '@/app/utils/userRole';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import DownloadButton from './micro/bookCardFooter/DownloadButton';
import SaveButton from './micro/bookCardFooter/SaveButton';
import ShareButton from './micro/bookCardFooter/ShareButton';
import HtmlContent from './micro/HtmlContent';
import QuoteContent from './micro/QuoteContent';
import { redirectToUserProfile } from '@/helper/userRedirection';
import useAuthStore from '@/app/store/auth';
import { useUseEffect } from '@/helper/setHeaderOptions';
import PopOver from './micro/PopOver';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import useCategoryStore from '@/app/store/categories';



interface BookCardProps {
  id: number;
  uuid: string;
  image: string;
  title: string;
  content: string;
  author: { id: number; fullName: string };
  createdBy: { id: number; uuid: string; fullName: string; image: string, roles: string[] };
  category: { label: string }|string;
  url: string;
  seriesName: string;
}


const QuoteCard = React.memo(({book, snackMessage}: {book: BookCardProps, snackMessage: (value: string) => void}) => {
  const createdByImg = !book || !book.createdBy ? '' : `https://api.bookspointer.com/uploads/${book.createdBy.image}`;
  const router = useRouter();
  const authStore = useAuthStore();
  const {user} = useAuthStore();
  const loggedInUser = useUseEffect(user)
  
  const randomThemeIndex = Math.floor(Math.random() * quoteThemes.length);

  const popoverIcon = <FontAwesome name="ellipsis-v" size={24} color="gray" />
  const popoverMenus = [
    {label: 'Edit'}
  ];
  const popoverAction = (item: any) => { 
    if ('edit' === item.item.label.toLowerCase()) {
      useCategoryStore.getState().setCategoryTab(book.category)
      router.push({pathname: "/screens/book/create-ethernal-word", params: { bookuuid: book.uuid, }});
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
          { loggedInUser && loggedInUser.uuid === book.createdBy.uuid &&
             (<PopOver icon={popoverIcon} menus={popoverMenus} action={popoverAction} />)
          }
        </View>
      </View>
      <View className='postBody' style={[QuoteStyles.card, {backgroundColor: quoteThemes[randomThemeIndex].backgroundColor,}]}>
          <Text style={[QuoteStyles.quote, {color: quoteThemes[randomThemeIndex].textColor}]}>
            { book && book.content ? <QuoteContent content={book.content} /> : '' }
          </Text>
          <Text style={[QuoteStyles.author, {color: quoteThemes[randomThemeIndex].authorColor}]}>{book.seriesName}</Text>
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

const QuoteStyles = StyleSheet.create({
  card: {
    padding: 20,
    minHeight: 200,
  },
  postHeader: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      borderBottomWidth: 0.5,
      borderBottomColor: "gray",
      paddingVertical: 12,
    },
  quote: {
    fontSize: 20,
    fontStyle: 'italic',
    lineHeight: 28,
  },
  author: {
    marginTop: 12,
    fontSize: 16,
    textAlign: 'right',
  },
});


export default QuoteCard
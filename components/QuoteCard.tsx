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


interface BookCardProps {
  id: number;
  uuid: string;
  image: string;
  title: string;
  content: string;
  author: { id: number; fullName: string };
  createdBy: { id: number; fullName: string; image: string, roles: string[] };
  category: { label: string }|string;
  url: string;
  seriesName: string;
}


const QuoteCard = React.memo(({book, snackMessage}: {book: BookCardProps, snackMessage: (value: string) => void}) => {
  const createdByImg = !book || !book.createdBy ? '' : `https://api.bookspointer.com/uploads/${book.createdBy.image}`;
  const router = useRouter();
  const randomThemeIndex = Math.floor(Math.random() * quoteThemes.length);

  if (!book) {
    return (
      <View>
        <Text>Error: Book data is missing</Text>
      </View>
    )
  } 

  return (
    <View style={styles.cardBackground} key={book.id}>
      <View className='postHeader' style={styles.postHeader}>
        <Image  source={{ uri: createdByImg }} style={styles.image} />
        <View>
          <TouchableOpacity onPress={() => router.navigate({pathname: "/(tabs)/authorProfile", params: {authorId: book.createdBy.id}})}>
            <Text style={styles.userName}>{book.createdBy.fullName}</Text>
          </TouchableOpacity>
          <Text style={styles.userRole}>{userRole(book.createdBy.roles)}</Text>
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
    marginBottom: 10,
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    minHeight: 200,
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
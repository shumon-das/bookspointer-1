import { View, Text, BackHandler, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { fetchBooksBySeriesName } from '@/services/profileApi';
import { Book } from '@/components/types/Book';
import { useRouter } from 'expo-router';
import { ActivityIndicator } from 'react-native-paper';

const UserProfileBooks = ({series, authorId, onBackToSeries}: {series: string, authorId: number,onBackToSeries: (value: boolean|null) => void}) => {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const getAuthorBooksFromDb = async (series: string, authorId: number) => {
    const data = await fetchBooksBySeriesName(series, authorId, false, false);
    setBooks(data);
  }

  useEffect(() => {
    getAuthorBooksFromDb(series, authorId);
    const deviceBackButtonAction = () => {
        onBackToSeries(null);
        return true
    }
    
    const backHandler = BackHandler.addEventListener('hardwareBackPress', deviceBackButtonAction);
    return () => backHandler.remove();
  }, [series, authorId])

  const onChooseBook = (book: Book) => {
    router.push({pathname: "/screens/book/details", params: {
      id: book.id, 
      title: book.title, 
      author: book.author.fullName,
      content: null,
      isQuote: 'no',
      backurl: JSON.stringify({ pathname: '/(tabs)/authorProfile', params: { authorUuid: book.author.uuid } })
    }})
  }

  const title = (title: string) => {
    return title.length > 20 ? title.slice(0, 20) + '...' : title;
  }
  
  return (
    <ScrollView style={{ paddingHorizontal: 5, flex: 1, marginTop: 10 }}>
      { books.length === 0 
        ? <ActivityIndicator size="small" color="#0000ff" />
        : (<View style={styles.grid}>
            {Object.keys(books).map((i: any) => (
                <View style={styles.book} key={i}>
                    <TouchableOpacity key={i} style={styles.series} onPress={() => onChooseBook(books[i])}>
                        <Image source={require('../../../assets/images/default_post_image.jpg')} style={styles.image} />
                        <View style={styles.content}>
                            <Text style={styles.seriesName}>{title(books[i].title)}</Text>
                            <Image style={styles.contentAuthorImage} source={{ uri: `https://api.bookspointer.com/uploads/${books[i].author.image}` }} />
                            <Text style={styles.authorName}>{books[i].author.fullName}</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={{}}>
                        <Text>{books[i].title}</Text>
                    </View>
                </View>
            ))}
         </View>)
     }
    </ScrollView>
  )
}

export default UserProfileBooks

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 50,
  },
  book: {
    height: 'auto', 
    width: '32%',
    marginBottom: 10,
  },
  series: {
    width: '100%',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    position: 'relative',
    height: 160,
  },
  seriesName: {
    fontSize: 14,
    textAlign: 'center',
    color: '#F6F7F9',
  },
  authorName: {
    fontSize: 10, 
    color: '#F6F7F9'
  },
  image: { 
    width: '100%', 
    height: '100%',
  },
  content: {
    position: 'absolute',
    width: '68%',
    height: 100,
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 15,
    transform: [{ rotate: '-3deg' }]
  },
  contentAuthorImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
})
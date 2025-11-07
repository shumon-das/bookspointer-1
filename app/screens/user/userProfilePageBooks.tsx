import useAuthStore from "@/app/store/auth";
import { labels } from "@/app/utils/labels";
import UserProfileHeader from "@/components/micro/user/profile/UserProfileHeader";
import { Book } from "@/components/types/Book";
import { fetchBooksBySeriesName } from "@/services/profileApi";
import { styles } from '@/styles/profilePageBooks.styles';
import { UserInterface } from "@/types/interfeces";
import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, SafeAreaView, Text, TouchableOpacity, View } from "react-native";

const UserProfilePageBooks = () => {
  const {series} = useLocalSearchParams();
  const [seriesName, setSeriesName] = useState<string|null>(null);
  const [user, setUser] = useState<UserInterface|null>(null);
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [booksNotFound, setBooksNotFound] = useState<string|null>(null);

  const getAuthorBooksFromDb = async (series: string) => {
    if (!series || !user) return;
    const data = await fetchBooksBySeriesName(series, user ? user.id : 0, false, true);
    setBooks(data);
    if (data.length === 0) {
      setBooksNotFound(labels.noBooksFoundForThisSeries);
    } else {
      setBooksNotFound(null);
    }
  }

  useFocusEffect(
    useCallback(() => {
      const authUser = useAuthStore.getState().user;
      if (authUser) setUser(authUser);

      if (series) {
        setSeriesName(series as unknown as string)
      }
    }, [series])
  )
  
  useEffect(() => {
    getAuthorBooksFromDb(seriesName as string);
  }, [seriesName, user]);

  const title = (title: string) => {
    return title.length > 20 ? title.slice(0, 20) + '...' : title;
  }

  const onChooseBook = (book: Book) => {
    router.push({pathname: "/(tabs)/book/details", params: {
        id: book.id, 
        title: book.title, 
        author: book.author.fullName,
        content: null,
        isQuote: 'no',
        backurl: JSON.stringify({ pathname: '/(tabs)/authorProfile', params: { authorUuid: book.author.uuid } })
    }})
  }

  const renderItem = ({item}: {item: Book}) => (
    <View style={styles.book}>
        <TouchableOpacity key={item.id} style={styles.series} onPress={() => onChooseBook(item)}>
            <Image source={require('../../../assets/images/default_post_image.jpg')} style={styles.image} />
            <View style={styles.content}>
                <Text style={styles.seriesName}>{title(item.title)}</Text>
                <Image style={styles.contentAuthorImage} source={{ uri: `https://api.bookspointer.com/uploads/${item.author.image}` }} />
                <Text style={styles.authorName}>{item.author.fullName}</Text>
            </View>
        </TouchableOpacity>
        <View style={{}}>
            <Text>{item.title}</Text>
        </View>
    </View>
  );
  
  return (
    <SafeAreaView style={{flex: 1}}>
        <UserProfileHeader />

        { booksNotFound ? (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text>{booksNotFound}</Text>
            </View>
        ) : '' }

        { books.length === 0 && !booksNotFound ? (<ActivityIndicator size="small" color="#0000ff" />) : (
            <>
              <FlatList 
                data={books}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                numColumns={3}
                columnWrapperStyle={{ justifyContent: 'space-around', marginBottom: 10 }}
              />
            </>
        )}
    </SafeAreaView>
  )
}

export default UserProfilePageBooks

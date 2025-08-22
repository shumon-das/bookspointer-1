import BookCard from "@/components/BookCard";
import QuoteCard from "@/components/QuoteCard";
import { fetchBooks } from "@/services/api";
import { useFocusEffect, useLocalSearchParams, useNavigation } from 'expo-router';
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";

export default function CategoryBooks() {
  const {category, categoryLabel} = useLocalSearchParams();
  const navigation = useNavigation()
  const [label, setLabel] = useState(categoryLabel as string)
  
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: label,
      headerStyle: {
        backgroundColor: '#085a80',
      },
      headerTintColor: '#d4d4d4',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    });
  }, [navigation, categoryLabel]);

  const [currentCategory, setCurrentCategory] = useState("");
  const [books, setBooks] = useState([] as any[]);
  const [initialLoading, setInitialLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [toastVisible, setToastVisible] = useState(false)
  const [snackMessage, setSnackMessage] = useState('')

  useFocusEffect(useCallback(() => {
    if (categoryLabel) {
      setLabel(categoryLabel as string)
    }

    if (category) {
      setCurrentCategory(category as string);
      setInitialLoading(true)
      setBooks([]);
      fetchChunks(1, category as string);
      setInitialLoading(false)
      setPage(page + 1);
    }

  }, [navigation, category, categoryLabel]))

  const fetchChunks = async (pageNumber: number, category: string) => {
      if (loading || !hasMore) return;
        setLoading(true);

        try {
          console.log(category)
          const data = await fetchBooks({pageNumber: pageNumber, limit: 8, categoryName: category})
          if (data.length <= 0) {
            setHasMore(false);
          } else {
            setBooks(prevBooks => {
                const allBooks = [...prevBooks, ...data];
                const uniqueBooks = Array.from(
                  new Map(allBooks.map(book => [book.id, book])).values()
                );
                return uniqueBooks;
            });
            setPage(prevPage => prevPage + 1);
          }
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false)
        }
      };

  const handleSnackMessage = (value: string) => {
    setSnackMessage(value);
    setToastVisible(true);
  };

  const renderItem = ({item}: {item: any}) => {
    if (item.title.includes('quote song poem') || item.title.includes('quote-song-poem')) {
      return <QuoteCard key={item.id} book={item} snackMessage={handleSnackMessage} />
    }

    return <BookCard key={item.id} book={item} snackMessage={handleSnackMessage} backurl={JSON.stringify({
                  pathname: '/book/categoryBooks', 
                  params: { category: category, categoryLabel: categoryLabel }
                })} />
  }

  return (
    <View style={styles.container}>
      {initialLoading ? (<ActivityIndicator size="large" color="#0000ff" className="mt-10 self-center" /> ) : (
        <>
          <FlatList
            data={books}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            onEndReached={() => fetchChunks(page, currentCategory)}
            onEndReachedThreshold={0.5}
            ListFooterComponent={loading ? <ActivityIndicator size="small" /> : null}
            style={styles.list}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightgray"
  },
  list: {
    width: "100%"
  },

})
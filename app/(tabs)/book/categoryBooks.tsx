import BookCard from "@/components/BookCard";
import QuoteCard from "@/components/QuoteCard";
import { fetchBooks } from "@/services/api";
import { useFocusEffect, useLocalSearchParams, useNavigation } from 'expo-router';
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";

export default function CategoryBooks() {
  const {category, categoryLabel} = useLocalSearchParams();
  const navigation = useNavigation()
  
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: categoryLabel,
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
    if (category) {
      setCurrentCategory(category as string);
      setInitialLoading(true)
      fetchChunks(1, category as string);
      setInitialLoading(false)
      setPage(page + 1);
    }

  }, [navigation, category]))

  const fetchChunks = async (pageNumber: number, category: string) => {
      if (loading || !hasMore) return;
        setLoading(true);

        try {
          const data = await fetchBooks({pageNumber: pageNumber, limit: 8, categoryName: category})
          if (data.length <= 0) {
            setHasMore(false);
          } else {
            setBooks([...data, ...books]);
            setPage(page + 1);
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

    return <BookCard book={item} snackMessage={handleSnackMessage} />
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
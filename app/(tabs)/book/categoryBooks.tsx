import BookCard from "@/components/BookCard";
import { fetchBooks } from "@/services/api";
import * as Notifications from 'expo-notifications';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function Index() {
  const {category} = useLocalSearchParams();
  const [books, setBooks] = useState([] as any[]);
  const [initialLoading, setInitialLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchChunks = async (pageNumber: number) => {
      if (loading || !hasMore) return;
        setLoading(true);

        try {
          const data = await fetchBooks({pageNumber: pageNumber, limit: 8, categoryName: category as string})
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

    useEffect(() => {
        setInitialLoading(true)
        fetchChunks(1);
        setInitialLoading(false)
        setPage(page + 1);
    }, []);
  return (
    <View style={styles.container}>
      {initialLoading ? (<ActivityIndicator size="large" color="#0000ff" className="mt-10 self-center" /> ) : (
        <>
          <FlatList
            data={books}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({item}) => <BookCard {...item} /> }
            onEndReached={() => fetchChunks(page)}
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
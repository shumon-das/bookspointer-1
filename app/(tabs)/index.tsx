import BookCard from "@/components/BookCard";
import { fetchBooks } from "@/services/api";
import { saveToken } from "@/services/notificationApi";
import { EventSubscription } from 'expo-modules-core';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { Snackbar } from "react-native-paper";
import { registerForPushNotificationsAsync } from "../utils/notifications";
import QuoteCard from "@/components/QuoteCard";
import { useNetworkStatus } from "@/components/network/networkConnectionStatus";
import Offline from "@/components/every/Offline";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function Index() {

  const isConnected = useNetworkStatus(() => {
    console.log('✅ Online again, syncing data...');
  });

  const notificationListener = useRef<EventSubscription | null>(null);
  const responseListener = useRef<EventSubscription | null>(null);

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      if (token) {
        saveToken(token, 1)
      }
      console.log(token);
    });

    // Listener when a notification is received
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification Received:', notification);
    });

    // Listener when user taps the notification
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('User interacted with notification:', response);
    });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);
  
  /*** end notification ***/

  const [books, setBooks] = useState([] as any[]);
  const [initialLoading, setInitialLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [toastVisible, setToastVisible] = useState(false)
  const [snackMessage, setSnackMessage] = useState('')

  const fetchChunks = async (pageNumber: number) => {
      if (loading || !hasMore) return;
        setLoading(true);

        try {
          const data = await fetchBooks({pageNumber: pageNumber, limit: 8})
          if (data.length <= 0) {
            setHasMore(false);
          } else {
            setBooks(prevBooks => [...prevBooks, ...data]);
            setPage(prevPage => prevPage + 1);
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

    const handleSnackMessage = (value: string) => {
      setSnackMessage(value);
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 2000);
    };

    const renderItem = ({item}: {item: any}) => {
      if (item.title === 'quote-song-poem' || item.title.includes('quote')) {
        return <QuoteCard book={item} snackMessage={handleSnackMessage} />
      }
      return <BookCard book={item} snackMessage={handleSnackMessage} />
    }

    if (!isConnected) {
      return (<Offline />)
    } else {
      return (
        <View style={styles.container}>
          {initialLoading ? (<ActivityIndicator size="large" color="#0000ff" className="mt-10 self-center" /> ) : (
            <>
              <FlatList
                data={books}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                onEndReached={() => fetchChunks(page)}
                onEndReachedThreshold={0.5}
                ListFooterComponent={loading ? <ActivityIndicator size="small" /> : null}
                style={styles.list}
              />
              <Snackbar visible={toastVisible} onDismiss={() => setToastVisible(false)} duration={2000}>
                  {snackMessage}
              </Snackbar>
            </>
          )}
        </View>
      );
    }  
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
import BookCard from "@/components/BookCard";
import { fetchIndexFeeds, stringifyToParse } from "@/services/api";
import { saveToken } from "@/services/notificationApi";
import { EventSubscription } from 'expo-modules-core';
import * as Notifications from 'expo-notifications';
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { Snackbar } from "react-native-paper";
import registerForPushNotificationsAsync from "../utils/notifications";
import QuoteCard from "@/components/QuoteCard";
import { useNetworkStatus } from "@/components/network/networkConnectionStatus";
import Offline from "@/components/every/Offline";
import { useNavigation } from "expo-router";
import usePageLeaveTracker from "../utils/routerGuard";
import { isAppUpdateExists } from "../utils/app/isUpdate";
import NativeFeedAds from "@/components/micro/meta/NativeFeedAds";
import HomeScreenHeader from "@/components/micro/book/home/HomeScreenHeader";
import { styles } from "@/styles/home.styles";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function Index() {
  const APP_VERSION = '15_12_2025'
  isAppUpdateExists(APP_VERSION)

  usePageLeaveTracker('home', null)
  
  const isConnected = useNetworkStatus(() => {
    console.log('✅ Online again, syncing data...');
  });

  const notificationListener = useRef<EventSubscription | null>(null);
  const responseListener = useRef<EventSubscription | null>(null);

  useEffect(() => {
    // Helper function to handle registration and save the token
    const setupNotifications = async () => {
      const pushToken = await registerForPushNotificationsAsync();

      if (pushToken) {
        // Only save the token if we successfully received one
        await saveToken(pushToken, 1);
        console.log('✅ Push Token Received and Saved:', pushToken);
      } else {
        console.log('⚠️ Could not get a Push Token.');
      }
    };

    setupNotifications();

    // Listener when a notification is received (app is foregrounded)
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('🔔 Notification Received:', notification);
      // You can add logic here to display an in-app notification/toast
    });

    // Listener when user taps the notification (app is backgrounded/closed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('👆 User interacted with notification:', response);
      // You can add navigation logic here based on the notification content
    });

    // Cleanup listeners on component unmount
    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);  
  /*** end notification ***/

  // start header
  const navigation = useNavigation();
  useEffect(() => navigation.setOptions({ headerShown: false }), []);
  // end header 

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
        const data = await fetchIndexFeeds({pageNumber: pageNumber, limit: 8})
         if (data.length <= 0) {
           setHasMore(false);
         } else {
           setBooks(prevBooks => {
              const newData = data.map((book: any) => stringifyToParse(book));
              const allBooks = [...prevBooks, ...newData];
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

    useEffect(() => {
        setInitialLoading(true)
        fetchChunks(1);
        setInitialLoading(false)
        setPage(page + 1);
    }, []);

    const listData = useMemo(() => {
      const visualData = [] as any[];
      
      books.forEach((book, index) => {
        visualData.push(book);
        
        if ((index + 1) % 10 === 0) {
          visualData.push({
            id: `ad-${book.id}`, // Stable ID linked to the book above it
            isAd: true,
            title: 'ads-item'
          });
        }
      });
      
      return visualData;
    }, [books]);

    const handleSnackMessage = (value: string) => {
      setSnackMessage(value);
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 2000);
    };

    const renderItem = useCallback(({item, index}: {item: any, index: number}) => {
      if (item.title === 'ads-item' && index != 0) {
        // return <NativeFeedAds />
        return <></>
      }

      if (item.title === 'quote-song-poem' || item.title.includes('quote')) {
        return <QuoteCard book={item} snackMessage={handleSnackMessage} />
      }
      return <BookCard book={item} snackMessage={handleSnackMessage} backurl={JSON.stringify({ pathname: '/(tabs)/', params: {} })} />
    }, [])

    if (!isConnected) {
      return (<Offline />)
    } else {
      return (<>
        <View style={{height: '11%', backgroundColor: '#085a80'}}>
          <HomeScreenHeader />
        </View>
        <View style={styles.container}>
          {initialLoading ? (<ActivityIndicator size="large" color="#0000ff" className="mt-10 self-center" /> ) : (
            <>
              <FlatList
                data={listData}
                keyExtractor={(item, index) => typeof item.id === 'number' ? item.id.toString() : `fallback-key-${index}`}
                renderItem={renderItem}
                onEndReached={() => fetchChunks(page)}
                onEndReachedThreshold={0.5}
                // Performance optimizations
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={5}
                removeClippedSubviews={true}
                ListFooterComponent={loading ? <ActivityIndicator size="small" /> : null}
                style={styles.list}
              />
              <Snackbar visible={toastVisible} onDismiss={() => setToastVisible(false)} duration={2000}>
                  {snackMessage}
              </Snackbar>
            </>
          )}
        </View>
      </>
      );
    }  
}

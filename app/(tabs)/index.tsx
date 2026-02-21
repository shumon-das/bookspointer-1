import BookCard from "@/components/BookCard";
import { saveToken } from "@/services/notificationApi";
import * as Notifications from 'expo-notifications';
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, FlatList, View, Text, RefreshControl } from "react-native";
import { Snackbar } from "react-native-paper";
import registerForPushNotificationsAsync from "../utils/notifications";
import QuoteCard from "@/components/QuoteCard";
import { useNetworkStatus } from "@/components/network/networkConnectionStatus";
import { useNavigation } from "expo-router";
import { isAppUpdateExists } from "../utils/app/isUpdate";
import NativeFeedAds from "@/components/micro/meta/NativeFeedAds";
import HomeScreenHeader from "@/components/micro/book/home/HomeScreenHeader";
import { styles } from "@/styles/home.styles";
import { useSyncAllUsersStore } from "../store/syncAllUsersStore";
import { useHomeStore } from "../store/homeStore";
import { MaterialIcons } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BookReviewSheet from "@/components/micro/bottomSheet/BookReviewSheet";

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
  const APP_VERSION = '13_02_2026'
  isAppUpdateExists(APP_VERSION)
  
  const { isOnline, isInitializing } = useNetworkStatus(() => {
    console.log('✅ Online again, syncing data...');
  });

  const notificationListener = useRef<Notifications.EventSubscription | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

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

  const [toastVisible, setToastVisible] = useState(false)
  const [snackMessage, setSnackMessage] = useState('')
  const [refreshing, setRefreshing] = useState(false);
  const [reviewBook, setReviewBook] = useState(null)

  const { loading, feedBooks, fetchFeedBooks, fetchCacheBooks, clearFeedBooks } = useHomeStore()
  const syncAllUsers = useSyncAllUsersStore()

  const fetchAllUsersFromDbWhoHaveBooks = async () => {    
    await syncAllUsers.syncAllUsers()
  }
  useEffect(() => {
    if (isOnline && feedBooks.length === 0) {
      console.log('online')
      fetchFeedBooks(true, APP_VERSION);
    } else {
      console.log('offline', feedBooks.length)
      fetchCacheBooks()
      return;
    }
    fetchAllUsersFromDbWhoHaveBooks()
  }, [isOnline]);

  const listData = useMemo(() => {
    const visualData = [] as any[];
    
    feedBooks.forEach((book, index) => {
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
  }, [feedBooks]);

    const handleSnackMessage = (value: string) => {
      setSnackMessage(value);
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 2000);
    };

    const reviewSheetRef = useRef<any>(null);
    
    const handleReviewBottomSheet = (book: any) => {
      setReviewBook(book)
      book ? reviewSheetRef.current?.snapToIndex(1) : reviewSheetRef.current?.close()
    }

    const renderItem = useCallback(({item, index}: {item: any, index: number}) => {
      if (item.title === 'ads-item' && index != 0) {
        // return <NativeFeedAds />
        return <></>
      }

      if (item.title === 'quote-song-poem' || item.title.includes('quote')) {
        return <QuoteCard book={item} snackMessage={handleSnackMessage} />
      }

      return <BookCard
        book={item}
        snackMessage={handleSnackMessage}
        backurl={JSON.stringify({ pathname: '/(tabs)/', params: {} })}
        handleReviewBottomSheet={() => handleReviewBottomSheet(item)}
      />
    }, [])

    return (<GestureHandlerRootView style={{ flex: 1,backgroundColor: '#f9f0eb', position: 'relative' }} >
      <View style={{height: '11%', backgroundColor: '#085a80'}}>
        <HomeScreenHeader />
      </View>
      <View style={useHomeStore.getState().bannerStyle}>
        <Text>{useHomeStore.getState().bannerMessage}</Text>
      </View>
      <View style={styles.container}>
          <FlatList
            data={listData}
            keyExtractor={(item, index) => typeof item.id === 'number' ? item.id.toString() : `fallback-key-${index}`}
            renderItem={renderItem}
            onEndReached={() => fetchFeedBooks(isOnline)}
            onEndReachedThreshold={0.5}
            // Performance optimizations
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={5}
            removeClippedSubviews={true}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={() => {
                  useHomeStore.getState().onRefresh(APP_VERSION)
                }} />
            }
            ListHeaderComponent={() => <View>{loading && <ActivityIndicator size="small" color="#e63946" />}</View>}
            ListEmptyComponent={() => (<View style={{flex: 1, justifyContent: 'center', alignItems: 'center', height: 500}}>
              <Text>{isOnline && listData.length !== 0 ? <ActivityIndicator size="small" color="#e63946" /> : 'loading...'}</Text>
              </View>)}
            ListFooterComponent={!isOnline 
                ? <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                      <MaterialIcons name="wifi-off" size={24} color="#444" />
                      <Text style={{ marginLeft: 10 }}>No internet connection</Text>
                  </View>
                : loading ? <ActivityIndicator size="small" color="#e63946" /> : null}
            style={styles.list}
          />
          <Snackbar visible={toastVisible} onDismiss={() => setToastVisible(false)} duration={2000}>
              {snackMessage}
          </Snackbar>
      </View>

      {reviewBook && <BookReviewSheet ref={reviewSheetRef} book={reviewBook} />}
    </GestureHandlerRootView>
    );
}

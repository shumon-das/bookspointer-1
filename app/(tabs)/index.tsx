import BookCard from "@/components/BookCard";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, View, RefreshControl, Text } from "react-native";
import { Snackbar } from "react-native-paper";
import QuoteCard from "@/components/QuoteCard";
import { useNetworkStatus } from "@/components/network/networkConnectionStatus";
// import NativeFeedAds from "@/components/micro/meta/NativeFeedAds";
import { styles } from "@/styles/home.styles";
import { useSyncAllUsersStore } from "../store/syncAllUsersStore";
import { useHomeStore } from "../store/homeStore";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AppUpdateBanner from "@/components/screens/home/AppUpdateBanner";
import { useSystemStore } from "../store/systemStore";
import FeedBookCard from "@/components/FeedBookCard";
import ThreeDotsLoader from "@/components/micro/ThreeDotsLoader";
// import OfflineComponent from "@/components/OfflineComponent";

export default function Index() {
  const APP_VERSION = '01_03_2026'
  const lang = useSystemStore((state) => state.lang);
  
  const { isOnline, isInitializing } = useNetworkStatus(() => {
    console.log('✅ Online again, syncing data...');
  });

  const [toastVisible, setToastVisible] = useState(false)
  const [snackMessage, setSnackMessage] = useState('')
  const [refreshing, setRefreshing] = useState(false);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false)

  const loading = useHomeStore(state => state.loading)
  const { feedBooks, fetchFeedBooks, fetchCacheBooks, clearFeedBooks } = useHomeStore()
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

  useEffect(() => {
    if (lang) {
      clearFeedBooks()
      fetchFeedBooks(isOnline, APP_VERSION)
    }
  }, [lang])

  const handleSnackMessage = (value: string) => {
    setSnackMessage(value);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
  };

  const renderItem = useCallback(({ item, index }: { item: any, index: number }) => {
    if (item.title === 'ads-item' && index != 0) {
      // return <NativeFeedAds />
      return <></>
    }

    if (item.title === 'quote-song-poem' || item.title.includes('quote')) {
      return <QuoteCard book={item} snackMessage={handleSnackMessage} />
    }

    return <FeedBookCard
      book={item}
      snackMessage={handleSnackMessage}
    />
  }, [handleSnackMessage])

  return (<GestureHandlerRootView style={{ flex: 1, backgroundColor: '#f9f0eb', position: 'relative' }} >
    {useHomeStore.getState().bannerMessage && <AppUpdateBanner />}

    <View style={styles.container}>
      <FlatList
        data={feedBooks}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        onEndReached={() => {
          useHomeStore.setState((state) => ({ loading: true }));
          console.log('isOnline', isOnline)
          if (isOnline) {
            fetchFeedBooks(isOnline, APP_VERSION)
          } else {
            setShowOfflineMessage(!isOnline)
          }
        }}
        onEndReachedThreshold={0.5}
        scrollEventThrottle={16}
        decelerationRate="normal"
        contentContainerStyle={{ flexGrow: 1 }}
        initialNumToRender={20}
        maxToRenderPerBatch={20}
        windowSize={10}
        removeClippedSubviews={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => {
            useHomeStore.getState().onRefresh(APP_VERSION)
          }} />
        }
        ListFooterComponent={() => {
          // if (showOfflineMessage && !useHomeStore.getState().loading) return <OfflineComponent />
          if (loading) return <ActivityIndicator size="small" color="#e63946" />
          // if (loading) return <ThreeDotsLoader />
          return null
        }}
        ListEmptyComponent={() => {
          if (loading || isInitializing) {
            return (
              <View style={styles.emptyState}>
                <Text>{isOnline === false ? 'No cached books available.' : 'getting books...'}</Text>
              </View>
            );
          }

          return (
            <View style={styles.emptyState}>
              <Text>{isOnline === false ? 'No cached books available.' : 'No books found.'}</Text>
            </View>
          );
        }}
        style={styles.list}
      />
      <Snackbar visible={toastVisible} onDismiss={() => setToastVisible(false)} duration={2000}>
        {snackMessage}
      </Snackbar>
    </View>

  </GestureHandlerRootView>
  );
}

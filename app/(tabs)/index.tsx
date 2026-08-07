import BookCard from "@/components/BookCard";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, View, RefreshControl, Text } from "react-native";
import { useFocusEffect } from "expo-router";
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
import FeedBookCard, { type FeedSnackbarMessage } from "@/components/FeedBookCard";
import ThreeDotsLoader from "@/components/micro/ThreeDotsLoader";
import AuthorMilestoneCard from "@/components/AuthorMilestoneCard";
import { fetchAuthorHighlight } from "@/services/api";
// import OfflineComponent from "@/components/OfflineComponent";

export default function Index() {
  const APP_VERSION = '01_03_2026'
  const lang = useSystemStore((state) => state.lang);
  
  const { isOnline, isInitializing } = useNetworkStatus(() => {
    console.log('✅ Online again, syncing data...');
  });

  const [toastVisible, setToastVisible] = useState(false)
  const [snackMessage, setSnackMessage] = useState('')
  const [snackAction, setSnackAction] = useState<FeedSnackbarMessage['action']>()
  const [refreshing, setRefreshing] = useState(false);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false)
  const [authorHighlight, setAuthorHighlight] = useState<any | null>(null)

  const loading = useHomeStore(state => state.loading)
  const { feedBooks, fetchFeedBooks, fetchCacheBooks, refreshFeedBooks } = useHomeStore()
  const syncAllUsers = useSyncAllUsersStore()

  const fetchAllUsersFromDbWhoHaveBooks = async () => {
    await syncAllUsers.syncAllUsers()
  }
  useEffect(() => {
    fetchAuthorHighlight().then(setAuthorHighlight).catch((error) => console.error("Failed to load author highlight:", error));
  }, [isOnline]);

  useFocusEffect(
    useCallback(() => {
      if (isInitializing || isOnline === null) return;

      if (isOnline) {
        void refreshFeedBooks(APP_VERSION).then(() => fetchAllUsersFromDbWhoHaveBooks());
      } else {
        void fetchCacheBooks();
      }
    }, [isInitializing, isOnline, lang, refreshFeedBooks, fetchCacheBooks])
  );

  const handleSnackMessage = useCallback((notice: FeedSnackbarMessage) => {
    setSnackMessage(notice.message);
    setSnackAction(notice.action);
    setToastVisible(true);
  }, []);

  const renderItem = useCallback(({ item, index }: { item: any, index: number }) => {
    if (item.title === 'ads-item' && index != 0) {
      // return <NativeFeedAds />
      return <></>
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
        ListHeaderComponent={() => authorHighlight ? <AuthorMilestoneCard author={authorHighlight} /> : null}
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
      <Snackbar visible={toastVisible} onDismiss={() => setToastVisible(false)} duration={snackAction ? 5000 : 2000} action={snackAction ? { label: snackAction.label, onPress: () => { setToastVisible(false); snackAction.onPress(); } } : undefined}>
        {snackMessage}
      </Snackbar>
    </View>

  </GestureHandlerRootView>
  );
}

import BookCard from "@/components/BookCard";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, View, Text, RefreshControl, TouchableOpacity, Linking } from "react-native";
import { Snackbar } from "react-native-paper";
import QuoteCard from "@/components/QuoteCard";
import { useNetworkStatus } from "@/components/network/networkConnectionStatus";
import { useNavigation } from "expo-router";
// import NativeFeedAds from "@/components/micro/meta/NativeFeedAds";
import HomeScreenHeader from "@/components/micro/book/home/HomeScreenHeader";
import { styles } from "@/styles/home.styles";
import { useSyncAllUsersStore } from "../store/syncAllUsersStore";
import { useHomeStore } from "../store/homeStore";
// import { MaterialIcons } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import labels from "../utils/labels";
import AppUpdateBanner from "@/components/screens/home/AppUpdateBanner";
// import OfflineComponent from "@/components/OfflineComponent";

export default function Index() {
  const APP_VERSION = '01_03_2026'
  
  const { isOnline, isInitializing } = useNetworkStatus(() => {
    console.log('✅ Online again, syncing data...');
  });


  // start header
  const navigation = useNavigation();
  useEffect(() => navigation.setOptions({ headerShown: false }), []);
  // end header 

  const [toastVisible, setToastVisible] = useState(false)
  const [snackMessage, setSnackMessage] = useState('')
  const [refreshing, setRefreshing] = useState(false);
  const [reviewBook, setReviewBook] = useState(null)
  const [showOfflineMessage, setShowOfflineMessage] = useState(false)

  const loading = useHomeStore(state => state.loading)
  const { headerReloadLoading, feedBooks, fetchFeedBooks, fetchCacheBooks, clearFeedBooks } = useHomeStore()
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
    
    return visualData.filter((book, index, self) => index === self.findIndex((b) => b.id === book.id))
  }, [feedBooks]);

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

      return <BookCard
        book={item}
        snackMessage={handleSnackMessage}
        backurl={JSON.stringify({ pathname: '/(tabs)/', params: {} })}
      />
    }, [handleSnackMessage])

    return (<GestureHandlerRootView style={{ flex: 1,backgroundColor: '#f9f0eb', position: 'relative' }} >
      <View style={{height: '11%', backgroundColor: '#085a80'}}>
        <HomeScreenHeader />
      </View>
      
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
            contentContainerStyle={{ flexGrow: 1 }}
            // Performance optimizations
            initialNumToRender={20}
            maxToRenderPerBatch={20}
            windowSize={10}
            removeClippedSubviews={false}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={() => {
                  useHomeStore.getState().onRefresh(APP_VERSION)
                }} />
            }
            ListHeaderComponent={() => <View>{headerReloadLoading && <ActivityIndicator size="small" color="#e63946" />}</View>}
            ListEmptyComponent={() => (<View style={{flex: 1, justifyContent: 'center', alignItems: 'center', height: 100}}>
               <Text>{labels.noBooksFound}</Text>
            </View>)}
            ListFooterComponent={() => {
                // if (showOfflineMessage && !useHomeStore.getState().loading) return <OfflineComponent />
                if (loading) return <ActivityIndicator size="large" color="#e63946" />
                return null
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

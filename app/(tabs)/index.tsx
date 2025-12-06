import BookCard from "@/components/BookCard";
import { fetchIndexFeeds, stringifyToParse } from "@/services/api";
import { saveToken } from "@/services/notificationApi";
import { EventSubscription } from 'expo-modules-core';
import * as Notifications from 'expo-notifications';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, View, Text, Image } from "react-native";
import { Snackbar } from "react-native-paper";
import registerForPushNotificationsAsync from "../utils/notifications";
import QuoteCard from "@/components/QuoteCard";
import { useNetworkStatus } from "@/components/network/networkConnectionStatus";
import Offline from "@/components/every/Offline";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import { useAuthStore } from "../store/auth";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { styles as styles2 } from '@/styles/bottomNav.styles';
import labels from "../utils/labels";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import usePageLeaveTracker from "../utils/routerGuard";
import API_CONFIG from "../utils/config";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import NotificationBadge from "@/components/NotificationBadge";

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
      /** this function created for testing perpose */
      const endpoint = API_CONFIG.BASE_URL + '/test/save-to-dictionary';
      const response = await fetch(endpoint, {
          method: 'POST',
          headers: API_CONFIG.HEADERS,
          body: JSON.stringify({'index screen: ': pushToken})
      })
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
  const router = useRouter();
  const { authenticatedUser } = useAuthStore();
  const authStore = useAuthStore();
  const isFocused = useIsFocused(); // Get the focus state
  const [loggedInUser, setLoggedInUser] = useState(authenticatedUser)

  const goToProfile = async () => {
    const storageUser = await AsyncStorage.getItem('auth-user')
    if (!storageUser) {
      router.push('/auth/login')
      return
    }
    authStore.setUser(JSON.parse(storageUser))
    router.push('/screens/user/userProfile');
  }

  const HeaderRight = () => (
    <View style={styles2.header}>
        <TouchableOpacity onPress={() => router.push('/(tabs)/search')}>
            <FontAwesome name="search" style={styles2.marginLeft} size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/screens/book/create-post')}>
            <Text style={[styles2.marginLeft, {color: 'white'}]}>{labels.writeBook}</Text>
        </TouchableOpacity>
        
        <NotificationBadge />
        
        {loggedInUser && (
            <TouchableOpacity onPress={goToProfile} style={styles2.userImgParentElement}>
                <Image 
                    source={{uri: `https://api.bookspointer.com/uploads/${loggedInUser?.image}`}} 
                    style={styles2.userImg} 
                />
            </TouchableOpacity>
        )}
        {!loggedInUser &&  (
            <TouchableOpacity onPress={goToProfile} style={styles2.loginBtn}>
                <Text>{labels.signIn}</Text>
            </TouchableOpacity>
        )}
    </View>
  );

  useFocusEffect(useCallback(() => {
    const loadLoggedInUser = async () => {
      if (authenticatedUser) {
        setLoggedInUser(authenticatedUser)
      } else {
        const storageUser = await AsyncStorage.getItem('auth-user')
        setLoggedInUser(storageUser ? JSON.parse(storageUser) : null)
      }
    }
    loadLoggedInUser()
  }, [authenticatedUser]))

  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
        title: labels.booksPointer,
        headerRight: HeaderRight,
        headerStyle: {
            backgroundColor: '#085a80',
        },
        headerTintColor: '#ffffff',
    });
  }, [loggedInUser, authenticatedUser, isFocused]);

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

    const handleSnackMessage = (value: string) => {
      setSnackMessage(value);
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 2000);
    };

    const renderItem = ({item}: {item: any}) => {
      if (item.title === 'quote-song-poem' || item.title.includes('quote')) {
        return <QuoteCard book={item} snackMessage={handleSnackMessage} />
      }
      return <BookCard book={item} snackMessage={handleSnackMessage} backurl={JSON.stringify({ pathname: '/(tabs)/', params: {} })} />
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
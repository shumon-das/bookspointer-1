import { useReviewStore } from '@/app/store/reviewStore'
import { useTempStore } from '@/app/store/temporaryStore'
import labels from '@/app/utils/labels'
import { useNavigation } from 'expo-router'
import React, { useEffect, useLayoutEffect, useRef } from 'react'
import { FlatList, Image, Text, View } from 'react-native'
// import { MaterialIcons } from '@expo/vector-icons'
import API_CONFIG from '@/app/utils/config'
import englishNumberToBengali from '@/app/utils/englishNumberToBengali'
import ReviewBottomSheet from '@/components/micro/review/ReviewBottomSheet'
import ReviewCard from '@/components/micro/review/ReviewCard'
import { styles } from '@/styles/bookReview.styles'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useNetworkStatus } from "@/components/network/networkConnectionStatus";
import { MaterialIcons } from '@expo/vector-icons'

const BookReview = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => { navigation.setOptions({ headerShown: true, title: labels.review }); }, []);
  const [reviews, setReviews] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const tempStore = useTempStore();
  const book = tempStore.selectedReview;
  const reviewStore = useReviewStore();
  const [selectedReviewForReply, setSelectedReviewForReply] = React.useState<any>(null);
  const [isReply, setIsReply] = React.useState(false);
  const [isOnlyReply, setIsOnlyReply] = React.useState(false);

  const sheetRef = useRef<any>(null);

  useEffect(() => {
    if (!book) {
      navigation.goBack();
    }

    const fetchReviews = async () => {
      const data = await reviewStore.fetchReviews(book.id);
      setReviews(data);
    }
    if (isConnected) {
      setLoading(true);
      fetchReviews();
    }
    setLoading(false);

  }, [book, reviewStore.reviews])

  const formattedDate = (date: any) => new Date(date).toISOString().split('T')[0];

  if (!book) {
    return (
      <View>
        <Text>No review found</Text>
      </View>
    )
  }

  const handleReply = (r: any, value: boolean, isReply: boolean, isOnlyReply?: boolean) => {
    setSelectedReviewForReply(r);
    setIsReply(isReply);
    setIsOnlyReply(isOnlyReply ?? false);
    value ? sheetRef.current?.snapToIndex(1) : sheetRef.current?.close()
  }

  const isConnected = useNetworkStatus(() => {
    console.log('✅ Online again, syncing data...');
  });

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#f9f0eb' }} >
      <View style={{ backgroundColor: '#f9f0eb', flex: 1 }}>
        <View style={styles.bookInfo}>
          <Image
            source={{ uri: `${API_CONFIG.BASE_URL}/uploads/${'' === book.image || !book.image ? 'mb_default_cover_2.jpg' : book.image}` }}
            style={{ width: 80, height: 120, resizeMode: 'cover', borderRadius: 5 }}
          />
          <View style={{ flex: 1, justifyContent: 'flex-start', height: '100%' }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{book.title}</Text>
            <View style={styles.ratingRow}>
              {/* {[...Array(5)].map((_, i) => (
                <MaterialIcons key={i} name="star" size={16} color={i < r.rating ? "#FFD700" : "#444"} />
              ))} */}
              <Text style={styles.dateText}>
                {labels.postedAt}
                {englishNumberToBengali(formattedDate(book.createdAt.date) as any)}
              </Text>
            </View>
            <Text style={styles.dateText}>{book.reviews_count} {labels.countReview}</Text>
          </View>
        </View>

        {isConnected && <FlatList
          data={reviews}
          renderItem={({ item }) => {
            return item.parent ? <></>
              : <ReviewCard
                review={item}
                replies={reviews.filter((r: any) => r.parent?.id === item.id)}
                onPressReply={handleReply}
              />
          }}
          keyExtractor={(item: any) => item.id}
          ListFooterComponent={<View style={{ height: 200 }} />}
        />}

        {!isConnected && <View style={{backgroundColor: '', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <MaterialIcons name="wifi-off" size={48} color="#444" />
            <Text>No internet connection</Text>
        </View>}
      </View>

      {selectedReviewForReply &&
        <ReviewBottomSheet
          review={selectedReviewForReply}
          book={book}
          isReply={isReply}
          isOnlyReply={isOnlyReply}
          ref={sheetRef}
          onReplyDone={(data: any) => setReviews(data.reviews)}
        />}
    </GestureHandlerRootView>
  )
}

export default BookReview

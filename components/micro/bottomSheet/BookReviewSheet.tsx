import labels from '@/app/utils/labels';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import React, { forwardRef, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '@/app/utils/config';
import { styles } from '@/styles/createSeries.styles';
import { getAnonymousId } from '@/app/utils/annonymous';
import ReviewCard from '../review/ReviewCard';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useReviewStore } from '@/app/store/reviewStore';

const BookReviewSheet = forwardRef((book: any, ref: any) => {
  const snapPoints = useMemo(() => ['90%'], []);
  const reviewStore = useReviewStore();
  const [reviews, setReviews] = useState([])
  const [content, setContent] = useState('')
  const [isEdit, setIsEdit] = useState(false)
  const [editItem, setEditItem] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const fetchReviews = async () => {
    try {
        setLoading(true)
        const response: any = await fetch(`${API_CONFIG.BASE_URL}/single-book/review/${book.book.id}`)
        const data = await response.json()
        setReviews(data)
        setLoading(false)
    } catch (error) {
        console.log("Failed to fetch reviews: " + error)
        setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [book.book])

  const createReview = async () => {
    if (content && content.length > 0) {
        const result = await reviewStore.createReview(book.book.id, content)
        setReviews(result.reviews)
        setContent('')
    }
  }

  const onEditReview = async (item: any) => {
    setIsEdit(true)
    setContent(item.content)
    setEditItem(item)
  }

  const onDeleteReview = async (item: any) => {
    Alert.alert(labels.deleteItem.areYouSure, labels.deleteItem.deleteMessage, [
      {text: 'Yes', style: 'destructive', onPress: () => {
        // apply delete logic
      }},
      {text: 'No', style: 'cancel'}
    ])
  }

  if (loading) {
    return <ActivityIndicator size="large" color="orange"/>
  }

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      backgroundStyle={{ backgroundColor: 'white' }}
    >
      <BottomSheetFlatList
        data={reviews}
        keyExtractor={(item: any) => item.id.toString()}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        renderItem={({ item }) => <ReviewCard review={item} replies={[]} onPressReply={() => {}} />}
        ListEmptyComponent={() => <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <Text style={{ textAlign: 'center', marginTop: 20 }}>{labels.noReview}</Text>
        </View>}
        ListFooterComponent={
          <View style={{ paddingTop: 10 }}>
            <View style={{borderWidth: 1, borderColor: '#ccc', borderRadius: 5}}>
              <TextInput
                style={{width: '100%'}}
                onChangeText={(text) => setContent(text)}
                value={content}
                placeholder={labels.writeReview}
                placeholderTextColor="#999"
                multiline={true}
              />
              <View style={{width: '100%', alignItems: 'flex-end'}}>
                <TouchableOpacity style={{margin: 5}} onPress={() => createReview()}>
                    <MaterialIcons name="send" size={24} color="black" />
                </TouchableOpacity>
              </View>
        </View>
          </View>
        }
      />
    </BottomSheet>
  );
});

export default BookReviewSheet;

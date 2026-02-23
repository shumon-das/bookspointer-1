import { View, Text, Alert, FlatList, KeyboardAvoidingView, TextInput, TouchableOpacity, SafeAreaView, Keyboard } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useReviewStore } from '@/app/store/reviewStore';
import API_CONFIG from '@/app/utils/config';
import labels from '@/app/utils/labels';
import ReviewSheetReviewCard from '@/components/micro/review/ReviewSheetReviewCard';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router'


const SingleBookReviews = () => {
    const navigation = useNavigation();
    useLayoutEffect(() => { navigation.setOptions({ headerShown: true, title: 'Reviews' });}, []);
    const [keyboardOpen, setKeyboardOpen] = useState(false);
    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardDidShow', () =>  setKeyboardOpen(true));
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => setKeyboardOpen(false));
        
        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        }
    }, []);

    const [reviews, setReviews] = useState([])
    const [content, setContent] = useState('')
    const [isEdit, setIsEdit] = useState(false)
    const [isDelete, setIsDelete] = useState(false)
    const [isReply, setIsReply] = useState(false)
    const [isReplyBack, setIsReplyBack] = useState(false)
    const [loading, setLoading] = useState(false)
    const [actionReview, setActionReview] = useState<any>(null)

    const fetchReviews = async () => {
        try {
            setLoading(true)
            const response: any = await fetch(`${API_CONFIG.BASE_URL}/single-book/review/${useReviewStore.getState().selectedBook.id}`)
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
    }, [useReviewStore.getState().selectedBook])
    
    const createReview = async () => {
        if (content && content.length > 0) {
            const result = await useReviewStore.getState().createReview(useReviewStore.getState().selectedBook.id, content)
            setReviews(result.reviews)
            setContent('')
        }
    }
    
    const onEditReview = async (item: any) => {
        setIsEdit(true)
        setContent(item.content)
        setActionReview(item)
    }
    
    const onDeleteReview = async (item: any) => {
        Alert.alert(labels.deleteItem.areYouSure, labels.deleteItem.deleteMessage, [
          {text: 'Yes', style: 'destructive', onPress: async () => {
            await useReviewStore.getState().deleteReview(item.id)
            setReviews(reviews.filter((r: any) => r.id !== item.id))
          }},
          {text: 'No', style: 'cancel'}
        ])
    }

    const onSaveReview = async () => {
    if (isReply) {
      await useReviewStore.getState().replyToReview(actionReview.id, useReviewStore.getState().selectedBook.id, content)
    } else if (isEdit) {
      await useReviewStore.getState().editReview(actionReview, content)
      setReviews(reviews.filter((r: any) => r.id === actionReview.id ? r.content = content : r))
    } else {
      await createReview()
    }
    setIsEdit(false)
    setIsDelete(false)
    setIsReply(false)
    setIsReplyBack(false)
    setActionReview(null)
    setContent('')
  }

    if (!useReviewStore.getState().selectedBook) {
      return <View>
        <Text>{labels.bookNotFound}</Text>
      </View>
    }  
    
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <FlatList
                data={reviews}
                keyExtractor={(item: any) => item.id.toString()}
                contentContainerStyle={{ paddingHorizontal: 10 }}
                renderItem={({ item }) => {
                    return <ReviewSheetReviewCard 
                        review={item} 
                        bookCreator={useReviewStore.getState().selectedBook.createdBy} 
                        replies={[]} 
                        action={(review, isEdit, isDelete, isReply, isReplyBack) => {
                        setActionReview(review)
                        setIsEdit(isEdit)
                        setIsDelete(isDelete)
                        setIsReply(isReply)
                        setIsReplyBack(isReplyBack)

                        if (isEdit) {
                            setContent(review.content)
                        } else {
                            setContent('')
                        }

                        if (isDelete) {
                            onDeleteReview(review)
                        }
                        }} 
                    />}
                }
                ListEmptyComponent={() => <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    <Text style={{ textAlign: 'center', marginTop: 20 }}>{labels.noReview}</Text>
                </View>}
                ListFooterComponent={() => <View style={{ height: keyboardOpen ? 500 : 200 }} />}
            />

            <KeyboardAvoidingView behavior={'padding'} style={{ position: 'absolute', width: '100%', bottom: 0, backgroundColor: 'white' }}>
                 {actionReview && (isReply || isReplyBack) && <View style={{ paddingTop: 10, marginHorizontal: 5 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    <FontAwesome name="reply" size={16} color="black" />
                    <Text>Reply to</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 5 }}>
                    <Text>{actionReview.content.slice(0, 20) + '...'}</Text>
                    <FontAwesome name="close" size={16} color="gray" onPress={() => setIsReply(false)} />
                    </View>
                </View>}

                {actionReview && isEdit && <View style={{ paddingTop: 10, marginHorizontal: 5 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <FontAwesome name="pencil" size={16} color="black" />
                        <Text>{labels.edit}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 5 }}>
                    <FontAwesome name="close" size={16} color="gray" onPress={() => {setIsEdit(false); setContent('')}} />
                    </View>
                </View>}

                <View style={{borderWidth: 1, borderColor: '#ccc', borderRadius: 5}}>
                    <TextInput
                        style={{width: '100%'}}
                        onChangeText={(text) => setContent(text)}
                        value={content}
                        placeholder={(isReply || isReplyBack) ? labels.writeReply : labels.writeReview}
                        placeholderTextColor="#999"
                        multiline={true}
                    />
                    <View style={{width: '100%', alignItems: 'flex-end'}}>
                        <TouchableOpacity disabled={content.length === 0} style={{margin: 5}} onPress={onSaveReview}>
                            <MaterialIcons name="send" size={24} color="blue" />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{height: keyboardOpen ? 90 : 45}} />
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default SingleBookReviews
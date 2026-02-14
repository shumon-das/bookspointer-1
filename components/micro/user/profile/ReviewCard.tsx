import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'

import labels from '@/app/utils/labels'
import { styles } from '@/styles/libraryBooks.styles'
import ShareButton from '../../bookCardFooter/ShareButton'
import englishNumberToBengali from '@/app/utils/englishNumberToBengali'
import API_CONFIG from '@/app/utils/config'
import { useRouter } from 'expo-router'
import { useTempStore } from '@/app/store/temporaryStore'

const ReviewCard = ({review}: {review: any}) => {
    const tempStore = useTempStore();
    const router = useRouter();
    const handleBookReadPress = (review: any) => {
        tempStore.setSelectedReview(review);
        router.push('/screens/book/book-review');
    }
  return (
        <View key={review.id} style={styles.bookCard}>
        <View style={reviewStyles.bookImageContainer}>
            <Image source={{ uri: `${API_CONFIG.BASE_URL}/uploads/${ '' === review.image || !review.image ? 'default_cover_2.jpeg' : review.image}` }} style={reviewStyles.bookImage} />
        </View>
            <View style={reviewStyles.bookInfo}>
            <View style={{ marginHorizontal: 10 }}>
                <Text style={styles.bookTitle}>{review.title}</Text>
                <Text style={{color: 'gray'}}>{ englishNumberToBengali(review.reviews_count)} {labels.countReview}</Text>
            </View>
            <View style={reviewStyles.bookActions}>
                <TouchableOpacity style={styles.readButton} onPress={() => handleBookReadPress(review)}>
                <Image source={require('@/assets/images/book_review_icon.png')} style={{width: 20, height: 20}} />
                <Text style={{fontSize: 10}}>{labels.seeReviews}</Text>
                </TouchableOpacity>
                <View style={styles.shareButton}>
                <ShareButton
                    title="Check this out!"
                    message={review.title}
                    url={`https://bookspointer.com${review.url}`}
                    style={reviewStyles.shareButton}
                /> 
                </View>
            </View>
            </View>
        </View>
    )
}

export default ReviewCard

const reviewStyles = StyleSheet.create({
    bookImageContainer: {
        
    },
    bookImage: {
        width: 60,
        height: 80,
        resizeMode: 'cover',
        borderRadius: 5,
    },
    bookInfo: {
        height: 80,
    },
    bookActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        margin: 10,
    },
    readButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    shareButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 10,
        paddingVertical: 3,
    },
})
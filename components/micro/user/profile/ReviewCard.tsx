import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'

import labels from '@/app/utils/labels'
import { styles } from '@/styles/libraryBooks.styles'
import ShareButton from '../../bookCardFooter/ShareButton'
import englishNumberToBengali from '@/app/utils/englishNumberToBengali'
import API_CONFIG from '@/app/utils/config'
import { useRouter } from 'expo-router'
import { useReviewStore } from '@/app/store/reviewStore'

const ReviewCard = ({book}: {book: any}) => {
    const router = useRouter();
    const handleBookReadPress = (selectedBook: any) => {
        useReviewStore.getState().setSelectedBook({
            id: selectedBook.id,
            title: selectedBook.title,
            url: selectedBook.url,
            image: selectedBook.image,
            createdBy: {uuid: selectedBook.creator_uuid, name: selectedBook.creator_name}
        });
        router.push('/screens/book/single-book-reviews');
    }
  return (
        <View key={book.id} style={[styles.bookCard, {height: 100}]}>
            <View style={reviewStyles.bookImageContainer}>
                <Image source={{ uri: `${API_CONFIG.BASE_URL}/uploads/${ '' === book.image || !book.image ? 'default_cover_2.jpeg' : book.image}` }} style={reviewStyles.bookImage} />
            </View>
            <View style={reviewStyles.bookInfo}>
                <View style={{ marginHorizontal: 10 }}>
                    <Text style={styles.bookTitle}>{book.title}</Text>
                    <Text style={{color: 'gray'}}>{ englishNumberToBengali(book.reviews_count)} {labels.countReview}</Text>
                </View>
                <View style={reviewStyles.bookActions}>
                    <TouchableOpacity style={styles.readButton} onPress={() => handleBookReadPress(book)}>
                        <Image source={require('@/assets/images/book_review_icon.png')} style={{width: 20, height: 20}} />
                        <Text style={{fontSize: 10}}>{labels.seeReviews}</Text>
                    </TouchableOpacity>
                    <View style={reviewStyles.shareButton}>
                        <ShareButton
                            title="Check this out!"
                            message={book.title}
                            url={`https://bookspointer.com${book.url}`}
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
import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import API_CONFIG from '@/app/utils/config'
import labels from '@/app/utils/labels'
import Entypo from '@expo/vector-icons/Entypo';
import ShareButton from '../../bookCardFooter/ShareButton'
import { styles } from '@/styles/libraryBooks.styles';

const ReadingCompletedCard = ({book}: {book: any}) => {
    const handleBookReviewPress = (item: any) => {
        console.log(item)
    }
  return (
    <View key={book.book_id} style={styles.bookCard}>
        <Image source={{ uri: `${API_CONFIG.BASE_URL}/uploads/${ book.book_image || 'default_cover_2.jpeg'}` }} style={styles.bookImage} />
        <View style={styles.bookInfo}>
        <View>
            <Text style={styles.bookTitle}>{book.book_title}</Text>
            <Text style={styles.bookAuthor}>{book.author_first_name + ' ' + book.author_last_name}</Text>
        </View>
        <View style={styles.bookActions}>
            <TouchableOpacity style={styles.readButton} onPress={() => handleBookReviewPress(book)}>
            <Entypo name="open-book" size={16} color="black" style={{transform: [{ rotate: '18deg' }]}}/>
            <Text style={{fontSize: 10}}>{labels.writeReview}</Text>
            </TouchableOpacity>
            <View style={styles.shareButton}>
            <ShareButton
                title="Check this out!"
                message={book.book_title}
                url={`https://bookspointer.com${book.book_url}`}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}
            /> 
            </View>
        </View>
        </View>
    </View>
  )
}

export default ReadingCompletedCard
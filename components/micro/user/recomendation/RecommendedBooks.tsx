import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { User } from '@/components/types/User'
import API_CONFIG from '@/app/utils/config';
import labels from '@/app/utils/labels';
import { useRouter } from 'expo-router';

const RecommendedBooks = ({author, recommendedBooks}: {author: User|null, recommendedBooks: any[]}) => {
    const router = useRouter();
    const backurl = "/screens/user/user-profile";

    const renderItem = (book: any) => {
        return (
            <TouchableOpacity style={styles.bookCard} onPress={() => router.push({pathname: "/screens/book/details", params: {
                id: book.id, 
                title: book.title, 
                author: `${book.author_first_name} ${book.author_last_name}`,
                content: null,
                isQuote: 'no',
                backurl: backurl
            }})}>
                <Image source={{ uri: `${API_CONFIG.BASE_URL}/uploads/${'' === book.image || !book.image ? 'default_cover_3.jpeg' : book.image}` }} style={styles.bookImage} />
                <Text style={styles.bookTitle}>{book.title}</Text>
                <Text style={styles.bookAuthor}>{book.author_first_name} {book.author_last_name}</Text>
                <Text style={styles.bookCategory}>{book.category}</Text>
            </TouchableOpacity>
        )
    }

   return (
     <View>
        <Text style={styles.forYours}>{labels.forYours}</Text>
        <Text style={styles.basedOnYourReadHistory}>{labels.basedOnYourReadHistory}</Text>
        
        <FlatList
            data={recommendedBooks}
            renderItem={({item}) => renderItem(item)}
            keyExtractor={(item) => item?.id?.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
        />
     </View>
   )
}

export default RecommendedBooks

const styles = StyleSheet.create({
    forYours: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingVertical: 10,
    },
    basedOnYourReadHistory: {
        fontSize: 14,
        textAlign: 'center',
        paddingBottom: 10,
    },
    bookCard: {
        width: 150,
        height: 220,
        marginHorizontal: 5,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        position: 'relative',
    },
    bookImage: {
        width: '100%',
        height: '80%',
        resizeMode: 'cover',
    },
    bookTitle: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    bookAuthor: {
        fontSize: 12,
    },
    bookCategory: {
        fontSize: 12,
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        color: '#fff',
        padding: 5,
        borderRadius: 5,
    }
})
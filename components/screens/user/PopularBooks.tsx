import React, { useEffect, useState } from 'react';
import { View, Dimensions, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { User } from '@/components/types/User'
import API_CONFIG from '@/app/utils/config';
import labels from '@/app/utils/labels';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const VISIBLE_ITEMS = 4;
const ITEM_WIDTH = width / VISIBLE_ITEMS;

const PopularBooks = ({author}: {author: User|null}) => {
    const [books, setBooks] = useState([] as any[])

    const fetchPopularBooks = async (author: User) => {    
        const response = await fetch(`${API_CONFIG.BASE_URL}/pb/author/popular-books/${author.id}`) as any
        const data = await response.json();
        setBooks(data.popularBooks);
    }
    
    useEffect(() => {
        if (author) {
            fetchPopularBooks(author);
        }
    }, [author])

    const router = useRouter()
    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>{labels.popularBooks}</Text>
            <Carousel
                loop={false} // Usually better for small lists
                width={ITEM_WIDTH} // This dictates how many items are visible
                style={{ width: width }} // This ensures the carousel spans the full screen
                height={180}
                data={books}
                snapEnabled={true}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.cardWrapper} onPress={() => router.push({pathname: "/screens/book/details", params: {
                        id: item.id, 
                        title: item.title, 
                        author: author ? author.fullName : '-',
                        content: null,
                        isQuote: 'no',
                        backurl: null
                      }})}>
                        <View style={styles.bookCard}>
                            <Image 
                                source={{ uri: `${API_CONFIG.BASE_URL}/uploads/${null === item.image || '' === item.image ? 'mb_default_cover_2.jpg' : item.image}` }} 
                                style={styles.miniCover} 
                            />
                            <Text style={styles.miniTitle} numberOfLines={1}>
                                {item.title}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        height: 180,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        marginLeft: 10,
        marginBottom: 10,
        color: '#333',
    },
    cardWrapper: {
        width: ITEM_WIDTH,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4, // Space between the 4 books
    },
    bookCard: {
        width: '100%',
        alignItems: 'center',
    },
    miniCover: {
        width: '100%',
        height: 120, // Adjusted for 4-item scale
        borderRadius: 8,
        backgroundColor: '#e0e0e0',
    },
    miniTitle: {
        fontSize: 12,
        marginTop: 5,
        textAlign: 'center',
        fontWeight: '700',
    },
});

export default PopularBooks;
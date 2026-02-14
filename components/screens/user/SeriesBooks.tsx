import { View, Text, ActivityIndicator, TouchableOpacity, Image, StyleSheet, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { User } from '@/components/types/User'
import API_CONFIG from '@/app/utils/config'
import SeriesBookCardActions from './SeriesBookCard'
import { useRouter } from 'expo-router'
import { useUserStore } from '@/app/store/userStore';

const SeriesBooks = ({series, author, isUser}: {series: string, author: User|null, isUser?: boolean}) => {
    const [seriesBooks, setSeriesBooks] = useState([] as any[])
    const router = useRouter();
    const authUser = useUserStore((state) => state.authUser);

    const fetchSeriesBooks = async (author: User) => {
        const url = `${API_CONFIG.BASE_URL}/${isUser ? 'user' : 'author'}-series-books/${author.uuid}/${series}`
        const response = await fetch(url) as any
        const data = await response.json();
        setSeriesBooks(data.seriesBooks);
    }

    useEffect(() => {
        if (author) {
            fetchSeriesBooks(author);
        }
    }, [author, series])

    if (seriesBooks.length <=0) return <ActivityIndicator size={'large'} color={'#085a80'} style={{marginVertical: 20}} />

    return (<FlatList 
                data={seriesBooks} 
                renderItem={({item}) => (
                    <View style={styles.item}>
                        <TouchableOpacity onPress={() => router.push({pathname: "/screens/book/details", params: {
                            id: item.id, 
                            title: item.title, 
                            author: author?.fullName,
                            content: null,
                            isQuote: 'no',
                            backurl: JSON.stringify({pathname: "/screens/user/user-series", params: { series: series }})
                        }})}>
                            <Image 
                                source={{ uri: `${API_CONFIG.BASE_URL}/uploads/${null === item.image || '' === item.image ? 'mb_default_cover_2.jpg' : item.image}` }} 
                                style={styles.miniCover} 
                            />
                            <Text style={styles.miniTitle}>{item.title}</Text>
                            <Text style={styles.miniAuthor}>{author?.fullName}</Text>
                        </TouchableOpacity>
                        {authUser && authUser.uuid === author?.uuid &&<SeriesBookCardActions book={item} author={author} />}
                    </View>
                )}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                columnWrapperStyle={styles.gridContainer}
                ListFooterComponent={<View style={{height: 900}}></View>}
            />)
}

export default SeriesBooks

const styles = StyleSheet.create({
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        padding: 6,
    },
    item: {
        width: 150,
        height: 270,
        backgroundColor: 'white',
        marginHorizontal: 8,
        marginVertical: 5,
        padding: 10,
        borderRadius: 10,
        flexDirection: 'column',
        justifyContent: 'space-around',
    },
    miniCover: {
        width: '100%',
        height: 180,
        borderRadius: 8,
        backgroundColor: '#e0e0e0',
    },
    miniTitle: {
        fontSize: 12,
        marginTop: 5,
        textAlign: 'center',
        fontWeight: '700',
    },
    miniAuthor: {
        fontSize: 12,
        marginTop: 5,
        textAlign: 'center',
        fontWeight: '400',
        color: 'gray',
    },
})
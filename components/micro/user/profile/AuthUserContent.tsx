import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import React from 'react'
import { AuthUser } from '@/components/types/User'
import RecommendedBooks from '../recomendation/RecommendedBooks'
import { router } from 'expo-router';
import labels from '@/app/utils/labels';
import { Entypo, Ionicons } from '@expo/vector-icons';

const AuthUserContent = ({author}: {author: AuthUser}) => {
    const screens = [
        {title: labels.userBookTypes.library, icon: <Ionicons name="bookmark-sharp" size={20} color="black" />, onPress: () => router.push('/screens/user/library-books')},
        {title: labels.currentlyReading, icon: <Entypo name="open-book" size={20} color="black" />, onPress: () => router.push('/screens/user/currently-reading')},
        {title: labels.review, icon: 'reviews', onPress: () => router.push('/screens/user/reviews')},
        {title: labels.readingComplete, icon: <Entypo name="open-book" size={20} color="black" />, onPress: () => router.push('/screens/user/reading-completed')},
        {title: labels.resentActivity, icon: <Entypo name="open-book" size={20} color="black" />, onPress: () => router.push('/screens/user/recent-activities')},
    ]
    return (
       <View>
           <RecommendedBooks author={author} recommendedBooks={author.recommendedBooks} />
           <View style={styles.container}>
               {screens.map((item, index) => (
                    <TouchableOpacity key={index} onPress={item.onPress} style={styles.item}>
                        {item.icon === 'reviews' 
                            ? <Image source={require('@/assets/images/book_review_icon.png')} style={{width: 24, height: 20}} /> 
                            : item.icon
                        }
                        <Text style={styles.itemText}>{item.title}</Text>
                    </TouchableOpacity>
                ))}
           </View>
       </View>
    )
}

export default AuthUserContent

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10,
        marginTop: 30,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    itemIcon: {
        marginRight: 10,
        width: 30,
    },
    itemText: {
        fontSize: 16,
        marginHorizontal: 20
    },
})
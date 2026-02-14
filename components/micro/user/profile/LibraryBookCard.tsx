import { View, Text, Image, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import API_CONFIG from '@/app/utils/config'
import labels from '@/app/utils/labels'
import { Entypo } from '@expo/vector-icons'
import ShareButton from '../../bookCardFooter/ShareButton'
import { styles } from '@/styles/libraryBooks.styles'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import { useBookLibraryStore } from '@/app/store/bookLibraryStore'

const LibraryBookCard = ({book, onRemoveBook}: {book: any, onRemoveBook: (b: any) => void}) => {
    const router = useRouter();
    const backurl = "/screens/user/user-profile";
    const bookLibraryStore = useBookLibraryStore();
    
    const handleBookReadPress = (book: any) => {
    router.push({pathname: "/screens/book/details", params: {
        id: book.id, 
        title: book.title, 
        author: `${book.author.fullName}`,
        content: null,
        isQuote: 'no',
        backurl: backurl
    }})
  }

    const handleBookRemovePress = async (book: any) => {
        const storageUser = await AsyncStorage.getItem('auth-user')
        const loggedInUser = storageUser ? JSON.parse(storageUser) : null
        if (!loggedInUser) {
            Alert.alert(labels.pleaseLoginToContinue)
            return;
        };
        
        Alert.alert(
            labels.removeBook,
            labels.removeLibraryBookWarning,
            [
                {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
                },
                {
                text: 'Delete',
                onPress: async () => {
                    const data = await bookLibraryStore.addToLibrary({
                    bookId: book.id,
                    userId: loggedInUser.id,
                    isSave: false,
                    action: 'save-remove',
                    }) as any
                    console.log(data)
                    if (data) {
                        onRemoveBook(data)
                    }
                },
                }
            ]
        )
    }

    return (
        <View key={book.id} style={styles.bookCard}>
            <Image source={{ uri: `${API_CONFIG.BASE_URL}/uploads/${ 'default_cover_2.jpeg'}` }} style={styles.bookImage} />
            <View style={styles.bookInfo}>
            <View>
                <Text style={styles.bookTitle}>{book.title}</Text>
                <Text style={styles.bookAuthor}>{book.author.fullName}</Text>
            </View>
            <View style={styles.bookActions}>
                <TouchableOpacity style={styles.readButton} onPress={() => handleBookReadPress(book)}>
                <Entypo name="open-book" size={16} color="black" style={{transform: [{ rotate: '18deg' }]}}/>
                <Text style={{fontSize: 10}}>{labels.read}</Text>
                </TouchableOpacity>
                <View style={styles.shareButton}>
                <ShareButton
                    title="Check this out!"
                    message={book.title}
                    url={`https://bookspointer.com${book.url}`}
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}
                /> 
                </View>
                <TouchableOpacity style={styles.removeButton} onPress={() => handleBookRemovePress(book)}>
                <Entypo name="trash" size={12} color="black" />
                <Text style={{fontSize: 10}}>{labels.delete}</Text>
                </TouchableOpacity>
            </View>
            </View>
            <Text style={styles.bookCategory}>{book.category}</Text>
        </View>
    )
}

export default LibraryBookCard
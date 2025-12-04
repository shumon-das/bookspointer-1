import labels from '@/app/utils/labels'
import { AddToLibraryBook } from '@/services/api'
import { fetchLibraryBooks } from '@/services/profileApi'
import { FontAwesome5 } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import {View, Text, FlatList, TouchableOpacity, Alert, StyleSheet} from 'react-native'
import { Snackbar } from 'react-native-paper'

const UserLibrary = ({authorId}: {authorId: number}) => {
    const router = useRouter()
    const [books, setBooks] = useState([] as any[])
    const [showSnackBar, setShowSnakBar] = useState(false)
    const [snackBarMessage, setSnakBarMessage] = useState('')

    useEffect(() => {
        const getLibraryBooks = async () => {
            const data = await fetchLibraryBooks(authorId, true)
            setBooks(data)
        }

        getLibraryBooks()
    }, [authorId])

    const deleteFromLibrary = (item: any) => {console.log(item)
        Alert.alert(labels.deleteItem.areYouSure,labels.deleteItem.removeFromLibrary, [
            { text: labels.sortWords.no, style: "cancel" },
            { text: labels.sortWords.yes, onPress: async () => {
                const token = await AsyncStorage.getItem('auth-token')
                if (!token) {
                    Alert.alert(labels.sorry, labels.pleaseLoginToContinue)
                    return
                }

                const newItems = books.filter((b: any) => item.item.title !== b.title);
                setBooks(newItems)
                
                const response = await AddToLibraryBook({
                    bookId: item.item.id,
                    userId: authorId,
                    isSave: false,
                    action: 'save-remove',
                }, token)
        
                if (response && !response.details.save.includes(item.item.id)) {
                    setSnakBarMessage(labels.removedBookFromLibrary)
                    setShowSnakBar(true)
                }
            }}
        ]);
    }

    const renderItem = (item: any) => {
        return (
            <View style={styles.item}>
                <TouchableOpacity style={{marginHorizontal: 10, width: '80%'}} onPress={() => router.push({
                    pathname: "/screens/book/details", 
                    params: {id: item.item.id, title: item.item.title, author: item.item.author.fullName}
                })}>
                    <Text style={{color: '#f0ececff', fontSize: 16}}>{item.item.title}</Text>
                    <Text style={{color: '#f0ececff', fontSize: 10}}>{item.item.author.fullName}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{marginHorizontal: 5, paddingHorizontal: 10}} onPress={() => deleteFromLibrary(item)}>
                    <Text style={{color: '#f0ececff'}}>
                        <FontAwesome5 name="trash" size={18}/>
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (<View>
        <View style={{marginTop: 10}}>
            <FlatList 
                data={books} 
                keyExtractor={(item) => item.id} 
                renderItem={renderItem}
            />
        </View>
        <View>
            <Snackbar visible={showSnackBar} onDismiss={() => setShowSnakBar(false)} duration={3000}>{snackBarMessage}</Snackbar> 
        </View>
    </View>)
}

export default UserLibrary

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginHorizontal: 10,
        marginVertical: 2,
        backgroundColor: '#085a80',
        paddingVertical: 8,
        borderRadius: 5,
    }
})
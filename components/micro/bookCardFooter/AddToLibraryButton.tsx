import { labels } from '@/app/utils/labels';
import React, { useEffect, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AddToLibraryBook } from '@/services/api';

const AddToLibrary = ({ book }: {book: any}) => {
    const [isSaved, setIsSaved] = useState(false)
    const [user, setUser] = useState(null as any)

    useEffect(() => {
        const loadLoggedInUser = async () => {
            const storedUser = await AsyncStorage.getItem('auth-user');
            setUser(storedUser ? JSON.parse(storedUser) : null);
            setIsSaved(book.details.save.includes(user.id))
        }

        loadLoggedInUser()
    }, [book])

    const onSave = async () => {
        const token = await AsyncStorage.getItem('auth-token')        
        if (!user || !token) {
            Alert.alert(labels.sorry, labels.pleaseLoginToContinue)
            return;
        }
        
        const response = await AddToLibraryBook({
            bookId: book.id,
            userId: user.id,
            isSave: !isSaved,
            action: 'save-remove',
        }, token)

        if (response) {
            setIsSaved(response.details.save.includes(user.id))
        }
    }
  return (
    <View style={{}}>
        <TouchableOpacity onPress={onSave} >
            <Text style={{ textAlign: 'center', color: 'lightgray'}}>
                {isSaved && <MaterialIcons name="library-add-check" size={22} color="black" />}
                {!isSaved && <MaterialIcons name="my-library-add" size={22} color="gray" /> }
            </Text>
            <Text style={{fontSize: 10, color: '#282C35'}}>{isSaved ? labels.AddedToLibrary : labels.AddToLibrary}</Text>
        </TouchableOpacity>
    </View>
  )
}

export default AddToLibrary
import { labels } from '@/app/utils/labels';
import React, { useEffect, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useBookLibraryStore } from '@/app/store/bookLibraryStore';

const AddToLibrary = ({ book, variant }: {book: any; variant?: 'feed'}) => {
    const [isSaved, setIsSaved] = useState(false)
    const [user, setUser] = useState(null as any)
    const bookLibraryStore = useBookLibraryStore()

    useEffect(() => {
        const loadLoggedInUser = async () => {
            const storedUser = await AsyncStorage.getItem('auth-user');
            setUser(storedUser ? JSON.parse(storedUser) : null);
            setIsSaved(book.isSaved)
        }

        loadLoggedInUser()
    }, [book])

    const onSave = async () => {
        const storedUser = await AsyncStorage.getItem('auth-user');
        const user = storedUser ? JSON.parse(storedUser) : null;
        const token = await AsyncStorage.getItem('auth-token')        
        if (!user || !token) {
            Alert.alert(labels.sorry, labels.pleaseLoginToContinue)
            return;
        }
        
        const response = await bookLibraryStore.addToLibrary({
            bookId: book.id,
            userId: user.id,
            isSave: !isSaved,
            action: 'save-remove',
        }) as any

        if (response) {
            setIsSaved(response.isSaved)
        }
    }
  return (
    <View style={variant === 'feed' ? { alignItems: 'center' } : {}}>
        <TouchableOpacity onPress={onSave} style={variant === 'feed' ? { alignItems: 'center' } : undefined}>
            {variant === 'feed' && <View style={{ width: 30, height: 30, borderRadius: 10, backgroundColor: isSaved ? '#e8f6ef' : '#eef2f7', alignItems: 'center', justifyContent: 'center' }}><MaterialIcons name={isSaved ? 'library-add-check' : 'my-library-add'} size={16} color={isSaved ? '#3e9566' : '#526173'} /></View>}
            {variant !== 'feed' && <Text style={{ textAlign: 'center', color: 'lightgray'}}>
                {isSaved && <MaterialIcons name="library-add-check" size={14} color="black" />}
                {!isSaved && <MaterialIcons name="my-library-add" size={14} color="gray" /> }
            </Text>}
            <Text style={{fontSize: 10, color: variant === 'feed' ? (isSaved ? '#3e9566' : '#526173') : '#282C35', fontWeight: variant === 'feed' ? '700' : undefined, marginTop: variant === 'feed' ? 3 : undefined}}>{isSaved ? labels.AddedToLibrary : labels.AddToLibrary}</Text>
        </TouchableOpacity>
    </View>
  )
}

export default AddToLibrary
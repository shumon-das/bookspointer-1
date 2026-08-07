import { labels } from '@/app/utils/labels';
import React, { useEffect, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useBookLibraryStore } from '@/app/store/bookLibraryStore';

const AddToLibrary = ({ book, variant, onChanged }: {book: any; variant?: 'feed'; onChanged?: (isSaved: boolean) => void}) => {
    const [isSaved, setIsSaved] = useState(false)
    const [saving, setSaving] = useState(false)
    const bookLibraryStore = useBookLibraryStore()

    useEffect(() => {
        const loadLoggedInUser = async () => {
            setIsSaved(Boolean(book.isSaved))
        }

        loadLoggedInUser()
    }, [book])

    const onSave = async () => {
        if (saving) return;
        const storedUser = await AsyncStorage.getItem('auth-user');
        const user = storedUser ? JSON.parse(storedUser) : null;
        const token = await AsyncStorage.getItem('auth-token')        
        if (!user || !token) {
            Alert.alert(labels.sorry, labels.pleaseLoginToContinue)
            return;
        }
        
        setSaving(true)
        try {
            const response = await bookLibraryStore.addToLibrary({
                bookId: book.id,
                userId: user.id,
                isSave: !isSaved,
                action: 'save-remove',
            }) as any

            if (response && typeof response.isSaved === 'boolean') {
                setIsSaved(response.isSaved)
                onChanged?.(response.isSaved)
            }
        } finally {
            setSaving(false)
        }
    }
  return (
    <View style={variant === 'feed' ? { width: '100%' } : {}}>
        <TouchableOpacity disabled={saving} onPress={onSave} style={[variant === 'feed' ? { width: '100%', minHeight: 44, alignItems: 'center', justifyContent: 'center' } : undefined, saving ? { opacity: 0.55 } : undefined]}>
            {variant === 'feed' && <View style={{ width: 26, height: 26, borderRadius: 8, backgroundColor: isSaved ? '#e8f6ef' : '#eef2f7', alignItems: 'center', justifyContent: 'center' }}><MaterialIcons name={isSaved ? 'library-add-check' : 'my-library-add'} size={14} color={isSaved ? '#3e9566' : '#526173'} /></View>}
            {variant !== 'feed' && <Text style={{ textAlign: 'center', color: 'lightgray'}}>
                {isSaved && <MaterialIcons name="library-add-check" size={14} color="black" />}
                {!isSaved && <MaterialIcons name="my-library-add" size={14} color="gray" /> }
            </Text>}
            <Text numberOfLines={1} style={{fontSize: 9, color: variant === 'feed' ? (isSaved ? '#3e9566' : '#526173') : '#282C35', fontWeight: variant === 'feed' ? '700' : undefined, marginTop: variant === 'feed' ? 2 : undefined}}>{isSaved ? labels.AddedToLibrary : labels.AddToLibrary}</Text>
        </TouchableOpacity>
    </View>
  )
}

export default AddToLibrary

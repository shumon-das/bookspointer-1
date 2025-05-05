import { useAuthStore } from '@/app/store/auth';
import { saveBookIntoLibrary } from '@/services/savesApi';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';


const SaveButton = ({ bookId, onSaveToLibrary }: {bookId: number, onSaveToLibrary: (isSave: Boolean) => void}) => {
    const user = useAuthStore((state) => state.user)
    const token = useAuthStore((state) => state.token)
    const router = useRouter()
    const [isSaved, setIsSaved] = useState(false)
    const onSave = async () => {
        if (!user || !token) {
            router.push('/auth/login')
            return
        }
        setIsSaved(!isSaved)

        try {
            const value = {
                bookId: bookId,
                userId: user.id,
                isSave: isSaved,
                action: 'save-remove',
            }
        
            saveBookIntoLibrary(value, token)
            onSaveToLibrary(true)
        
        } catch (error: any) {
        console.error('Error saving:', error.message);
        }
    };

  return (
    <View>
      <TouchableOpacity onPress={onSave} >
        <Icon name={isSaved ? "bookmark" : "bookmark-o"} size={20} color="gray" />
      </TouchableOpacity>
    </View>
  );
};

export default SaveButton;

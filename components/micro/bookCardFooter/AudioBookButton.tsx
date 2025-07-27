import { labels } from '@/app/utils/labels';
import { BookCardProps } from '@/components/types/BookCard';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const AudioBookButton = ({ book, onClickToPlay }: {book: BookCardProps, onClickToPlay: (isSave: Boolean) => void}) => {
  const router = useRouter();
  
  return (
    <View style={{}}>
        <TouchableOpacity onPress={() => router.push({pathname: '/(tabs)/audio', params: { book: JSON.stringify(book) }})} >
            <Text style={{position: 'relative', textAlign: 'center'}}>
                <Feather name="book" size={20} color={'#282C35'} />
            </Text>
            <Text style={{position: 'absolute', top: 1, left: '37%', color: 'lightgray'}}>
                <Entypo name="controller-play" size={14} color="gray" />
            </Text>
            <Text style={{fontSize: 10, color: '#282C35'}}>{labels.audioBook}</Text>
        </TouchableOpacity>
    </View>
  )
}

export default AudioBookButton
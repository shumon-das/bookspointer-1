import { labels } from '@/app/utils/labels';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

const AudioBookButton = ({ bookId, onClickToPlay }: {bookId: number, onClickToPlay: (isSave: Boolean) => void}) => {
  return (
    <View style={{}}>
        <TouchableOpacity onPress={() => Alert.alert(labels.sorry, labels.audioBookNotAvailable)} >
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
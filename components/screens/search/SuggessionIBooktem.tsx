import { View, Text } from 'react-native'
import React from 'react'
import TextContent from '../book/TextContent'
import { Image } from 'react-native'
import API_CONFIG from '@/app/utils/config'

const SuggessionBookItem = ({item}: {item: any}) => {
    const strippedContent = item.content.replace(/<[^>]*>?/gm, '');
    const previewText = strippedContent.length > 120 
        ? strippedContent.slice(0, 120) + '...' 
        : strippedContent;

  return (<View style={{height: 100, overflow: 'hidden',backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderColor: '#ccc' }}>
        <View>
            <Image source={{uri: `${API_CONFIG.BASE_URL}/uploads/default_cover_2.jpeg`}} style={{width: 70, height: 80}} />
        </View>
        <View style={{width: '80%'}}>
            <Text style={{marginLeft: 10, paddingBottom: 3, fontSize: 15, fontWeight: '600'}}>{item.title} - {item.author}</Text>
            <View style={{marginHorizontal: 10}}>
                <TextContent content={previewText} fontSize={12} />
            </View>
        </View>
    </View>
  )
}

export default SuggessionBookItem
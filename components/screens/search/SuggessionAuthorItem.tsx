import { View, Text, Image } from 'react-native'
import React from 'react'
import API_CONFIG from '@/app/utils/config'
import TextContent from '../book/TextContent'

const SuggessionAuthorItem = ({item}: {item: any}) => {
    const strippedContent = item.content.replace(/<[^>]*>?/gm, '');
    const previewText = strippedContent.length > 120 
        ? strippedContent.slice(0, 80) + '...' 
        : strippedContent;

  return (<View style={{backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderColor: '#ccc' }}>
        <View>
            <Image source={{uri: `${API_CONFIG.BASE_URL}/uploads/${item.image || 'user.png'}`}} style={{width: 40, height: 40, borderRadius: 50}} />
        </View>
        <View style={{width: '80%'}}>
            <Text style={{marginLeft: 10, paddingBottom: 3, fontSize: 15, fontWeight: '600'}}>{
              item.result_type === 'user' ? item.author : item.fullName
            }</Text>
            <View style={{marginHorizontal: 10, height: 38, overflow: 'hidden'}}>
                <TextContent content={previewText} fontSize={12} />
            </View>
        </View>
    </View>)
}

export default SuggessionAuthorItem
import { TouchableOpacity, View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AuthUser, User } from '@/components/types/User'
import { styles } from '@/styles/author.styles'
import TextContent from '../book/TextContent';
import labels from '@/app/utils/labels';

const Description = ({author}: {author: User | AuthUser | null}) => {
  const [shortDesc, setShortDesc] = useState(true)
  const [description, setDescription] = useState('-')

  useEffect(() => {
    if (author) {
      setDescription(Object.keys(author).includes('description') 
        ? author?.description || 'লেখক সম্পর্কে কোন তথ্য নেই।' 
        : author?.details?.description || 'লেখক সম্পর্কে কোন তথ্য নেই।')
    }
  }, [author])

  const content = shortDesc ? description.split(' ').slice(0, 50).join(' ') + '...' : description
  return (
    <View style={styles.description}>
      <TextContent content={content} backgroundColor='#f9f0eb'/>
      <TouchableOpacity onPress={() => setShortDesc(!shortDesc)}>
        <Text style={{textAlign: 'right', color: 'blue'}}>{shortDesc ? labels.b.readMore : labels.b.readLess}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Description
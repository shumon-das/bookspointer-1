import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import HtmlContent from '../HtmlContent'

interface DescriptionProps {
    description: string
}

const UserDescription = ({description}: DescriptionProps) => {
    const [readMore, setReadMore] = useState(false)
    const descriptionContent = !readMore 
        ? description.slice(0, 75) + ' <a style="color: blue">...আরও পড়ুন</a>' 
        : description + ' <a>...কম পড়ুন</a>'
  
    return (
        <View style={{
            height: description !== '-' ? (!readMore ? 40 : '100%') : 0, 
            overflow: 'hidden',
            marginTop: 5,
            paddingHorizontal: 5
        }}>
            <ScrollView style={{paddingHorizontal: 5}}>
                <TouchableOpacity onPress={() => setReadMore(!readMore)}>
                    <HtmlContent content={ descriptionContent ?? 'লেখক সম্পর্কে কোন তথ্য নেই।'} />
                </TouchableOpacity>
            </ScrollView>
        </View>
    )
}

export default UserDescription

const styles = StyleSheet.create({
    readMore: {
        width: '100%', 
        textAlign: 'right', 
        paddingHorizontal: 12, 
        color: 'blue'
    }
})
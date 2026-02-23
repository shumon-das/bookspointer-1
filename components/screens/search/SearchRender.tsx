import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import SuggessionBookItem from './SuggessionIBooktem'
import SuggessionAuthorItem from './SuggessionAuthorItem'
import { useBookDetailsStore } from '@/app/store/bookDetailsStore'

const SearchRender = ({item, searchSubject, onSelect}: any) => {
    const router = useRouter()
    
    if (searchSubject === 'books' || item.result_type === 'book') {
        return (<TouchableOpacity onPress={() => {
            useBookDetailsStore.getState().setSelectedBook(item)
            router.push({
                pathname: "/screens/book/details", 
                params: {id: item.id, title: item.title, author: item.author}})
            }}>
            <SuggessionBookItem item={item} />
        </TouchableOpacity>)
    }

    if (searchSubject === 'authors' || item.result_type === 'author' || item.result_type === 'user') {
        return (<TouchableOpacity onPress={() => {
            router.push({
                pathname: item.url.includes('/author/') 
                    ? "/screens/author/author-profile"
                    : "/screens/user/visit-user", 
                params: {uuid: item.uuid}})
            }}>
            <SuggessionAuthorItem item={item} />
        </TouchableOpacity>)
    }
    // return (<TouchableOpacity onPress={() => {router.push({pathname: "/screens/book/details", params: {id: item.id, title: item.title, author: item.fullName}})}}>
    return (<TouchableOpacity onPress={() => {onSelect(item)}}>
        <View style={{backgroundColor: '#fff'}}>
            <Text style={{marginLeft: 10, paddingTop: 8, paddingBottom: 3, fontSize: 15, fontWeight: '600'}}>{item.title}</Text>
            <Text style={{marginLeft: 10, paddingBottom: 8, fontSize: 12}}>{
                Object.keys(item).includes('fullName') 
                    ? item.fullName 
                    : Object.keys(item).includes('author') 
                        ? item.author 
                        : item.title
                }
            </Text>
        </View>
    </TouchableOpacity>)
}

export default SearchRender
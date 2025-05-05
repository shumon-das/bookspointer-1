import { searchData } from '@/services/searchapi'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Stack, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { FlatList, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useCacheStore } from '../store/search'
import { labels } from '../utils/labels'

interface SearchItem {
    id: number;
    uuid: string;
    title: string;
    fullName: string;
    category: string
}

const search = () => {
    const cache = useCacheStore((state) => state.cache)
    const getFromCache = useCacheStore((state) => state.getFromCache)
    const hasInCache = useCacheStore((state) => state.hasInCache)
    const setInCache = useCacheStore((state) => state.setInCache)

    const router = useRouter()
    const [searchText, setSearchText] = useState('')
    const [data, setData] = useState([] as SearchItem[])
    const [focusStyle, setFocusStyle] = useState({})

    const handleSearch = async (text: string) => {
        setSearchText(text)
        if (!hasInCache(text.trim())) {
            const result = await searchData(text);
            setData(result)
            setInCache(text.trim(), result)
            return
        }
        setData(getFromCache(text.trim()))
    }

    const Item = ({searchItem}: {searchItem: SearchItem}) => (
        <View style={{backgroundColor: '#fff'}}>
            <Text style={{marginLeft: 10, paddingTop: 8, paddingBottom: 3, fontSize: 15, fontWeight: '600'}}>{searchItem.title}</Text>
            <Text style={{marginLeft: 10, paddingBottom: 8, fontSize: 12}}>{searchItem.fullName}</Text>
        </View>
    );

    useEffect(() => {
        setData(data)
    }, [])
  return (
    <SafeAreaView>
      <SafeAreaView>
        <Stack.Screen
            options={{ headerShown: false }}
        />
        <View style={[{
            flexDirection: 'row', 
            justifyContent: 'center', 
            alignItems: 'center',
            height: 50,
            marginTop: 50,
            marginBottom: 10,
            marginHorizontal: 10,
            borderWidth: 1,
            padding: 10,
            backgroundColor: '#fff',
            borderColor: 'lightgray',
            borderRadius: 25
         }, focusStyle]}>
            <View style={{width: '15%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <FontAwesome name="search" size={20} color='gray' />
            </View>
            <TextInput
                style={{
                    width: '85%',
                    height: 50,
                    color: '#000',
                    fontFamily: 'Poppins',
                    marginLeft: 5
                }}
                onChangeText={handleSearch}
                value={searchText}
                placeholder={labels.search}
                onFocus={() => setFocusStyle({
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                })}
            />
        </View>
        <View style={{paddingBottom: 100}}>
            <FlatList
                data={data}
                renderItem={({item}) => <TouchableOpacity onPress={() => {
                    router.push({pathname: "/book/[id]", params: {id: item.id, title: item.title, author: item.fullName}})
                }}>
                    <Item searchItem={item} />
                    </TouchableOpacity>
                }
                keyExtractor={item => item.id.toString()}
            />
        </View>
      </SafeAreaView>
    </SafeAreaView>
  )
}

export default search

const styles2 = StyleSheet.create({

})

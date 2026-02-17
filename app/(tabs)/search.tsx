import SearchListHeader from '@/components/screens/search/SearchListHeader'
import SearchRender from '@/components/screens/search/SearchRender'
import { styles } from '@/helper/search'
import { searchAuthorData, searchData, separateSearchByBookAndAuthorOrAll } from '@/services/searchapi'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Stack, useFocusEffect, useLocalSearchParams } from 'expo-router'
import React, { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, SafeAreaView, Text, TextInput, View } from 'react-native'
import { useCacheStore } from '../store/search'
import { labels } from '../utils/labels'

interface SearchItem {
    id: number;
    uuid: string;
    title: string;
    fullName?: string;
    author?: string;
    category: string;
    author_id?: number;
    book_id?: number;
}

const search = () => {
    const { authorId, fullName } = useLocalSearchParams();

    const cache = useCacheStore((state) => state.cache)
    const getFromCache = useCacheStore((state) => state.getFromCache)
    const hasInCache = useCacheStore((state) => state.hasInCache)
    const setInCache = useCacheStore((state) => state.setInCache)

    const [searchText, setSearchText] = useState('')
    const [data, setData] = useState([] as SearchItem[])
    const [focusStyle, setFocusStyle] = useState({})
    const [author, setAuthor] = useState<number | null>(null);
    const [searchSubject, setSearchSubject] = useState('all');
    const [isSuggession, setIsSuggession] = useState(false)
    const [suggessions, setSuggessions] = useState([] as SearchItem[])
    const [loading, setLoading] = useState(false)

    useFocusEffect(useCallback(() => {
        if (authorId && fullName) {
            setAuthor(parseInt(authorId as string));
        }
    }, [authorId, fullName]))

    const handleSearch = async (text: string) => {
        setIsSuggession(false)
        setSearchText(text)
        if (!hasInCache(text.trim())) {
            const result = authorId ? await searchAuthorData(text, author as number) : await searchData(text);
            setData(result)
            setInCache(text.trim(), result)
            return
        }
        setData(getFromCache(text.trim()))
    }

    const handleExtremeSearch = async (text: string, searchSubject: string) => {
        setLoading(true)
        setData([])
        const result = await separateSearchByBookAndAuthorOrAll(text, searchSubject, 1, 20);
        setSuggessions(result.suggessions)
        setIsSuggession(true)
        setLoading(false)
    }

    useEffect(() => {
        setData(data)
    }, [])

    return (
        <SafeAreaView>
            <SafeAreaView>
                <Stack.Screen options={{ headerShown: false }} />
                <View style={[styles.header, focusStyle]}>
                    <View style={{ width: '15%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <FontAwesome name="search" size={20} color='gray' />
                    </View>
                    <TextInput
                        style={{ width: '85%', height: 50, color: '#000', fontFamily: 'Poppins', marginLeft: 5 }}
                        onChangeText={handleSearch}
                        value={searchText}
                        placeholder={labels.search}
                        placeholderTextColor="#999"
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
                        onSubmitEditing={() => {
                            handleExtremeSearch(searchText, searchSubject);
                        }}
                        // Optional: Changes the keyboard button label (e.g., "search", "go", "next")
                        returnKeyType="search"
                    />
                </View>
                {fullName && <View>
                    <Text style={{ textAlign: 'center', color: 'gray' }}>{`${fullName} ${labels.searhWriterBooks}`}</Text>
                </View>}
                <View style={{ paddingBottom: 100 }}>

                    <FlatList
                        data={isSuggession ? suggessions : data}
                        renderItem={({ item }) => <SearchRender item={item} searchSubject={searchSubject} />}
                        keyExtractor={(item) => item.uuid.toString()}
                        ListHeaderComponent={() => (<SearchListHeader subject={searchSubject} onChangeSubject={(subject) => {
                            setSuggessions([])
                            setSearchSubject(subject);
                            handleExtremeSearch(searchText, subject);
                        }} />)}
                        ListEmptyComponent={() => (loading ? <ActivityIndicator size="large" color="#000" /> :<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text>No results found</Text>
                        </View>)}
                        ListFooterComponent={() => (<View style={{ height: 200 }}></View>)}
                    />
                </View>
            </SafeAreaView>
        </SafeAreaView>
    )
}

export default search

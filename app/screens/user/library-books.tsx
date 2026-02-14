import { View, Text, ActivityIndicator, FlatList } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { AuthUser } from '@/components/types/User';
import { useUserStore } from '@/app/store/userStore';
import LibraryBookCard from '@/components/micro/user/profile/LibraryBookCard';
import { useNavigation } from 'expo-router';
import labels from '@/app/utils/labels';
import { styles } from '@/styles/libraryBooks.styles';
import SearchInput from '@/components/micro/SearchInput';
import { updateAuthUser } from '@/app/utils/database/insertAllUsers';

const LibraryBooks = () => {
    const navigation = useNavigation();
    useEffect(() => navigation.setOptions({ headerShown: false }), []);
    const [author, setAuthor] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [libraryBooks, setLibraryBooks] = useState([] as any[]);
    const [filteredBooks, setFilteredBooks] = useState([] as any[]);
    const [isFilterNotFound, setIsFilterNotFound] = useState(false);

    const getAuthorFromDb = async () => {
        setLoading(true);
        const authUser = await useUserStore.getState().fetchAuthUserFromDb() as AuthUser;
        setAuthor(authUser);
        setLibraryBooks(authUser.libraryBooks);
        setLoading(false);
    }

    useEffect(() => {
        getAuthorFromDb();
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#e63946" />
            </View>
        )
    }

    if (!author) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>User not found</Text>
            </View>
        )
    }

    const onRemoveBookFromLibrary = async (book: any) => {
        // [data.id, data.uuid, data.fullName, JSON.stringify(data), Date.now()]
        author.libraryBooks = author.libraryBooks.filter((b) => b.id !== book.id)
        await updateAuthUser(author)
        setLibraryBooks(libraryBooks.filter((b) => b.id !== book.id))
    }

    return (
        <View style={{backgroundColor: '#f9f0eb'}}>
            <View>
                <View style={{width: '100%', height: 35, backgroundColor: 'dimgrey'}}></View>
                <Text style={styles.forYours}>{labels.yourLibrary}</Text>
                <Text style={styles.basedOnYourReadHistory}>{labels.yourLibraryBooks}</Text>
                <View style={{width: "100%", height: 50, backgroundColor: '#f9f0eb', justifyContent: "center", alignItems: "center", margin: 'auto'}}>
                    <View style={{width: '90%'}}>
                    <SearchInput 
                        items={libraryBooks} 
                        filterField='title' 
                        onFiltered={(items) => setFilteredBooks(items)} 
                        isNotFound={(value: boolean) => setIsFilterNotFound(value)}
                    />
                    </View>
                </View>
            </View>
            {isFilterNotFound && <View style={{ width: '100%', height: 50, backgroundColor: '#f9f0eb', justifyContent: "center", alignItems: "center", margin: 'auto'}}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>No books found</Text>
            </View>}
            <FlatList
                data={filteredBooks.length > 0 ? filteredBooks : libraryBooks}
                renderItem={({ item }) => <LibraryBookCard book={item} onRemoveBook={onRemoveBookFromLibrary} />}
                keyExtractor={(item) => item.id}
                ListFooterComponent={() => (
                    <View style={{ height: 200 }} />
                )}
                ListEmptyComponent={() => (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text>No books found</Text>
                    </View>
                )}
            />
        </View>
    )
}

export default LibraryBooks
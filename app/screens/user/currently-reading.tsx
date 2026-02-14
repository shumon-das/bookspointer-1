import { View, Text, ActivityIndicator, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AuthUser } from '@/components/types/User';
import { useUserStore } from '@/app/store/userStore';
import CurrentlyReadingCard from '@/components/micro/user/profile/CurrentlyReadingCard';
import { useNavigation } from 'expo-router';
import SearchInput from '@/components/micro/SearchInput';
import { styles } from '@/styles/libraryBooks.styles';
import labels from '@/app/utils/labels';

const CurrentlyReading = () => {
    const navigation = useNavigation();
    useEffect(() => navigation.setOptions({ headerShown: false }), []);
    const [author, setAuthor] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentlyReading, setCurrentlyReading] = useState([] as any[]);
    const [filteredReading, setFilteredReading] = useState([] as any[]);
    const [isFilterNotFound, setIsFilterNotFound] = useState(false);

    const getAuthorFromDb = async () => {
        setLoading(true);
        const authUser = await useUserStore.getState().fetchAuthUserFromDb() as AuthUser;
        setAuthor(authUser);
        setCurrentlyReading(authUser.activities.filter((a: any) => a.reading_status === 'reading'));
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

    const filteredContent = () => {
        if (isFilterNotFound) return [];
        return filteredReading.length > 0 ? filteredReading : currentlyReading;
    }
    
    return (
        <View style={{backgroundColor: '#f9f0eb'}}>
            <View>
                <View style={{width: '100%', height: 35, backgroundColor: 'dimgrey'}}></View>
                <Text style={styles.forYours}>{labels.currentlyReading}</Text>
                <Text style={styles.basedOnYourReadHistory}>{labels.currentlyReadingDescription}</Text>
                <View style={{width: "100%", height: 50, backgroundColor: '#f9f0eb', justifyContent: "center", alignItems: "center", margin: 'auto'}}>
                    <View style={{width: '90%'}}>
                    <SearchInput 
                        items={currentlyReading} 
                        filterField='title' 
                        onFiltered={(items) => setFilteredReading(items)} 
                        isNotFound={(value: boolean) => setIsFilterNotFound(value)}
                    />
                    </View>
                </View>
            </View>
            <FlatList
                data={filteredContent()}
                renderItem={({ item }) => <CurrentlyReadingCard book={item} />}
                keyExtractor={(item) => item.book_id}
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

export default CurrentlyReading
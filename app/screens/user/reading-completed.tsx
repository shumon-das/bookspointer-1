import { View, Text, ActivityIndicator, FlatList } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { AuthUser } from '@/components/types/User';
import { useUserStore } from '@/app/store/userStore';
import ReadingCompletedCard from '@/components/micro/user/profile/ReadingCompletedCard';
import { useNavigation } from 'expo-router';
import labels from '@/app/utils/labels';

const ReadingCompleted = () => {
    const navigation = useNavigation();
    useLayoutEffect(() => { navigation.setOptions({ headerShown: true, title: labels.readingComplete });}, []);
    const [author, setAuthor] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [readingCompleted, setReadingCompleted] = useState([] as any[]);

    const getAuthorFromDb = async () => {
        setLoading(true);
        const authUser = await useUserStore.getState().fetchAuthUserFromDb() as AuthUser;
        setAuthor(authUser);
        setReadingCompleted(authUser.activities.filter((a: any) => a.reading_status === 'completed'));
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

    return (
        <View>
            <FlatList
                data={readingCompleted}
                renderItem={({ item }) => <ReadingCompletedCard book={item} />}
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

export default ReadingCompleted
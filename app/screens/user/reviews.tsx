import { View, Text, ActivityIndicator, FlatList } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { AuthUser } from '@/components/types/User';
import { useUserStore } from '@/app/store/userStore';
import ReviewCard from '@/components/micro/user/profile/ReviewCard';
import { useNavigation } from 'expo-router';
import labels from '@/app/utils/labels';

const Review = () => {
    const navigation = useNavigation();
    useLayoutEffect(() => { navigation.setOptions({ headerShown: true, title: labels.review });}, []);
    const [author, setAuthor] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([] as any[]);

    const getAuthorFromDb = async () => {
        setLoading(true);
        const authUser = await useUserStore.getState().fetchAuthUserFromDb() as AuthUser;
        setAuthor(authUser);
        setReviews(authUser.reviews);
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
                <Text>Not reviews found</Text>
            </View>
        )
    }

    return (
        <View>
            <FlatList
                data={reviews}
                renderItem={({ item }) => <ReviewCard book={item} />}
                keyExtractor={(item) => item.id}
                ListFooterComponent={() => (
                    <View style={{ height: 200 }} />
                )}
                ListEmptyComponent={() => (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text>No reviews found</Text>
                    </View>
                )}
            />
        </View>
    )
}

export default Review
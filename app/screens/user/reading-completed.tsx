import { View, Text, ActivityIndicator, FlatList, RefreshControl } from 'react-native'
import React, { useCallback, useLayoutEffect, useState } from 'react'
import ReadingCompletedCard from '@/components/micro/user/profile/ReadingCompletedCard';
import { useNavigation } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import labels from '@/app/utils/labels';
import { fetchActivities, ReadingActivity } from '@/app/utils/user/fecthActivities';

const isCompleted = (activity: ReadingActivity) => activity.reading_status === 'completed'
    || (Number(activity.total_pages) > 0 && Number(activity.active_page) >= Number(activity.total_pages));

const ReadingCompleted = () => {
    const navigation = useNavigation();
    useLayoutEffect(() => { navigation.setOptions({ headerShown: true, title: labels.readingComplete }); }, [navigation]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [readingCompleted, setReadingCompleted] = useState<ReadingActivity[]>([]);
    const [error, setError] = useState('');

    const loadActivities = useCallback(async (refresh = false) => {
        if (refresh) setRefreshing(true);
        else setLoading(true);
        setError('');
        try {
            const data = await fetchActivities();
            setReadingCompleted(data.activities.filter(isCompleted));
        } catch (cause: any) {
            setReadingCompleted([]);
            setError(cause?.message || 'Could not load completed books.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useFocusEffect(useCallback(() => { void loadActivities(); }, [loadActivities]));

    if (loading) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" color="#e63946" /></View>;

    return (
        <View style={{ flex: 1 }}>
            {error ? <Text style={{ color: '#b91c1c', margin: 20 }}>{error}</Text> : null}
            <FlatList
                data={readingCompleted}
                renderItem={({ item }) => <ReadingCompletedCard book={item} />}
                keyExtractor={item => String(item.book_id)}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void loadActivities(true)} />}
                ListFooterComponent={<View style={{ height: 200 }} />}
                ListEmptyComponent={<View style={{ paddingTop: 50, alignItems: 'center' }}><Text>No completed books found</Text></View>}
            />
        </View>
    )
}

export default ReadingCompleted

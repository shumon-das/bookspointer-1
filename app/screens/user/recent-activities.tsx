import { View, Text, ActivityIndicator, FlatList, RefreshControl } from 'react-native'
import React, { useCallback, useLayoutEffect, useState } from 'react'
import { formatActivity, icons } from '@/helper/activities';
import { useNavigation } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import labels from '@/app/utils/labels';
import { fetchActivities, RecentActivity } from '@/app/utils/user/fecthActivities';

const RecentActivities = () => {
    const navigation = useNavigation();
    useLayoutEffect(() => { navigation.setOptions({ headerShown: true, title: labels.resentActivity }); }, [navigation]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
    const [error, setError] = useState('');

    const loadActivities = useCallback(async (refresh = false) => {
        if (refresh) setRefreshing(true);
        else setLoading(true);
        setError('');
        try {
            const data = await fetchActivities();
            setRecentActivities(data.recentActivities);
        } catch (cause: any) {
            setRecentActivities([]);
            setError(cause?.message || 'Could not load recent activities.');
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
                data={recentActivities}
                renderItem={({ item }) => <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#ccc', paddingVertical: 10 }}><View>{icons[item.type] ?? <Text>•</Text>}</View><Text style={{ flex: 1 }}>{formatActivity(item)}</Text></View>}
                keyExtractor={(item, index) => `${item.type}-${item.target_id ?? item.book_id ?? 'activity'}-${item.last_activity_at ?? index}-${index}`}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void loadActivities(true)} />}
                ListFooterComponent={<View style={{ height: 200 }} />}
                ListEmptyComponent={<View style={{ paddingTop: 50, alignItems: 'center' }}><Text>No activities found</Text></View>}
            />
        </View>
    )
}

export default RecentActivities

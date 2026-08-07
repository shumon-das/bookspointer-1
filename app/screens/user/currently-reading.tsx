import { View, Text, ActivityIndicator, FlatList, RefreshControl } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import CurrentlyReadingCard from '@/components/micro/user/profile/CurrentlyReadingCard';
import { useNavigation } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import SearchInput from '@/components/micro/SearchInput';
import { styles } from '@/styles/libraryBooks.styles';
import labels from '@/app/utils/labels';
import { fetchActivities, ReadingActivity } from '@/app/utils/user/fecthActivities';

const isCompleted = (activity: ReadingActivity) => activity.reading_status === 'completed'
    || (Number(activity.total_pages) > 0 && Number(activity.active_page) >= Number(activity.total_pages));

const CurrentlyReading = () => {
    const navigation = useNavigation();
    useEffect(() => navigation.setOptions({ headerShown: false }), [navigation]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [currentlyReading, setCurrentlyReading] = useState<ReadingActivity[]>([]);
    const [filteredReading, setFilteredReading] = useState<ReadingActivity[]>([]);
    const [isFilterNotFound, setIsFilterNotFound] = useState(false);
    const [error, setError] = useState('');

    const loadActivities = useCallback(async (refresh = false) => {
        if (refresh) setRefreshing(true);
        else setLoading(true);
        setError('');
        try {
            const data = await fetchActivities();
            setCurrentlyReading(data.activities.filter(activity => !isCompleted(activity)));
            setFilteredReading([]);
            setIsFilterNotFound(false);
        } catch (cause: any) {
            setCurrentlyReading([]);
            setError(cause?.message || 'Could not load currently reading books.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useFocusEffect(useCallback(() => { void loadActivities(); }, [loadActivities]));

    const content = isFilterNotFound ? [] : filteredReading.length > 0 ? filteredReading : currentlyReading;

    return (
        <View style={{ flex: 1, backgroundColor: '#f9f0eb' }}>
            <View>
                <View style={{ width: '100%', height: 35, backgroundColor: 'dimgrey' }} />
                <Text style={styles.forYours}>{labels.currentlyReading}</Text>
                <Text style={styles.basedOnYourReadHistory}>{labels.currentlyReadingDescription}</Text>
                <View style={{ width: '100%', height: 50, backgroundColor: '#f9f0eb', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ width: '90%' }}>
                        <SearchInput items={currentlyReading} filterField="book_title" onFiltered={items => setFilteredReading(items)} isNotFound={setIsFilterNotFound} />
                    </View>
                </View>
            </View>
            {error ? <Text style={{ color: '#b91c1c', marginHorizontal: 20, marginBottom: 10 }}>{error}</Text> : null}
            <FlatList
                data={content}
                renderItem={({ item }) => <CurrentlyReadingCard book={item} />}
                keyExtractor={item => String(item.book_id)}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void loadActivities(true)} />}
                ListFooterComponent={<View style={{ height: 200 }} />}
                ListEmptyComponent={loading ? <View style={{ paddingTop: 50, alignItems: 'center' }}><ActivityIndicator size="large" color="#e63946" /></View> : <View style={{ paddingTop: 50, alignItems: 'center' }}><Text>{labels.noBooksFound}</Text></View>}
            />
        </View>
    )
}

export default CurrentlyReading

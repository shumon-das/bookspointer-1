import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import API_CONFIG from '@/app/utils/config';
import englishNumberToBengali from '@/app/utils/englishNumberToBengali';
import labels from '@/app/utils/labels';
import { fetchActivities, ReadingActivity } from '@/app/utils/user/fecthActivities';

const isCompleted = (activity: ReadingActivity) => activity.reading_status === 'completed'
    || (Number(activity.total_pages) > 0 && Number(activity.active_page) >= Number(activity.total_pages));

const CurrentlyReadingCarousel = () => {
    const router = useRouter();
    const [books, setBooks] = useState<ReadingActivity[]>([]);
    const [loading, setLoading] = useState(true);

    const loadBooks = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchActivities();
            setBooks(data.activities.filter(activity => !isCompleted(activity)));
        } catch {
            setBooks([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(useCallback(() => { void loadBooks(); }, [loadBooks]));

    if (!loading && books.length === 0) return null;

    const openBook = (book: ReadingActivity) => {
        router.push({
            pathname: '/screens/book/details',
            params: {
                id: book.book_id,
                title: book.book_title,
                author: `${book.author_first_name || ''} ${book.author_last_name || ''}`.trim(),
                content: null,
                isQuote: 'no',
                backurl: '/screens/user/user-profile',
            },
        });
    };

    return (
        <View style={styles.section}>
            <View style={styles.headingRow}>
                <View style={styles.headingCopy}>
                    <Text style={styles.title}>{labels.currentlyReading}</Text>
                    <Text style={styles.subtitle}>{labels.currentlyReadingDescription}</Text>
                </View>
                <TouchableOpacity accessibilityRole="button" accessibilityLabel={labels.seeAllBooks} hitSlop={8} onPress={() => router.push('/screens/user/currently-reading')}>
                    <Text style={styles.seeAll}>{labels.seeAllBooks} →</Text>
                </TouchableOpacity>
            </View>

            {loading ? <View style={styles.loading}><ActivityIndicator color="#8b3a2b" /></View> : <FlatList
                data={books}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => String(item.book_id)}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => {
                    const totalPages = Math.max(1, Number(item.total_pages) || 1);
                    const activePage = Math.max(0, Math.min(Number(item.active_page) || 0, totalPages));
                    const progress = Math.round((activePage / totalPages) * 100);
                    return <TouchableOpacity style={styles.card} activeOpacity={0.86} onPress={() => openBook(item)}>
                        <Image source={{ uri: `${API_CONFIG.BASE_URL}/uploads/${item.book_image || 'default_cover_3.jpeg'}` }} style={styles.cover} />
                        <View style={styles.content}>
                            <Text numberOfLines={2} style={styles.bookTitle}>{item.book_title}</Text>
                            <Text numberOfLines={1} style={styles.author}>{item.author_first_name} {item.author_last_name}</Text>
                            <View style={styles.progressMeta}><Text style={styles.progressLabel}>{englishNumberToBengali(activePage)} / {englishNumberToBengali(totalPages)}</Text><Text style={styles.progressPercent}>{englishNumberToBengali(progress)}%</Text></View>
                            <View style={styles.track}><View style={[styles.fill, { width: `${progress}%` }]} /></View>
                        </View>
                    </TouchableOpacity>;
                }}
            />}
        </View>
    );
};

export default CurrentlyReadingCarousel;

const styles = StyleSheet.create({
    section: { marginTop: 24, paddingVertical: 4, borderTopWidth: 1, borderTopColor: '#e0d6d1' },
    headingRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, paddingHorizontal: 14, marginBottom: 12 },
    headingCopy: { flex: 1 },
    title: { fontSize: 17, fontWeight: '800', color: '#30211d' },
    subtitle: { marginTop: 3, fontSize: 12, lineHeight: 18, color: '#7c625a' },
    seeAll: { paddingTop: 3, color: '#8b3a2b', fontSize: 12, fontWeight: '800' },
    loading: { height: 210, justifyContent: 'center' },
    list: { paddingHorizontal: 14, paddingBottom: 4, gap: 12 },
    card: { width: 158, overflow: 'hidden', borderRadius: 16, backgroundColor: '#fff', shadowColor: '#4a2d25', shadowOpacity: 0.12, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 3 },
    cover: { width: '100%', height: 142, backgroundColor: '#eadfd8' },
    content: { padding: 10 },
    bookTitle: { minHeight: 34, color: '#30211d', fontSize: 13, fontWeight: '800', lineHeight: 17 },
    author: { marginTop: 3, color: '#806a61', fontSize: 11 },
    progressMeta: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
    progressLabel: { color: '#806a61', fontSize: 10, fontWeight: '600' },
    progressPercent: { color: '#8b3a2b', fontSize: 10, fontWeight: '800' },
    track: { height: 5, overflow: 'hidden', borderRadius: 99, marginTop: 5, backgroundColor: '#f0e3dd' },
    fill: { height: '100%', borderRadius: 99, backgroundColor: '#b54c39' },
});

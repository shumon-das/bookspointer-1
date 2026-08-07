import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { User } from '@/components/types/User';
import API_CONFIG from '@/app/utils/config';
import labels from '@/app/utils/labels';
import { useRouter } from 'expo-router';

const RecommendedBooks = ({ author, recommendedBooks }: { author: User | null, recommendedBooks: any[] }) => {
    const router = useRouter();

    if (!recommendedBooks.length) return null;

    const openBook = (book: any) => {
        router.push({
            pathname: '/screens/book/details',
            params: {
                id: book.id,
                title: book.title,
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
                    <Text style={styles.title}>{labels.forYours}</Text>
                    <Text style={styles.subtitle}>{labels.basedOnYourReadHistory}</Text>
                </View>
                <View style={styles.countBadge}><Text style={styles.countText}>{recommendedBooks.length}</Text></View>
            </View>

            <FlatList
                data={recommendedBooks}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => String(item?.id ?? index)}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => <TouchableOpacity style={styles.card} activeOpacity={0.86} onPress={() => openBook(item)}>
                    <View style={styles.coverWrap}>
                        <Image source={{ uri: `${API_CONFIG.BASE_URL}/uploads/${item.image || 'default_cover_3.jpeg'}` }} style={styles.cover} />
                        {item.category ? <View style={styles.categoryBadge}><Text numberOfLines={1} style={styles.categoryText}>{item.category}</Text></View> : null}
                    </View>
                    <View style={styles.content}>
                        <Text numberOfLines={2} style={styles.bookTitle}>{item.title}</Text>
                        <Text numberOfLines={1} style={styles.author}>{item.author_first_name} {item.author_last_name}</Text>
                        <Text numberOfLines={1} style={styles.hint}>{author ? labels.recomendedForYou : labels.forYours}</Text>
                    </View>
                </TouchableOpacity>}
            />
        </View>
    );
};

export default RecommendedBooks;

const styles = StyleSheet.create({
    section: { paddingTop: 4, paddingBottom: 4 },
    headingRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, paddingHorizontal: 14, marginBottom: 12 },
    headingCopy: { flex: 1 },
    title: { fontSize: 17, fontWeight: '800', color: '#30211d' },
    subtitle: { marginTop: 3, fontSize: 12, lineHeight: 18, color: '#7c625a' },
    countBadge: { minWidth: 28, height: 28, alignItems: 'center', justifyContent: 'center', borderRadius: 14, backgroundColor: '#f0e3dd' },
    countText: { color: '#8b3a2b', fontSize: 12, fontWeight: '800' },
    list: { paddingHorizontal: 14, paddingBottom: 4, gap: 12 },
    card: { width: 158, overflow: 'hidden', borderRadius: 16, backgroundColor: '#fff', shadowColor: '#4a2d25', shadowOpacity: 0.12, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 3 },
    coverWrap: { height: 166, backgroundColor: '#eadfd8' },
    cover: { width: '100%', height: '100%', resizeMode: 'cover' },
    categoryBadge: { position: 'absolute', right: 8, bottom: 8, maxWidth: 110, borderRadius: 10, backgroundColor: 'rgba(48, 33, 29, 0.82)', paddingHorizontal: 8, paddingVertical: 4 },
    categoryText: { color: '#fff', fontSize: 10, fontWeight: '700' },
    content: { minHeight: 91, padding: 10 },
    bookTitle: { minHeight: 34, color: '#30211d', fontSize: 13, fontWeight: '800', lineHeight: 17 },
    author: { marginTop: 3, color: '#806a61', fontSize: 11 },
    hint: { marginTop: 8, color: '#b54c39', fontSize: 10, fontWeight: '800' },
});

import API_CONFIG from '@/app/utils/config';
import englishNumberToBengali from '@/app/utils/englishNumberToBengali';
import labels from '@/app/utils/labels';
import { percentage } from '@/app/utils/user/fecthActivities';
import { styles } from '@/styles/libraryBooks.styles';
import { Entypo } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import ShareButton from '../../bookCardFooter/ShareButton';

const CurrentlyReadingCard = React.memo(({ book }: { book: any }) => {
    const router = useRouter();
    const backurl = "/screens/user/user-profile";

    const handleBookReadPress = (book: any) => {
        router.push({
            pathname: "/screens/book/details", params: {
                id: book.book_id,
                title: book.book_title,
                author: `${book.author_first_name} ${book.author_last_name}`,
                content: null,
                isQuote: 'no',
                backurl: backurl
            }
        })
    }
    return (
        <View key={book.book_id} style={styles.bookCard}>
            <Image source={{ uri: `${API_CONFIG.BASE_URL}/uploads/${'' === book.book_image || !book.book_image ? 'default_cover_3.jpeg' : book.book_image}` }} style={styles.bookImage} />
            <View style={styles.bookInfo}>
                <View>
                    <Text style={styles.bookTitle}>{book.book_title}</Text>
                    <Text style={styles.bookAuthor}>{book.author_first_name} {book.author_last_name}</Text>
                    <View style={{ paddingTop: 5 }}>
                        <Text style={{ paddingBottom: 5, fontSize: 10 }}>
                            <Text style={{ fontWeight: 'bold' }}>{englishNumberToBengali(book.active_page)}</Text> {labels.readStatus.readed}
                            <Text style={{ fontWeight: 'bold' }}>{englishNumberToBengali(book.total_pages)}</Text> {labels.readStatus.inTotalPages}
                        </Text>
                        <View style={{
                            width: '100%',
                            height: 2,
                            backgroundColor: 'lightgray',
                            zIndex: -1
                        }}>
                            <View style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                width: `${percentage(book.active_page, book.total_pages)}%`,
                                height: 2,
                                backgroundColor: '#06855fff',
                                zIndex: -1
                            }} />
                        </View>
                    </View>
                </View>
                <View style={styles.bookActions}>
                    <TouchableOpacity style={styles.readButton} onPress={() => handleBookReadPress(book)}>
                        <Entypo name="open-book" size={16} color="black" style={{ transform: [{ rotate: '18deg' }] }} />
                        <Text style={{ fontSize: 10 }}>{labels.read}</Text>
                    </TouchableOpacity>
                    <View style={styles.shareButton}>
                        <ShareButton
                            title="Check this out!"
                            message={book.book_title}
                            url={`https://bookspointer.com${book.url}`}
                            style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}
                        />
                    </View>
                </View>
            </View>
            <Text style={styles.bookCategory}>{book.category}</Text>
        </View>
    )
})

export default CurrentlyReadingCard
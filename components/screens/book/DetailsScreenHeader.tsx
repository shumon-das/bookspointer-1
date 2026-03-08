import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { styles } from '@/styles/details.styles';
import { useReviewStore } from '@/app/store/reviewStore';
import ShareButton from '@/components/micro/bookCardFooter/ShareButton';
import { Foundation, MaterialIcons } from '@expo/vector-icons';
import { useBookDetailsStore } from '@/app/store/bookDetailsStore';
import { useRouter } from 'expo-router';
import labels from '@/app/utils/labels';

interface PropsType {
    title: string;
    author: string;
    bookId: number;
    textFormattingEnabled: boolean;
    onEnableTextFormating: (value: boolean) => void;
}

const DetailsScreenHeader = (data: PropsType) => {
  const storeBook = useBookDetailsStore.getState().selectedBook;
  const router = useRouter();
  return (
    <View style={[styles.header, {backgroundColor: '#085a80'}]}>
        <View style={{ marginTop: 30, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <View style={{ marginHorizontal: 10 }}>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#d4d4d4' }}>
                {data.title.length > 20 ? data.title.slice(0, 20) + '...' : data.title}
                </Text>
                <TouchableOpacity onPress={() => storeBook.author && storeBook.author.uuid && router.push({
                pathname: "/screens/author/author-profile",
                params: { authorUuid: storeBook.author.uuid },
                })}>
                <Text style={{ fontSize: 10, fontWeight: 'bold', fontStyle: 'italic', color: '#d4d4d4' }}>{data.author}</Text>
                </TouchableOpacity>
            </View>
            <View style={{ marginHorizontal: 10, flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity onPress={() => {
                useReviewStore.getState().setSelectedBook({
                    id: data.bookId,
                    title: data.title,
                    author: data.author,
                    uuid: storeBook ? storeBook.uuid : null,
                    url: storeBook ? storeBook.url : null,
                    createdBy: { uuid: storeBook ? storeBook.creator_uuid : null, fullName: storeBook ? storeBook.creator_name : null } 
                });
                router.push('/screens/book/single-book-reviews')
                }}>
                <Text style={{textAlign: 'center'}}><Foundation name="comment-quotes" size={14} color="#d4d4d4" /></Text>
                <Text style={{ fontSize: 10, color: '#d4d4d4' }}>{labels.review}</Text>
                </TouchableOpacity>
                {storeBook && storeBook.url && <ShareButton
                title="Check this book out!"
                message={data.title as string}
                url={`https://bookspointer.com${storeBook.url}`}
                iconColor="#d4d4d4"
                />}
                <TouchableOpacity onPress={() => {
                    data.onEnableTextFormating(!data.textFormattingEnabled)
                }}>
                    <MaterialIcons name="format-color-text" size={24} color="#d4d4d4" />
                </TouchableOpacity>
            </View>
        </View>
    </View>
  )
}

export default DetailsScreenHeader
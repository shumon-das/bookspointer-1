import labels from '@/app/utils/labels';
import Pagination from '@/components/micro/book/details/Pagination';
import { useNetworkStatus } from '@/components/network/networkConnectionStatus';
import TextContent from '@/components/screens/book/TextContent';
import { router, useFocusEffect, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import TextFormating from '@/components/micro/book/details/TextFormating';
import { useBookDetailsStore } from '@/app/store/bookDetailsStore';
import DetailsScreenHeader from '@/components/screens/book/DetailsScreenHeader';
import { MaterialIcons } from '@expo/vector-icons';

const details = () => {
    const {id, title, author, content = null, isQuote = 'no', backurl = null} = useLocalSearchParams();
    const navigation = useNavigation();
    useEffect(() => navigation.setOptions({ headerShown: false }), []);
    const scrollRef = useRef<ScrollView>(null)
    
    const {isOnline, isInitializing} = useNetworkStatus(() => {
      console.log('✅ Online again, syncing data...');
    });
    
    useEffect(() => navigation.setOptions({ headerShown: false }), []);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    useEffect(() => scrollRef.current?.scrollTo({ y: 0, animated: true }), [page]);
    const [fontSize, setFontSize] = useState(15);
    const [backgroundColor, setBackgroundColor] = useState('white');
    const [isTextFormating, setIsTextFormating] = useState(false);
    const [bookId, setBookId] = useState(parseInt(id as string));

    const storeBook = useBookDetailsStore.getState().selectedBook;
    const [relatedBooks, setRelatedBooks] = useState([] as any[]);
    const pageText = useBookDetailsStore((state) => state.currentPageTexts)
    const totalPages = useBookDetailsStore((state) => state.total_pages)

    useFocusEffect(
      useCallback(() => {
        if (id) {
          setBookId(parseInt(id as string))
        }
        
        const fetchActivePageTexts = async () => {
          setLoading(true)
          await useBookDetailsStore.getState().textsWithPrevAndNextPage(bookId, page, true)
          setPage(useBookDetailsStore.getState().current_page_number)
          setLoading(false)
        }
        
        const fetchRelatedBooks = async () => {
          const relatedBooks = await useBookDetailsStore.getState().fetchRelatedBooks(parseInt(id as string));
          const filteredBooks = relatedBooks.filter((book, index, self) =>
            index === self.findIndex((b) => b.book_id === book.book_id)
          )
          setRelatedBooks(filteredBooks);
        }
        
        fetchActivePageTexts()
        fetchRelatedBooks();
      }, [id, navigation])
    );

    const getPageBook = async (pageNumber: number) => {
      if (useBookDetailsStore.getState().current_page_number === pageNumber) return;
      setPage(pageNumber)
      await useBookDetailsStore.getState().textsWithPrevAndNextPage(bookId, pageNumber, false)
    }

    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{ flex: 1, backgroundColor: backgroundColor }}>
          <DetailsScreenHeader
            title={title as string}
            author={author as string}
            bookId={bookId}
            textFormattingEnabled={isTextFormating}
            onEnableTextFormating={setIsTextFormating}
          />  
          {isInitializing ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#085a80" />
            </View>

          ) : !isOnline ? (

            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <MaterialIcons name="wifi-off" size={48} color="#444" />
              <Text>{labels.onlyForDownloadedBooks}</Text>
            </View>

          ) : (<ScrollView style={{ flex: 1 }} overScrollMode="never" bounces={false} ref={scrollRef}>
            {isTextFormating && <TextFormating 
              currentFontSize={fontSize} 
              onChange={(value) => setFontSize(value)} 
              onChangeBgColor={(value) => setBackgroundColor(value)} 
              onResetEverything={() => {
                setFontSize(16)
                setBackgroundColor('#fff')
              }} 
            />}

            {page === 1 && <View style={{ marginHorizontal: 10 }}>
              <Text style={{ fontSize: 15, fontWeight: 'bold' }}>
                {title}
              </Text>
              <TouchableOpacity onPress={() => storeBook.author && storeBook.author.uuid && router.push({
                pathname: "/screens/author/author-profile",
                params: { authorUuid: storeBook.author.uuid },
              })}>
                <Text style={{ fontSize: 10, fontWeight: 'bold', color: 'gray' }}>{author}</Text>
              </TouchableOpacity>
            </View>}

            {loading && page === 1 
              ? (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <ActivityIndicator size="large" color="#085a80" />
                </View>)
              :  (<View style={{ margin: 10 }}>
                  <TextContent content={pageText} isDetailsScreen={true} fontSize={fontSize} backgroundColor={backgroundColor} />
                  <View style={{ marginTop: 30, marginBottom: 10 }}>
                    {!loading && <Pagination currentPage={page} data={{total_pages: totalPages, book_id: id}} onChange={getPageBook} />}
                    <View style={{ height: 10 }}></View>
                  </View>
                </View>)
            }

              {relatedBooks.length > 0 && (
                <View style={{ margin: 10 }}>
                  <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{labels.relatedBooks}</Text>
                  <View style={{ height: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}></View>
                  {relatedBooks.map((book) => (
                    <TouchableOpacity key={book.book_id} style={{ marginVertical: 10 }} onPress={() => {
                      router.push({
                        pathname: "/screens/book/details", params: {
                          id: book.book_id,
                          title: book.data ? JSON.parse(book.data).title : '',
                          author: book.data ? JSON.parse(book.data).author : '',
                        }
                      })
                    }}>
                      <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{book.data ? JSON.parse(book.data).title : ''}</Text>
                      <Text style={{ fontSize: 14, color: 'gray' }}>{book.data ? JSON.parse(book.data).author : ''}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              <View style={{ height: 100, borderBottomWidth: 1, borderBottomColor: '#ccc' }}></View>
            </ScrollView>
          )}
        </View>
      </GestureHandlerRootView>
  )
}

export default details
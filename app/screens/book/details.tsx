import labels from '@/app/utils/labels';
import Pagination from '@/components/micro/book/details/Pagination';
import { useNetworkStatus } from '@/components/network/networkConnectionStatus';
import TextContent from '@/components/screens/book/TextContent';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import TextFormating from '@/components/micro/book/details/TextFormating';
import { useBookDetailsStore } from '@/app/store/bookDetailsStore';
import { styles } from '@/styles/details.styles';
// import ShareButton from '@/components/micro/bookCardFooter/ShareButton';

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
    const [totalPages, setTotalPages] = useState(1);
    const [pageText, setPageText] = useState("");
    const [loading, setLoading] = useState(true);
    useEffect(() => scrollRef.current?.scrollTo({ y: 0, animated: true }), [page]);
    const [fontSize, setFontSize] = useState(15);
    const [backgroundColor, setBackgroundColor] = useState('white');
    const [isTextFormating, setIsTextFormating] = useState(false);
    const [bookId, setBookId] = useState(parseInt(id as string));

    useFocusEffect(
      useCallback(() => {
        if (id) {
          setBookId(parseInt(id as string))
        }

        const fetchActivePageTexts = async () => {
          setLoading(true)
          useBookDetailsStore.getState().pages = []
          await useBookDetailsStore.getState().textsWithPrevAndNextPage(bookId, page, true)
          setPage(useBookDetailsStore.getState().current_page_number)
          setLoading(false)
          await fetchChunks(useBookDetailsStore.getState().current_page_number, false)
        }

        fetchActivePageTexts()
      }, [id, navigation])
    );

    const fetchChunks = async (pageNumber: number, firstRequest: boolean = false) => {
          const data = useBookDetailsStore.getState().pages.find((page) => page.page_number === pageNumber);
          if (data) {
            setPage(data.page_number)
            setPageText(data.text)
            await useBookDetailsStore.getState().textsWithPrevAndNextPage(bookId, pageNumber, firstRequest)
          } 

          setTotalPages(useBookDetailsStore.getState().total_pages)
    };

    const getPageBook = async (pageNumber: number) => {
      setPage(pageNumber)
      await fetchChunks(pageNumber)
    }

    if (!isOnline) {
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <MaterialIcons name="wifi-off" size={48} color="#444" />
              <Text>{labels.onlyForDownloadedBooks}</Text>
          </View>
        )
    }

    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{ flex: 1, backgroundColor: backgroundColor }}>
            <View style={styles.header}>
              <View style={{ marginTop: 30, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <View style={{ marginHorizontal: 10 }}>
                  <Text style={{ fontSize: 15, fontWeight: 'bold' }}>
                    {title}
                  </Text>
                  <Text style={{ fontSize: 10, fontWeight: 'bold', color: 'gray' }}>
                    {author}
                  </Text>
                </View>
                <View style={{ marginHorizontal: 10 }}>
                  <TouchableOpacity onPress={() => setIsTextFormating(!isTextFormating)}>
                    <MaterialIcons name="format-color-text" size={24} color="gray" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          <ScrollView style={{ flex: 1 }} overScrollMode="never" bounces={false} ref={scrollRef}>
            {isTextFormating && <TextFormating 
              currentFontSize={fontSize} 
              onChange={(value) => setFontSize(value)} 
              onChangeBgColor={(value) => setBackgroundColor(value)} 
              onResetEverything={() => {
                setFontSize(16)
                setBackgroundColor('#fff')
              }} 
            />}

            {loading && page === 1 
              ? (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <ActivityIndicator size="large" color="#085a80" />
                </View>)
              :  (<View style={{ margin: 10 }}>
                  <TextContent content={pageText} isDetailsScreen={true} fontSize={fontSize} backgroundColor={backgroundColor} />
                  <View style={{ marginVertical: 30 }}>
                    {!loading && <Pagination currentPage={page} data={{total_pages: totalPages, book_id: id}} onChange={getPageBook} />}
                    <View style={{ height: 10 }}></View>
                  </View>
                </View>)}
          </ScrollView>
        </View>
      </GestureHandlerRootView>
  )
}

export default details
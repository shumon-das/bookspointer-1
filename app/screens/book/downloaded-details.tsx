import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { readEncryptedBook } from '@/helper/details';
import { getBookMeta, updateActivePage } from '@/app/utils/database/bookMetaDb';
import TextContent from '@/components/screens/book/TextContent';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import Pagination from '@/components/micro/book/details/Pagination';
import { MaterialIcons } from '@expo/vector-icons';
import TextFormating from '@/components/micro/book/details/TextFormating';


const DownloadedDetails = () => {
    const {bookid} = useLocalSearchParams();
    const navigation = useNavigation();
    useEffect(() => navigation.setOptions({ headerShown: false }), []);
    const scrollRef = useRef<ScrollView>(null)
    const [fontSize, setFontSize] = useState(16);
    const [isFontRange, setIsFontRange] = useState(false);
        
    const [bookMeta, setBookMeta] = useState(null as any);
    const [loading, setLoading] = useState(true);
    const [activePage, setActivePage] = useState(1);
    const [pages, setPages] = useState([] as string[]);
    const [pageText, setPageText] = useState("");
    useEffect(() => scrollRef.current?.scrollTo({ y: 0, animated: true }), [activePage]);

    useEffect(() => {
      const fetchBookData = async () => {
        setLoading(true)
        const bookMeta = await getBookMeta(parseInt(bookid as string)) as any
        if (bookMeta) {
          setBookMeta(bookMeta[0])
          setActivePage(bookMeta[0].active_page)
        }
        
        const content = await readEncryptedBook(parseInt(bookid as string))
        if (content) {
          const paginated = paginateText(content as string, 1000)
          setPages(paginated)
          setPageText(paginated[bookMeta[0].active_page -1])
        }
        setLoading(false)
      }

      fetchBookData()
    }, [bookid])


    const paginateText = (text: string, wordsPerPage = 100) => {
      const words = text.split(/\s+/); // Splits by any whitespace
      const pages = [];
      
      for (let i = 0; i < words.length; i += wordsPerPage) {
        pages.push(words.slice(i, i + wordsPerPage).join(' '));
      }
      return pages;
    };

    const onChangePage = async (pageNumber: number) => {
      setActivePage(pageNumber)
      setPageText(pages[pageNumber -1])
      await updateActivePage(parseInt(bookid as string), pageNumber)
    }

    if (loading) {
      return (
        <View style={{ flex: 1 }}>
          <View style={{ height: 80, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <View style={{ width: '100%', height: 35, backgroundColor: 'rgba(0, 0, 0, 0.5)' }} />
            <View style={{ width: '100%', marginTop: 5 }}>
              <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold', textAlign: 'center' }}>
                {bookMeta?.title}
              </Text>
            </View>
          </View>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#e63946" />
          </View>
        </View>
      )
    }

    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{ flex: 1, backgroundColor: '#f9f0eb' }}>
          <ScrollView style={{ flex: 1 }} overScrollMode="never" bounces={false} ref={scrollRef}>
            <View style={{ height: 80, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
              <View style={{ width: '100%', height: 35, backgroundColor: 'rgba(0, 0, 0, 0.5)' }} />
              <View style={{ marginTop: 5, flexDirection: 'row', justifyContent: 'flex-end', width: '100%' }}>
                <TouchableOpacity onPress={() => setIsFontRange(!isFontRange)} style={{ width: 25, height: 25, marginHorizontal: 10 }}>
                  <MaterialIcons name="format-color-text" size={24} color="#f9f0eb" />
                </TouchableOpacity>
              </View>
            </View>
            {isFontRange && <TextFormating currentFontSize={fontSize} onChange={(value) => setFontSize(value)} onResetEverything={() => setFontSize(16)} />}
            
            {1 === activePage && <View style={{ marginBottom: 10 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginTop: 10 }}>
                {bookMeta?.title}
              </Text>
              <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center' }}>
                {bookMeta?.author}
              </Text>
            </View>}

            <View style={{ margin: 10 }}>
              <TextContent content={pageText} isDetailsScreen={true} fontSize={fontSize} />
              <View style={{ marginVertical: 30 }}>
                <Pagination currentPage={activePage} data={{total_pages: pages.length, book_id: bookMeta?.id}} onChange={(page) => onChangePage(page)} />
                <View style={{ height: 10 }}></View>
              </View>
            </View>

          </ScrollView>
        </View>
      </GestureHandlerRootView>
    )
}

export default DownloadedDetails
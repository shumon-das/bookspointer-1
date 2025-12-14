import HtmlContent from '@/components/micro/HtmlContent';
import { singleBook } from '@/services/api';
import { decryptBook, encryptedPagesNumbers } from '@/app/utils/download';
import { useFocusEffect, useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, BackHandler, Text, TouchableOpacity, View } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Pagination from '@/components/micro/book/details/pagination';
import usePageLeaveTracker from '@/app/utils/routerGuard';
import { getChunk, getTotalChunks } from '@/app/utils/database/manipulateBooks';
import { getLastReadProgress, saveReadProgress } from '@/app/utils/database/readProgress';

const details = () => {
    const {id, title, author, content = null, isQuote = 'no', backurl = null} = useLocalSearchParams();
    const navigation = useNavigation();
    const backUrl = backurl && 'string' === typeof backurl ? JSON.parse(backurl as string) : ''
    const router = useRouter();
    
    useLayoutEffect(() => {
        navigation.setOptions({
        headerLeft: () => (<TouchableOpacity onPress={() => router.back()} style={{marginLeft: 10}}>
            <FontAwesome5 name="arrow-left" size={18} color="#d4d4d4" />
          </TouchableOpacity>
        ),  
        headerTitle: () => (
            <View>
            <Text style={{ fontSize: 12, fontWeight: 'bold', textAlign: 'center', color: '#d4d4d4' }}>
                {title}
            </Text>
            <Text style={{ fontSize: 14, color: '#b7f0d4', textAlign: 'center' }}>
                {author}
            </Text>
            </View>
        ),
        headerRight: () => (<></>),
        headerTitleAlign: 'center',
        headerStyle: {
            height: 100,
            backgroundColor: '#085a80',
        },
        headerTintColor: '#d4d4d4',
        headerTitleStyle: {
            fontWeight: 'bold',
        },
        });
    }, [navigation, title, author]);

    usePageLeaveTracker('book_details', id as any) 
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageText, setPageText] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const deviceBackButtonAction = () => {
          if (backurl) {
            router.push(backUrl);
          }
          return true
      }
      
      const backHandler = BackHandler.addEventListener('hardwareBackPress', deviceBackButtonAction);
      return () => backHandler.remove();
    }, [backurl])

    useFocusEffect(
      useCallback(() => {
        if (!content) {
          const lastProgress = async () => {
            const lastPageNumber = await getLastReadProgress(String(id));
            setPage(lastPageNumber)
            fetchChunks(lastPageNumber)
          }
          lastProgress()
        }
        if (content) {
            const fetchBook = async () => {
            const chunksCount = await getTotalChunks(String(id))
            setTotalPages(chunksCount)
            const lastPageNumber = await getLastReadProgress(String(id));
            const downloadBookPageNumber = lastPageNumber - 1;
            setPage(downloadBookPageNumber)
            const texts = await getChunk(String(id), downloadBookPageNumber)
            setPageText(texts)
            setLoading(false)
          }
          fetchBook()
        }
      }, [id, navigation])
    );

    const fetchChunks = async (pageNumber: number) => {
        setLoading(true);
        try {
          const data = await singleBook({id: parseInt(id as string), page: pageNumber})
          setPageText(data.text)
          setTotalPages(data.total_pages)
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false)
        }
    };

    const getPageBook = async (value: number) => {
      if (content) {
        console.log('page number ', value)
        const texts = await getChunk(String(id), value -1)
        setPageText(texts)
      } else {
        fetchChunks(value)
      }
      await saveReadProgress(String(id), value)
    }

    return (
    <View style={{flexDirection: 'column', justifyContent: 'space-between', height: '88%'}}>
      <View style={{marginVertical: 5, height: '99%'}}>
        {loading ? <ActivityIndicator ></ActivityIndicator> : (<HtmlContent 
            content={pageText} 
            isDetailsScreen={true}
            fontSize={title.includes('quote') ? 20 : 16}
            textColor={'black'}
            backgroundColor={'#fff'}
        />)}
      </View>

      <Pagination currentPage={page} data={{total_pages: totalPages, book_id: id}} onChange={getPageBook} />
    </View>
  )
}

export default details
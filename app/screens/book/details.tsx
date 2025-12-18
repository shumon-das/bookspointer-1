import { getChunk, getTotalChunks } from '@/app/utils/database/manipulateBooks';
import { getLastReadProgress, saveReadHistory } from '@/app/utils/history/history';
import { stopDuration } from '@/app/utils/timeDuration';
import DetailsHeader from '@/components/micro/book/details/DetailsHeaader';
import DetailsOffline from '@/components/micro/book/details/DetailsOffline';
import Pagination from '@/components/micro/book/details/Pagination';
import HtmlContent from '@/components/micro/HtmlContent';
import { useNetworkStatus } from '@/components/network/networkConnectionStatus';
import { fetchNextPrevPageTexts } from '@/helper/details';
import { singleBook } from '@/services/api';
import { useFocusEffect, useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, BackHandler, SafeAreaView, View } from 'react-native';

const details = () => {
    const {id, title, author, content = null, isQuote = 'no', backurl = null} = useLocalSearchParams();
    const navigation = useNavigation();
    const backUrl = backurl && 'string' === typeof backurl ? JSON.parse(backurl as string) : ''
    const router = useRouter();
    const startTime = new Date();
    const startDuration = Date.now()

    const isConnected = useNetworkStatus(() => {
      console.log('✅ Online again, syncing data...');
    });
    
    useEffect(() => navigation.setOptions({ headerShown: false }), []);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [prevPageText, setPrevPageText] = useState("");
    const [pageText, setPageText] = useState("");
    const [nextPageText, setNextPageText] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const deviceBackButtonAction = () => {
          if (backurl) router.back();
          return true
      }
      const backHandler = BackHandler.addEventListener('hardwareBackPress', deviceBackButtonAction);
      return () => backHandler.remove();
    }, [backurl])

    useFocusEffect(
      useCallback(() => {
        if (!content) {
          const fetchActivePageTexts = async () => {
            const lastPageNumber = await getLastReadProgress(String(id));
            setPage(lastPageNumber)
            await fetchChunks(lastPageNumber)
            const data = await fetchNextPrevPageTexts(parseInt(id as string), lastPageNumber)
            setPrevPageText(data.prevPageTexts)
            setNextPageText(data.nextPageTexts)
          }
          fetchActivePageTexts()
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
          await saveBookReadHistory(data.total_pages);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false)
        }
    };

    const getPageBook = async (pageNumber: number) => {
      if (content) {
        const texts = await getChunk(String(id), pageNumber -1)
        setPageText(texts)
      } else {
        const isNextOrPrev = (pageNumber + 1) === page || (pageNumber - 1) === page;
        if (isNextOrPrev) {
          await onPressNextOrPrevButton(pageNumber)
        } else {
          await fetchChunks(pageNumber)
          const data = await fetchNextPrevPageTexts(parseInt(id as string), pageNumber)
          setPrevPageText(data.prevPageTexts)
          setNextPageText(data.nextPageTexts)
        }
        setPage(pageNumber)
      }
      await saveBookReadHistory()
    }
    
    const saveBookReadHistory = async (totalPages?: number) => {
      const chunksCount = await getTotalChunks(String(id))
      const history = {
        title: title as unknown as string,
        author: author as unknown as string,
        target: id as unknown as number,
        duration: stopDuration(startDuration),
        totalPage: totalPages ?? chunksCount,
        activePage: page + 1,
        greaterReadedPage: page,
        browsingTime: startTime.getHours()
      }
      await saveReadHistory(history)
    }

    const onPressNextOrPrevButton = async (pageNumber: number) => {
      const next = pageNumber > page;
      if (next) {
        setPrevPageText(pageText)
        setPageText(nextPageText)
        const data = await singleBook({id: parseInt(id as string), page: pageNumber + 1})
        setNextPageText(data.text)
      } else {
        setNextPageText(pageText)
        setPageText(prevPageText)
        const data = await singleBook({id: parseInt(id as string), page: pageNumber - 1})
          setPrevPageText(data.text)
        }
    }

    return (
      <SafeAreaView>
        <View style={{height: '11%', backgroundColor: '#085a80'}}>
          <DetailsHeader data={{title: title as string, author: author as string}} />
        </View>
        <View style={{flexDirection: 'column', justifyContent: 'space-between', height: '83.5%'}}>
          {!isConnected 
            ? <DetailsOffline />
            : (<View style={{marginVertical: 5, height: '99%'}}>
            {loading ? <ActivityIndicator ></ActivityIndicator> : (<HtmlContent 
                content={pageText} 
                isDetailsScreen={true}
                fontSize={title.includes('quote') ? 20 : 16}
                textColor={'black'}
                backgroundColor={'#fff'}
            />)}
          </View>)}

          <Pagination currentPage={page} data={{total_pages: totalPages, book_id: id}} onChange={getPageBook} />
        </View>
      </SafeAreaView>
  )
}

export default details
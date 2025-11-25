import HtmlContent from '@/components/micro/HtmlContent';
import { singleBook } from '@/services/api';
import { decryptBook, encryptedPagesNumbers } from '@/app/utils/download';
import { useFocusEffect, useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, BackHandler, Button, FlatList, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Pagination from '@/components/micro/book/details/pagination';

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
        fetchChunks(page)
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
    
    // const fetchDecryptChunks = async (pageNumber: number) => {
    //     if (loading || !hasMore) return;

    //     const pagesLength = await encryptedPagesNumbers(parseInt(id as string), title as string, author as string);
    //     if (pageNumber === pagesLength) return;

    //     setLoading(true);
    //     try {
    //       const texts = await decryptBook(parseInt(id as string), title as string, author as string, pageNumber) as string
    //       setTexts(prevTexts => {
    //         if (prevTexts.includes(texts)) {
    //           setHasMore(false);
    //           return prevTexts;
    //         } else {
    //           setPage(pageNumber + 1);
    //           return [...prevTexts, texts];
    //         }
    //       });
          
    //       setPage(pageNumber + 1);
    //     } catch (error) {
    //       console.log(error);
    //     } finally {
    //       setLoading(false)
    //     }
    // }

    return (
    <View style={{flexDirection: 'column', justifyContent: 'space-between', height: '88%'}}>
      <View style={{marginVertical: 5}}>
        <HtmlContent 
            content={pageText} 
            fontSize={title.includes('quote') ? 20 : 16}
            textColor={'black'}
            backgroundColor={'#fff'}
        />
      </View>

      <Pagination currentPage={page} data={{total_pages: totalPages}} onChange={(value: number) => fetchChunks(value)} />
    </View>
  )
}

export default details
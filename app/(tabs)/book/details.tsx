import HtmlContent from '@/components/micro/HtmlContent';
import { singleBook } from '@/services/api';
import { decryptBook } from '@/app/utils/download';
import { useFocusEffect, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, useColorScheme, View } from 'react-native';

const details = () => {
    const {id, title, author, content = null, isQuote = 'no'} = useLocalSearchParams();
    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
        headerLeft: () => (<></>),
        headerTitle: () => (
            <View>
            <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center', color: '#d4d4d4' }}>
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

      
    const [texts, setTexts] = useState([] as string[]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => setHasMore(true))
    useFocusEffect(
      useCallback(() => {
        setTexts([]);
        if (content) {
          setTexts([content as string])
        } else {
          if (id) {
            fetchChunks(1)
          }
        }
      }, [id, navigation])
    );


    const fetchChunks = async (pageNumber: number) => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
          const data = await singleBook({id: parseInt(id as string), page: pageNumber})
          setTexts(prevTexts => {
            if (prevTexts.includes(data.text)) {
              setHasMore(false);
              return prevTexts;
            } else {
              setPage(pageNumber + 1);
              return [...prevTexts, data.text];
            }
          });
          
          setPage(pageNumber + 1);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false)
        }
    };
    
    const fetchDecryptChunks = async (pageNumber: number) => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
          const texts = await decryptBook(parseInt(id as string), title as string, author as string, pageNumber) as string
          setTexts(prevTexts => {
            if (prevTexts.includes(texts)) {
              setHasMore(false);
              return prevTexts;
            } else {
              setPage(pageNumber + 1);
              return [...prevTexts, texts];
            }
          });
          
          setPage(pageNumber + 1);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false)
        }
    }

    return (
    <View>
      <FlatList
            data={texts}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (<HtmlContent 
                content={item} 
                fontSize={title.includes('quote') ? 20 : 16}
                textColor={'black'}
                backgroundColor={'#fff'}
            />) }
            onEndReached={() => {
            if (!content) {
                fetchChunks(page)
            }
            if (content) {
              fetchDecryptChunks(page)
            }
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={loading ? <ActivityIndicator size="small" /> : null}
       />
    </View>
  )
}

export default details
import HtmlContent from '@/components/micro/HtmlContent';
import { singleBook } from '@/services/api';
import { styles } from '@/styles/postDetails.styles';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';


const BookDetails = () => {
    const {id, title, author} = useLocalSearchParams();
    const navigation = useNavigation();
    useLayoutEffect(() => {
      navigation.setOptions({
        headerTitle: () => (
          <View>
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
              {title}
            </Text>
            <Text style={{ fontSize: 14, color: 'lightgray' }}>
              {author}
            </Text>
          </View>
        ),
        headerStyle: {
          height: 100,
          backgroundColor: '#085a80',
        },
        headerBackVisible: true,
      });
    }, [navigation, title, author]);
  
    const [texts, setTexts] = useState([] as string[]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
      if (!id) return;
      fetchChunks(parseInt(id as string), 1);
    }, [id]);

    const fetchChunks = async (id: number, pageNumber: number) => {
        if (loading || !hasMore) return;

        setLoading(true);

        try {
          const data = await singleBook({id: id, page: pageNumber})
          if (texts.includes(data.text)) {
            setHasMore(false);
          } else {
            const text = [data.text];
            setTexts([...texts, ...text]);
            setPage(pageNumber + 1);
          }
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false)
        }
    };

  return (
    <>
      <View style={styles.container}>
          <FlatList
              data={texts}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => <HtmlContent style={styles.chunkText} content={item} /> }
              onEndReached={() => fetchChunks(parseInt(id as string), page)}
              onEndReachedThreshold={0.5}
              ListFooterComponent={loading ? <ActivityIndicator size="small" /> : null}
          />
      </View>
    </>
  );

}

export default BookDetails

import AuthorCard from '@/components/AuthorCard';
import { fetchAuthors } from '@/services/api';
import useFetch from '@/services/useFetch';
import { useEffect, useLayoutEffect } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { useUserStore } from '../store/user';
import { useNavigation } from 'expo-router';
import { labels } from '../utils/labels';

const authors = () => {
  const setAuthors = useUserStore((state) => state.setAuthors);
  const { data: authors, loading: authorsLoading, error: booksError } = useFetch(() => fetchAuthors())

  const navigation = useNavigation();
  useLayoutEffect(() => {
    // Set the header title for the download screen
    navigation.setOptions({
      headerLeft: () => (<></>),
      title: labels.authors,
      headerTitleAlign: 'center',
        headerStyle: {
            height: 100,
            backgroundColor: '#085a80',
        },
        headerTintColor: '#d4d4d4',
        headerTitleStyle: {
            fontWeight: 'bold',
        },
        headerRight: () => (<></>),
    });
  }, [])

  useEffect(() => {
    if (authors) {
      setAuthors(authors)
    }
  }, [authors, setAuthors])

  return (
    <View style={styles.container}>
      {
      authorsLoading 
        ? <ActivityIndicator size="large" color="#0000ff" className='mt-10 self-center' />
        : (
          <>
            <FlatList
              data={authors}
              renderItem={({item}) => <AuthorCard {...item} /> }
              keyExtractor={(item) => item.id.toString()}
              style={styles.list}
            />
          </>
        )
      }
    </View>
  )
}

export default authors

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightgray"
  },
  list: {
    width: "100%"
  },
})
import AuthorCard from '@/components/AuthorCard';
import { fetchAuthors } from '@/services/api';
import useFetch from '@/services/useFetch';
import { useEffect } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { useUserStore } from '../store/user';

const authors = () => {
  const setAuthors = useUserStore((state) => state.setAuthors);
  const { data: authors, loading: authorsLoading, error: booksError } = useFetch(() => fetchAuthors())

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
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
import { fetchAuthors } from '@/services/api';
import AuthorCard from '@/components/AuthorCard';
import useFetch from '@/services/useFetch';
import { useUserStore } from '../store/user';

const authors = () => {
  const setAuthors = useUserStore((state) => state.setAuthors);
  const { data: authors, loading: authorsLoading, error: booksError } = useFetch(() => fetchAuthors())

  return (
    <View style={styles.container}>
      {
      authorsLoading 
        ? <ActivityIndicator size="large" color="#0000ff" className='mt-10 self-center' />
        : (
          <>
            {setAuthors(authors)}
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
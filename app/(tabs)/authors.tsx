import AuthorCard from '@/components/AuthorCard';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View, Text } from 'react-native';
import { useAuthorsStore } from '../store/authorStore';
import { useNavigation } from 'expo-router';
import SearchInput from '@/components/micro/SearchInput';
import labels from '../utils/labels';

const authors = () => {
  const navigation = useNavigation();
  useEffect(() => navigation.setOptions({ headerShown: false }), []);
  
  const { authors, loading, fetchAuthors, totalPages, page } = useAuthorsStore();
  const [filteredAuthors, setFilteredAuthors] = useState<any[]>(authors)
  const [isFilterNotFound, setIsFilterNotFound] = useState(false)

  useEffect(() => {
    fetchAuthors(); // Initial load
  }, []);

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="small" color="#0000ff" />
      </View>
    );
  };

  const calculatedAuthors = () => {
    if (isFilterNotFound) return [];
    return filteredAuthors.length > 0 ? filteredAuthors : authors;
  }

  return (
    <View style={styles.container}>
      <View style={{width: '100%', height: 35, backgroundColor: 'dimgrey'}}></View>
      <View style={styles.header}>
        <View style={{width: '90%'}}>
          <SearchInput 
            items={authors} 
            filterField='fullName' 
            onFiltered={(items) => setFilteredAuthors(items)} 
            isNotFound={(value: boolean) => setIsFilterNotFound(value)}
          />
        </View>
      </View>
      <FlatList
          data={calculatedAuthors()}
          renderItem={({item}) => <AuthorCard {...item} /> }
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
          onEndReached={fetchAuthors} 
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={() => (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>{labels.noAuthorFound}</Text>
            </View>
          )}
      />
    </View>
  )
}

export default authors

const styles = StyleSheet.create({
  header: {
    width: "100%",
    height: 50,
    backgroundColor: '#f9f0eb',
    justifyContent: "center",
    alignItems: "center",
    margin: 'auto'
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#d4d4d4",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f0eb"
  },
  list: {
    width: "100%"
  },
  item: { padding: 20, borderBottomWidth: 1, borderColor: '#eee' },
  loader: { paddingVertical: 20 },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },
})
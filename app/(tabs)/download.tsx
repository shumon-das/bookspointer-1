import SearchInput from '@/components/micro/SearchInput';
import { deleteBookFile } from '@/helper/details';
import Feather from '@expo/vector-icons/Feather';
import { useFocusEffect, useNavigation, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Snackbar } from 'react-native-paper';
import { deleteBookMeta, getDownloadedBooksMetaList } from '../utils/database/bookMetaDb';
import { useLabels } from '../utils/labels';

const Download = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const labels = useLabels();
  const [books, setBooks] = useState<any[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<any[]>([]);
  const [isFilterNotFound, setIsFilterNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  const loadBooks = useCallback(async (isRefreshing = false) => {
    if (isRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const bookMetas = await getDownloadedBooksMetaList();
      setBooks(Array.isArray(bookMetas) ? bookMetas : []);
      setFilteredBooks([]);
      setIsFilterNotFound(false);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      void loadBooks();
    }, [loadBooks]),
  );

  const visibleBooks = useMemo(
    () => (isFilterNotFound ? [] : filteredBooks.length > 0 ? filteredBooks : books),
    [books, filteredBooks, isFilterNotFound],
  );

  const openBook = (item: any) => {
    if (!item?.book_id) return;

    router.push({
      pathname: '/screens/book/downloaded-details',
      params: { bookid: item.book_id },
    });
  };

  const handleDelete = async (item: any) => {
    try {
      await deleteBookFile(item.book_id);
      await deleteBookMeta(item.book_id);
      setBooks((previousBooks) => previousBooks.filter((book) => book.book_id !== item.book_id));
      setFilteredBooks((previousBooks) => previousBooks.filter((book) => book.book_id !== item.book_id));
      setToastVisible(true);
    } catch (error) {
      console.log('Failed to delete book.', error);
      Alert.alert(labels.sorry, 'Failed to delete book.');
    }
  };

  const showConfirmDialog = (item: any) => {
    Alert.alert(labels.removingBookWarning, labels.removeBookWarning, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Yes', onPress: () => void handleDelete(item) },
    ]);
  };

  const renderBook = ({ item }: { item: any }) => (
    <View style={styles.bookRow}>
      <TouchableOpacity style={styles.bookPressable} onPress={() => openBook(item)} activeOpacity={0.7}>
        <View style={styles.bookIcon}>
          <Feather name="book-open" size={20} color="#085a80" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {item.author}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => showConfirmDialog(item)}
        style={styles.deleteButton}
        accessibilityRole="button"
        accessibilityLabel={labels.delete}
      >
        <Feather name="trash-2" size={18} color="#9e3d31" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topBar} />
      <View style={styles.header}>
        <View style={styles.searchWrap}>
          <SearchInput
            items={books}
            filterField="title"
            onFiltered={setFilteredBooks}
            isNotFound={setIsFilterNotFound}
          />
        </View>
      </View>

      <FlatList
        data={visibleBooks}
        keyExtractor={(item) => String(item.book_id)}
        renderItem={renderBook}
        style={styles.list}
        contentContainerStyle={visibleBooks.length === 0 ? styles.emptyList : undefined}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void loadBooks(true)} />}
        ListEmptyComponent={
          loading ? (
            <View style={styles.loader}>
              <ActivityIndicator size="small" color="#085a80" />
            </View>
          ) : (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>{labels.noBooksFound}</Text>
            </View>
          )
        }
      />

      <Snackbar visible={toastVisible} onDismiss={() => setToastVisible(false)} duration={2000}>
        {labels.deleteBook}
      </Snackbar>
    </View>
  );
};

export default Download;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f0eb',
  },
  topBar: {
    width: '100%',
    height: 35,
    backgroundColor: 'dimgrey',
  },
  header: {
    width: '100%',
    height: 50,
    backgroundColor: '#f9f0eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchWrap: {
    width: '90%',
  },
  list: {
    width: '100%',
  },
  emptyList: {
    flexGrow: 1,
  },
  bookRow: {
    minHeight: 66,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f0eb',
    borderBottomWidth: 0.5,
    borderBottomColor: '#9b9996',
    paddingLeft: 12,
  },
  bookPressable: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
  },
  bookIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e3edf1',
    marginRight: 11,
  },
  textContainer: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#202020',
  },
  subtitle: {
    marginTop: 3,
    fontSize: 14,
    color: '#6b6b6b',
  },
  deleteButton: {
    width: 52,
    minHeight: 66,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 28,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
  },
});

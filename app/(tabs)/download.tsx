import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native'
import React, { useCallback, useLayoutEffect, useState } from 'react'
import { labels } from '../utils/labels';
import { useFocusEffect, useNavigation, useRouter } from 'expo-router';
import { Snackbar } from 'react-native-paper';
import Feather from '@expo/vector-icons/Feather';
import { deleteBookMeta, getDownloadedBooksMetaList } from '../utils/database/bookMetaDb';
import { deleteBookFile } from '@/helper/details';

const Download = () => {
  const router = useRouter();
  const [books, setBooks] = useState([] as any[]);
  const [toastVisible, setToastVisible] = useState(false)

  useFocusEffect(
    useCallback(() => {
      const fetchBooks = async () => {
        
        const bookMetas = await getDownloadedBooksMetaList();
        setBooks(bookMetas);
      };

      fetchBooks();
    }, [])
  );

  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (<></>),
      title: labels.download,
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

  const openBook = async (item: any) => {
    if(!item) return
    try {
      const content = 'downloaded book';
      router.push({
        pathname: "/screens/book/downloaded-details", 
        params: {bookid: item.book_id}
      })
    } catch (error) {
      console.error('Error opening book:', error);
      alert('Failed to open book.');
    }  
  };

  const handleDelete = (item: any) => async () => {
    try {
      await deleteBookFile(item.book_id)
      await deleteBookMeta(item.book_id)
      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== item.id));
      setToastVisible(true);
    } catch(e) {
      alert('Failed to delete book.');
      console.log('Failed to delete book. ', e)
    }
  };

  const renderBook = (item: any) => {
    if (!item.book_id || !item.title || !item.author) return 'No book found';
    
    return (
      <View style={[styles.itemContainer, {backgroundColor: '#fff'}]}>
        <View style={styles.textContainer}>
          <Text style={[styles.title, {color: 'black'}]}>
          <Feather name="book-open" size={18} color={'black'} /> {item.title}
          </Text>
          <Text style={[styles.subtitle, {color: 'black'}]}>
            <Feather name="user" size={18} color={'black'} /> {item.author}
          </Text>
        </View>
        <View >
          <TouchableOpacity onPress={() => { showConfirmDialog(item) }} style={{ padding: 7 }}> 
            <Feather name="trash" size={18} color={'black'} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const showConfirmDialog = (item: any) => {
      Alert.alert(
        labels.removingBookWarning,
        labels.removeBookWarning,
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancelled"),
            style: "cancel"
          },
          {
            text: "Yes",
            onPress: handleDelete(item)
          }
        ]
      );
    };

  return (
    <View style={[styles.container, {backgroundColor: '#fff'}]}>
      <FlatList
        data={books}
        keyExtractor={(item) => item.book_id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openBook(item)}>
            {renderBook(item)}
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={{textAlign: 'center', marginTop: 20}}>{labels.noBooksFound}</Text>}
      />

      <Snackbar visible={toastVisible} onDismiss={() => setToastVisible(false)} duration={2000}>
          {labels.deleteBook}
      </Snackbar>
    </View>
  )
}

export default Download

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    // backgroundColor: 'white',
  },
  itemContainer: {
    flexDirection: 'row', 
    alignItems: 'center',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1
  },
  textContainer: {
    flexDirection: 'column',
    paddingVertical: 8,
    width: '90%',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#666',
    marginTop: 4,
  },
});
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native'
import React, { useCallback, useLayoutEffect, useState } from 'react'
import { labels } from '../utils/labels';
import { useFocusEffect, useNavigation, useRouter } from 'expo-router';
import { decryptBook, deleteBook, listDownloadedBooks } from '../utils/download';
import { Snackbar } from 'react-native-paper';
import Feather from '@expo/vector-icons/Feather';

interface DownloadedBook {
  id: string; 
  path: string;
}

const Download = () => {
  const router = useRouter();
  const [books, setBooks] = useState([] as DownloadedBook[]);
  const [toastVisible, setToastVisible] = useState(false)

  useFocusEffect(
    useCallback(() => {
      const fetchBooks = async () => {
        const downloaded = await listDownloadedBooks();
        setBooks(downloaded);
      };

      fetchBooks();
    }, [])
  );

  const navigation = useNavigation();
  useLayoutEffect(() => {
    // Set the header title for the download screen
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

  const openBook = async (itemId: string) => {
    const [id, title, author] = itemId.split('.').slice(0, 4);
    if (!id || !title || !author) return 'No book found';

    try {
      const content = await decryptBook(id as unknown as number, title, author);
      
      if (content) {
        router.push({
          pathname: "/screens/book/details", 
          params: {id: id, title: title, author: author, content, isQuote: 'no'}
        })
      }
      else {
        alert('Failed to open book.');
      }
    } catch (error) {
      console.error('Error opening book:', error);
      alert('Failed to open book.');
    }  
  };

  const handleDelete = (item: {id: string; path: string}) => async () => {

    const deleted = await deleteBook(item.path);

    if (deleted) {
      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== item.id));
      setToastVisible(true);
    } else {
      alert('Failed to delete book.');
    }
  };

  const renderBook = (item: {id: string; path: string}) => {
    const [id, title, author] = item.id.split('.').slice(0, 4);
    if (!id || !title || !author) return 'No book found';
    
    const bookTitle = title.replace(/_/g, ' ');
    const bookAuthor = author.replace(/_/g, ' ');
    return (
      <View style={[styles.itemContainer, {backgroundColor: '#fff'}]}>
        <View style={styles.textContainer}>
          <Text style={[styles.title, {color: 'black'}]}>
          <Feather name="book-open" size={18} color={'black'} /> {bookTitle}
          </Text>
          <Text style={[styles.subtitle, {color: 'black'}]}>
            <Feather name="user" size={18} color={'black'} /> {bookAuthor}
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
      {
        books.length === 0 
        ? <Text style={{textAlign: 'center', marginTop: 20}}>{labels.noBooksFound}</Text> 
        : (<FlatList
            data={books}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => openBook(item.id)}>
                {renderBook(item)}
              </TouchableOpacity>
            )}
          />)
      }
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
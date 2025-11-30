import { styles } from '@/styles/bookCard.styles';
import React, { useCallback, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import HtmlContent from './micro/HtmlContent';
import { router, useFocusEffect } from 'expo-router';
import labels from '@/app/utils/labels';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveBook } from '@/services/api';
import { useAuthStore } from '@/app/store/auth';
import { Snackbar } from 'react-native-paper';

interface BookCardProps {
  title: string;
  content: string;
  author: { id: number; uuid: string; image: string; fullName: string };
  createdBy: { id: number; uuid: string; fullName: string; image: string, roles: string[] };
  category: { label: string }|string;
}

const BookCardPreview = ({book, onBack}: {book: BookCardProps, onBack: (value: boolean) => void}) => {
  const [bookData, setBookData] = useState(book)
  const [showSnackBar, setShowSnakBar] = useState(false);
  const [snackBarMessage, setSnakBarMessage] = useState('');

  const authorImage = Object.keys(book.author).includes('image') 
    ? { uri: `https://api.bookspointer.com/uploads/${book.author.image}` }
    : require('../assets/images/user.png')

    useFocusEffect(
    useCallback(() => {
      setBookData(book)
    }, [book])
  );

  const saveBookData = async () => {
      const storageUser = await AsyncStorage.getItem('auth-user');
      const storedToken = await AsyncStorage.getItem('auth-token');
      if (!storedToken) {
          alert(labels.pleaseLoginToContinue);
          return;
      }

      const response = await saveBook(book as any, storedToken);
      if (!response.status) {
          if ('Book already exists' === response.message) setSnakBarMessage(labels.bookCreate.bookExists)
          else setSnakBarMessage(response.message)
          setShowSnakBar(true)
      }

      if (response.status && storageUser) {
          setSnakBarMessage(response.message)
          setShowSnakBar(true)
          useAuthStore.getState().setUser(JSON.parse(storageUser))
      }
  }

  return (
    <View>
      <View>
         <View style={{flex: 1, flexDirection: 'row', height: 100, marginBottom: 100}}>
           <TouchableOpacity style={{width: '30%'}} onPress={() => console.log('')}>
              <Image source={require('../assets/images/default_post_image_1.jpeg')} style={{width: 100, height: 100, resizeMode: 'contain'}} />
              <View style={styles2.content}>
                  <Text style={styles2.seriesName}>{book.title}</Text>
                  <Image style={styles2.contentAuthorImage} source={authorImage} />
                  <Text style={styles2.authorName}>{book.author.fullName}</Text>
              </View>
           </TouchableOpacity>
           <View style={{marginTop: 5, height: 90}}>
              <Text style={styles.postTitle}>{bookData.title.length > 20 ? book.title.substring(0, 20) : book.title}</Text>
              <Text style={styles.postAuthorName}>{bookData.author.fullName}</Text>
              <Text style={styles.postCategory}>{typeof bookData.category === 'string' ? bookData.category : bookData.category.label}</Text>
           </View>
         </View>
         
          <View style={{height: 400, margin: 10}}>
            <HtmlContent content={bookData.content} />
          </View>
      </View>    

      <View style={{marginTop: 20, width: '100%', marginHorizontal: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
        <View style={{width: 100}}>
          <TouchableOpacity style={{backgroundColor: '#36454F', paddingHorizontal: 10, paddingVertical: 5}} onPress={() => onBack(false)}>
            <Text style={{color: 'white', width: '100%', textAlign: 'center'}}>Back</Text>
          </TouchableOpacity>
        </View>

        <View style={{width: 100}}>
          <TouchableOpacity style={{backgroundColor: '#4169E1', paddingHorizontal: 10, paddingVertical: 5}} onPress={saveBookData}>
              <Text style={{color: 'white', width: '100%', textAlign: 'center'}}>{ labels.saveBook }</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Snackbar
          visible={showSnackBar}
          onDismiss={() => setShowSnakBar(false)}
          duration={3000}
          action={{
              label: labels.bookCreate.viewBook,
              onPress: () => router.push("/screens/user/userProfile"),
          }}
      >{snackBarMessage}</Snackbar> 
    </View>
  )
}

export default BookCardPreview

const styles2 = StyleSheet.create({
  content: {
    position: 'absolute',
    width: '68%',
    height: 80,
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 15,
    marginTop: 10,
    transform: [{ rotate: '-3deg' }]
  },
  seriesName: {
    fontSize: 12,
    textAlign: 'center',
    color: '#F6F7F9',
  },
  contentAuthorImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  authorName: {
    fontSize: 8, 
    color: '#F6F7F9'
  },
})
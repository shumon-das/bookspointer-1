import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { styles } from '@/styles/bookCard.styles';
// import { Book } from '../types/Book';

interface BookCardProps {
  id: number;
  image: string;
  title: string;
  author: { id: number; image: string; fullName: string };
  createdBy: { id: number; fullName: string; image: string, roles: string[] };
}


const DefaultPostImage = (book: {book: BookCardProps}) => {
  const title = book.book.title.length > 20 ? book.book.title.slice(0, 20) + '...' : book.book.title;
  return (
    <TouchableOpacity key={book.book.id} style={styles2.series} onPress={() => console.log('')}>
        <Image source={require('../../assets/images/default_post_image_1.jpeg')} style={styles2.image} />
        <View style={styles2.content}>
            <Text style={styles2.seriesName}>{title}</Text>
            <Image style={styles2.contentAuthorImage} source={{ uri: `https://api.bookspointer.com/uploads/${book.book.author.image}` }} />
            <Text style={styles2.authorName}>{book.book.author.fullName}</Text>
        </View>
    </TouchableOpacity>
  )
}

export default DefaultPostImage


const styles2 = StyleSheet.create({
  series: {
    width: '30%',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    position: 'relative',
    height: 160,
    marginHorizontal: 10,
  },
  image: { 
    width: '100%', 
    height: '100%',
  },
  content: {
    position: 'absolute',
    width: '68%',
    height: 100,
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 15,
    transform: [{ rotate: '-3deg' }]
  },
  seriesName: {
    fontSize: 14,
    textAlign: 'center',
    color: '#F6F7F9',
  },
  contentAuthorImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  authorName: {
    fontSize: 10, 
    color: '#F6F7F9'
  },
})
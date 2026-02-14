import { useAuthStore } from '@/app/store/temporaryStore';
import { labels } from '@/app/utils/labels';
import { styles } from '@/styles/profileBookCard.styles';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Popover from 'react-native-popover-view';
import Icon from 'react-native-vector-icons/FontAwesome';

const ProfileBookCard = (book: Book) => {
  const authUser = useAuthStore((state) => state.user);
  const bookImage = `https://api.bookspointer.com/uploads/${book.image ? book.image : 'default_post_image.jpg'}`
  const profileBookCardRef = useRef(null)
  const [showPopover, setShowPopover] = useState(false)

  return (
    <View key={book.id} style={{ margin: 10, width: '40%' }}>
      <TouchableOpacity onPress={() => router.push({ pathname: "/book/[id]", params: { id: book.id, title: book.title, author: book.author.fullName } })}>
        <Image source={{ uri: bookImage }} style={styles.bookImg} />
        <View style={styles.bookInfo}>
          <View>
            <View>
              <Text style={styles.likesSaves}>{book.details.likes.length}</Text>
              <Icon name='thumbs-up'></Icon>
            </View>
            <View style={{ marginTop: 5 }}>
              <Text style={styles.likesSaves}>{book.details.save.length}</Text>
              <Icon name='bookmark'></Icon>
            </View>
          </View>
          <View style={{}}>
            <Text style={styles.category}>{book.category}</Text>
          </View>
        </View>
      </TouchableOpacity>

      <Popover
        isVisible={showPopover}
        from={profileBookCardRef}
        onRequestClose={() => setShowPopover(false)}
      >
        <Text style={{ width: 150, paddingVertical: 10, paddingLeft: 10, paddingRight: 25 }}
          onPress={() => router.push({ pathname: `/book/writeNewBook`, params: { uuid: book.uuid } })}
        >
          <Icon name='pencil'></Icon> {labels.editBook}
        </Text>
        <Text style={{ width: 150, paddingVertical: 10, paddingLeft: 10, paddingRight: 25 }}
          onPress={() => alert('should update the publish status')}
        >
          <Icon name='lock'></Icon> {book.isPublished ? labels.privateBook : labels.publishBook}
        </Text>
      </Popover>

      {authUser
        ?
        <TouchableOpacity ref={profileBookCardRef} onPress={() => setShowPopover(true)} style={styles.cardBottom}>
          <Text>{book.title}</Text>
          <Text style={{ paddingLeft: 20, paddingRight: 2, paddingTop: 5 }}><Icon name='ellipsis-v'></Icon></Text>
        </TouchableOpacity>
        : <TouchableOpacity style={styles.cardBottom}><Text>{book.title}</Text></TouchableOpacity>
      }
    </View>
  )
}

export default ProfileBookCard

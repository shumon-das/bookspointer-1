import { useAuthStore } from "@/app/store/auth";
import { labels } from "@/app/utils/labels";
import HtmlContent from "@/components/micro/HtmlContent";
import UserProfileHeader from "@/components/micro/user/profile/UserProfileHeader";
import { Book } from "@/components/types/Book";
import { deleteBookItem } from "@/services/api";
import { fetchBooksBySeriesName } from "@/services/profileApi";
import { styles } from '@/styles/profilePageBooks.styles';
import { UserInterface } from "@/types/interfeces";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, BackHandler, FlatList, Image, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import Modal from 'react-native-modal';
import { Snackbar } from "react-native-paper";
import FontAwesome from '@expo/vector-icons/FontAwesome';

const UserProfilePageBooks = () => {
  const {series, backurl} = useLocalSearchParams();

  const navigation = useNavigation();
  useEffect(() => navigation.setOptions({ headerShown: false }), []);
  
  const [seriesName, setSeriesName] = useState<string|null>(null);
  const [user, setUser] = useState<UserInterface|null>(null);
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [booksNotFound, setBooksNotFound] = useState<string|null>(null);
  const [showEdit, setShowEdit] = useState(false)
  const [showEditBook, setShowEditBook] = useState(null as any)
  const [visibleModal, setVisibleModal] = useState(null as any)
  const [deleteItem, setDeleteItem] = useState(null as any)
  const [showSnackBar, setShowSnakBar] = useState(false);
  const [snackBarMessage, setSnakBarMessage] = useState('');

  const getAuthorBooksFromDb = async (series: string) => {
    if (!series || !user) return;
    const data = await fetchBooksBySeriesName(series, user ? user.id : 0, false, true);
    setBooks(data);
    if (data.length === 0) {
      setBooksNotFound(labels.noBooksFoundForThisSeries);
    } else {
      setBooksNotFound(null);
    }
  }

  useFocusEffect(
    useCallback(() => {
      const authUser = useAuthStore.getState().user;
      if (authUser) setUser(authUser);

      if (series) {
        setSeriesName(series as unknown as string)
      }
    }, [series])
  )
  
  useEffect(() => {
    getAuthorBooksFromDb(seriesName as string);
  }, [seriesName, user]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      router.replace('/screens/user/userProfile');
      return true
    });
    return () => backHandler.remove();
  }, [backurl])

  const title = (title: string) => {
    return title.length > 20 ? title.slice(0, 20) + '...' : title;
  }

  const onChooseBook = (book: Book) => {
    router.push({pathname: "/screens/book/details", params: {
        id: book.id, 
        title: book.title, 
        author: book.author.fullName,
        content: null,
        isQuote: 'no',
        backurl: JSON.stringify({pathname: "/screens/user/userProfilePageBooks", params: { series: seriesName }})
    }})
  }
  const showEditOption = (book: any) => {
    setShowEditBook(book)
    setShowEdit(true)
  }

  const readBook = (book: Book) => {
    onChooseBook(book);
  }
  const editBook = (book: Book) => {
    router.push({pathname: "/screens/book/write-book", params: { bookuuid: book.uuid, }});
  }
  const deleteBook = (book: Book) => {
    setDeleteItem(book)
    setVisibleModal(true)
  }

  const onDeleteBook = async () => {
    const token = await AsyncStorage.getItem('auth-token')
    if (!token) {
      alert(labels.pleaseLoginToContinue)
      return;
    }
    if (!deleteItem) {
      alert('Select a book to delete')
      return;
    }

    const response = await deleteBookItem(deleteItem.id, token)
    if (response.status) {
      setVisibleModal(false)
      setBooks(books.filter((b) => b.id !== deleteItem.id))
      setSnakBarMessage(response.message)
      setShowSnakBar(true)
    }
  }

  const renderItem = ({item}: {item: Book}) => (
    <View style={styles.book}>
      <TouchableOpacity
        key={item.id}
        style={styles.series}
        onPress={() => onChooseBook(item)}
        onLongPress={() => showEditOption(item)}
      >
        <View pointerEvents="none" style={{ width: '100%', height: '100%' }}>
          <Image
            source={require('../../../assets/images/default_post_image.jpg')}
            style={styles.image}
          />
        </View> 

        {/* Content */}
        <View style={styles.content} pointerEvents="none">
          <Text style={styles.seriesName}>{item.title.includes('quote') ? item.category : title(item.title)}</Text>
          <Image
            style={styles.contentAuthorImage}
            source={{ uri: `https://api.bookspointer.com/uploads/${item.author.image}` }}
          />
          <Text style={styles.authorName}>{item.author.fullName}</Text>
        </View>

        {/* ===== OVERLAY MENU ===== */}
        {showEdit && showEditBook && showEditBook.id === item.id && (
          <View style={styles.overlay}>
            <View style={styles.overlayBox}>
              <TouchableOpacity activeOpacity={1} onPress={() => setShowEdit(false)} style={{marginHorizontal: 5}}>
                <Text style={{width: '100%', textAlign: 'right' }}>
                  <FontAwesome name="close" size={18} color="black"/>
                </Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={1} onPress={() => readBook(item)}>
                  <Text style={styles.overlayItem}>{labels.read}</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={1} onPress={() => editBook(item)}>
                  <Text style={styles.overlayItem}>{labels.editBook}</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={1} onPress={() => deleteBook(item)}>
                  <Text style={styles.overlayItem}>{labels.delete}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </TouchableOpacity>

      <View>
        {item.title.includes('quote') && <HtmlContent content={item.content.substring(0, 12)} />}
        {!item.title.includes('quote') && <Text>{title(item.title)}</Text>}
      </View>
    </View>

  );
  
  return (
    <SafeAreaView style={{flex: 1}}>
        <UserProfileHeader author={user} />

        { booksNotFound ? (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text>{booksNotFound}</Text>
            </View>
        ) : '' }

        { books.length === 0 && !booksNotFound ? (<ActivityIndicator size="small" color="#0000ff" />) : (
            <>
              <FlatList 
                data={books}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                numColumns={3}
                columnWrapperStyle={{ justifyContent: 'space-around', marginBottom: 10 }}
              />
            </>
        )}
        <Modal
          isVisible={visibleModal}
          onBackdropPress={() => setVisibleModal(false)}
          backdropOpacity={0.2}
          animationIn="fadeIn"
          animationOut="fadeOut"
          style={{ justifyContent: 'center', alignItems: 'center', margin: 0 }}
        >
          <View style={{ backgroundColor: '#fff', borderRadius: 8, padding: 10, width: '60%' }}>
            <Text style={{color: 'red', textAlign: 'center', fontSize: 20}}>{labels.removeBookWarning}</Text>
            <View style={{marginTop: 50, width: '100%', marginHorizontal: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <View style={{width: 100}}>
                <TouchableOpacity style={{backgroundColor: '#36454F', paddingHorizontal: 10, paddingVertical: 5}} onPress={() => setVisibleModal(false)}>
                  <Text style={{color: 'white', width: '100%', textAlign: 'center'}}>{labels.sortWords.no}</Text>
                </TouchableOpacity>
              </View>
      
              <View style={{width: 100}}>
                <TouchableOpacity style={{backgroundColor: 'red', paddingHorizontal: 10, paddingVertical: 5}} onPress={() => onDeleteBook()}>
                    <Text style={{color: 'white', width: '100%', textAlign: 'center'}}>{ labels.delete }</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Snackbar visible={showSnackBar} onDismiss={() => setShowSnakBar(false)} duration={3000}>{snackBarMessage}</Snackbar> 
    </SafeAreaView>
  )
}

export default UserProfilePageBooks

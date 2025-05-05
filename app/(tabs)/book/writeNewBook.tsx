import { useAuthStore } from "@/app/store/auth";
import { labels } from "@/app/utils/labels";
import { htmlString } from '@/app/utils/richEditorHtml';
import DropdownList from '@/components/micro/DropdownList';
import ImagePicker from '@/components/micro/ImagePicker';
import { Category } from '@/components/types/Category';
import { User } from '@/components/types/User';
import { fullBook, saveBookWithFile } from '@/services/api';
import { styles } from '@/styles/writeBook.styles';
import { useNavigation, useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router/build/hooks';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Snackbar } from 'react-native-paper';
import { WebView } from 'react-native-webview';

const writeNewBook = () => {
  const token = useAuthStore((state) => state.token)
  const router = useRouter()
  const navigation = useNavigation()
  const title = labels.writeNewBook
  useLayoutEffect(() => navigation.setOptions({ title }), [navigation, title]);
  
  const [image, setImage] = useState('default_post_image.jpg')
  const [bookTitle, setBookTitle] = useState('')
  const [category, setCategory] = useState(null as Category | null)
  const [author, setAuthor] = useState(null as User | null)
  const [content, setContent] = useState('')
  const webviewRef = useRef<WebView>(null);
  const html = htmlString(content);
  const [readyToSave, setReadyToSave] = useState(false)
  const [loading, setLoading] = useState(false);
  const {uuid}: any = useLocalSearchParams();
  const [bookId, setBookId] = useState(null)
  const [toastVisible, setToastVisible] = useState(false)

  useEffect(() => {
      if (!token) {
        router.push('/auth/login')
      }

      setLoading(true)
      fetchFullBook(uuid);
      setLoading(false)
  }, []);

  const fetchFullBook = async (uuid: string) => {
    const data = await fullBook(uuid)
    setBookId(data.id)
    setImage(data.image)
    setBookTitle(data.title)
    setCategory(data.category)
    setAuthor(data.author)
    setContent(data.content)
  }

  const handleMessage = (event: any) => {
    const content = event.nativeEvent.data;
    setContent(content);
  };

  const save = async () => {
    if (!token) {
        alert('Please login. before create any post');
        return;
    }
    if (null === category) {
      alert('Category is required');
      return;
    }
    if (null === author) {
      alert('Author is required');
      return;
    }

    if ('' === content) {
      alert('Content is required');
      return;
    }

    let value = {
      image: image.includes('file:') ? image : null,
      title: bookTitle,
      category: category,
      author: author,
      content: content,
      tags: ['no tags'],
      seriesName: 'বইসমূহ'
    } as any
    if (uuid) {
      value = {...value, ...{id: bookId, uuid: uuid}};
    }
    const data = await saveBookWithFile(value, token) 

    setReadyToSave(false)
    setToastVisible(true)
    setTimeout(() => router.push('/profile'), 2000)
  } 

  return (
     <KeyboardAvoidingView
       style={styles.container}
       behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
         keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 60}
     >
      <ScrollView style={{flex: 1}}  keyboardShouldPersistTaps="handled">
        <View style={{flexDirection: 'row'}}>
            <View style={styles.imageContainer}>
                <ImagePicker 
                  defaultImage={image} 
                  onChange={(value) => setImage(value)} 
                />
            </View>
            <View style={{width: '45%', marginTop: 20, marginHorizontal: 10}}>
              <Text>{labels.bookCreate.coverMessage}</Text>
            </View>
        </View>
        <View style={{ width: '90%', marginHorizontal: 'auto', flex: 1, }}>
            <TextInput
                style={styles.input}
                onChangeText={(value) => setBookTitle(value)}
                value={bookTitle}
                placeholder={labels.bookCreate.title}
            /> 

            <DropdownList 
              context='categories' 
              onChange={(value) => setCategory(value as Category | null)} 
              defaultOption={category}
              field='label'
            />

            <DropdownList 
              context='authors' 
              onChange={(value) => setAuthor(value as User | null)} 
              defaultOption={author}
              field='fullName'
            />

            <View style={{height: 300}}>
              <WebView
                ref={webviewRef}
                originWhitelist={['*']}
                source={{ html }}
                onMessage={handleMessage}
                javaScriptEnabled
                domStorageEnabled
                style={{flex: 1}}
                keyboardDisplayRequiresUserAction={false}
                scrollEnabled={false}
                nestedScrollEnabled={true}
              />
            </View>

            {readyToSave 
              ? <TouchableOpacity style={[styles.button, styles.registerPageSaveBtn]} onPress={save}>
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>

              : <TouchableOpacity style={[styles.button, styles.registerPageSaveBtn]} onPress={() => {
                  webviewRef.current?.injectJavaScript(`window.getHTML(); true;`);
                  setReadyToSave(true)
                  setTimeout(() => setReadyToSave(false), 3000)
                }}>
                    <Text style={[styles.buttonText]}>Ready</Text>
                </TouchableOpacity>  
            }
        </View>
        <Snackbar visible={toastVisible} onDismiss={() => setToastVisible(false)} duration={2000}>
          {labels.saveBookIntoDb}
        </Snackbar>
      </ScrollView>  
     </KeyboardAvoidingView>
  )
}

export default writeNewBook
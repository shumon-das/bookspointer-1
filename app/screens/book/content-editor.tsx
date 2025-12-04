import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, TouchableOpacity, View } from 'react-native';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import { toPellHtml, toQuillHtml } from '../../utils/htmlNormalizer'
import { labels } from '@/app/utils/labels';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_CONFIG from '@/app/utils/config';
import { resizeImage } from '@/app/utils/imageResize';
import { useAuthStore } from '@/app/store/auth';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Feather from '@expo/vector-icons/Feather';

export default function TextEditor() {
  const {content = ''} = useLocalSearchParams();
  const richText = useRef<RichEditor | null>(null);
  const [initialContent, setInitialContent] = useState('')
  const [html, setHtml] = React.useState(toPellHtml(initialContent) || '');
  const router = useRouter();

  const navigation = useNavigation()
  useEffect(() => navigation.setOptions({ headerShown: false }), []);

  useFocusEffect(
    useCallback(() => {
      if (content) {
        setInitialContent(useAuthStore.getState().bookContent)
      }
    }, [content])
  );

  const onEditorChange = (newHtml: any) => {
    setHtml(newHtml);
    useAuthStore.getState().setBookContent(newHtml)
  }

  const onPressCheck = async () => {
    const finalHtml = toQuillHtml(html);
    useAuthStore.getState().setBookContent(finalHtml)
    router.back();
  }

  const pickImage = async () => {
    const token = await AsyncStorage.getItem('auth-token')
    if (!token) {
      Alert.alert(labels.sorry, labels.pleaseLoginToContinue);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 1,
      allowsEditing: false
    });

    if (result.canceled) return;

    try {
      const resizedImage: any = await resizeImage(result.assets[0].uri)
      const formData = new FormData();
      formData.append('file', {
          uri: resizedImage.uri,
          name: result.assets[0].uri.split('/').pop(),
          type: "image/*"
      } as any);

      const response = await fetch(`${API_CONFIG.BASE_URL}/admin/upload-image`, {
          method: 'POST',
          headers: {'Authorization': `Bearer ${token}`},
          body: formData
      })

      const upload = await response.json();
      const finalUrl = `${API_CONFIG.BASE_URL}/uploads/${upload.filename}`;
      richText.current?.insertImage(finalUrl);
    } catch (error) {
      console.log("Upload error", error);
      Alert.alert("Error", "Failed to upload image");
    }

  };

  return (
    <View>
      <View style={{backgroundColor: '#085a80', height: 90}}>
          <View style={{marginTop: 50, flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 15}}> 
              <TouchableOpacity onPress={() => router.back()}>
                  <FontAwesome5 name="arrow-left" size={18} color="#d4d4d4" />
              </TouchableOpacity>

              {<TouchableOpacity onPress={onPressCheck}>
                  <Feather name="check" size={24} color="#d4d4d4" />
              </TouchableOpacity>}
          </View>
      </View>
      <View style={{ flex: 1, paddingHorizontal: 10, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E6E6FA' }}>
          <RichToolbar
            editor={richText}
            actions={[
              actions.setBold,
              actions.setItalic,
              actions.setUnderline,
              actions.heading1,
              actions.insertBulletsList,
              actions.insertOrderedList,
              actions.insertLink,
              actions.insertImage,
              actions.setTextColor
            ]}
            onPressAddImage={pickImage}
            style={{ backgroundColor: '#fff', borderBottomWidth: 0.5 }}
          />
          <RichEditor
              ref={richText}
              initialContentHTML={initialContent}
              onChange={onEditorChange}
              placeholder={labels.startWriting}
              scrollEnabled={true}
              editorStyle={{
                contentCSSText: 'min-height:600px; max-height:600px;line-height:22px; overflow-y:auto;border-bottom:1px solid #ccc;',
              }}
          />
          <View style={{height: 100}}></View>
      </View>
    </View>
  );
}

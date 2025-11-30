import React, { useEffect, useRef } from 'react';
import { Alert, View } from 'react-native';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import { toPellHtml, toQuillHtml } from '../../app/utils/htmlNormalizer'
import { labels } from '@/app/utils/labels';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_CONFIG from '@/app/utils/config';
import { resizeImage } from '@/app/utils/imageResize';

export default function TextEditor({initialContent, onChange}: any) {
  const richText = useRef<RichEditor | null>(null);
  const [html, setHtml] = React.useState(toPellHtml(initialContent) || '');

  useFocusEffect(
    React.useCallback(() => {
      if (initialContent) {
        const newHtml = toPellHtml(initialContent) || '';
        setHtml(newHtml);
        richText.current?.setContentHTML(newHtml);
      }
    }, [initialContent])
  );

  useEffect(() => {
    const newHtml = toPellHtml(initialContent) || '';
    setHtml(newHtml);
    if (richText.current) {
      richText.current.setContentHTML(newHtml);
    }
  }, [initialContent]);

  const onEditorChange = (newHtml: any) => {
    setHtml(newHtml);
    onChange(toQuillHtml(newHtml))
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
              contentCSSText: 'min-height:300px; max-height:300px;line-height:22px; overflow-y:auto;border-bottom:1px solid #ccc;',
            }}
        />
    </View>
  );
}

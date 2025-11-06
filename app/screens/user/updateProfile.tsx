import { labels } from '@/app/utils/labels';
import { updateProfileInfo } from '@/services/userApi';
import { styles } from '@/styles/writeBook.styles';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useLayoutEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Snackbar } from 'react-native-paper';
import WebView from 'react-native-webview';

const updateProfile = () => {
    const {userId, token} = useLocalSearchParams();
    const navigation = useNavigation()
    const [toastVisible, setToastVisible] = useState(false)
    const webviewRef = useRef<WebView>(null);
    
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [description, setDescription] = useState('')
    const [readyToSave, setReadyToSave] = useState(false)

    useLayoutEffect(() => {
      const title = labels.editProfile
      navigation.setOptions({ title }), [title]
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity onPress={() => console.log('updateProfile')}>
            <FontAwesome name="gear" size={20} style={{paddingHorizontal: 15}} />
          </TouchableOpacity>
        ),
      })
    })

    const handleMessage = (event: any) => {
      const content = event.nativeEvent.data;
      setDescription(content);
    };

    const save = async () => {
      const data = {
        firstName,
        lastName,
        email
      }

      const response = await updateProfileInfo(data, description)
      if (response) {
        setToastVisible(true)
        setTimeout(() => {
          setToastVisible(false)
          navigation.goBack()
        }, 2000)
      }
    }

  return (
    <KeyboardAvoidingView
       style={styles.container}
       behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
         keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 60}
     >
      <ScrollView style={{flex: 1}}  keyboardShouldPersistTaps="handled">
        <View style={{ width: '90%', marginHorizontal: 'auto', flex: 1, }}>
            <TextInput
                style={styles.input}
                onChangeText={(value) => setFirstName(value)}
                value={firstName}
                placeholder={labels.firstName}
            />

            <TextInput
                style={styles.input}
                onChangeText={(value) => setLastName(value)}
                value={lastName}
                placeholder={labels.lastName}
            /> 

            <TextInput
                style={styles.input}
                onChangeText={(value) => setEmail(value)}
                value={email}
                placeholder={labels.email}
            /> 

            <View style={{height: 300}}>
              {/* <WebView
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
              /> */}
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

export default updateProfile
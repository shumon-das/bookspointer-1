import { useAuthStore } from '@/app/store/auth';
import { labels } from '@/app/utils/labels';
import { resetUserPassword } from '@/services/userApi';
import { styles } from '@/styles/writeBook.styles';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Stack, useNavigation, useRouter } from 'expo-router';
import React, { useLayoutEffect, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Snackbar } from 'react-native-paper';

const resetPassword = () => {
    const router = useRouter()
    const navigation = useNavigation()
    const token = useAuthStore((state) => state.token)
    
    const [toastVisible, setToastVisible] = useState(false)
    const [oldPassword, setOldPassword] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordError, setPasswordError] = useState(false)

    const handleUpdate = async () => {
        if (password !== confirmPassword) {
            setPasswordError(true)
            return
        }
        setPasswordError(false)
        const response = await resetUserPassword(token as string, password)
        setToastVisible(true)
        if (response) {
          setTimeout(() => {
            router.replace('/(tabs)/profile')
          }, 2000);
        } else {
            alert("Invalid email or password")
        }
    }

    useLayoutEffect(() => {
      const title = labels.resetPassword.header
      navigation.setOptions({ title }), [title]
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity onPress={() => console.log('Settings')}>
            <FontAwesome name="gear" size={20} style={{paddingHorizontal: 15}} />
          </TouchableOpacity>
        ),
      })
    })
    
  return (
    <KeyboardAvoidingView
       style={styles.container}
       behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
         keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 60}
     >
      <ScrollView style={{flex: 1}}  keyboardShouldPersistTaps="handled">
        <Stack.Screen
        options={{
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.replace('/(tabs)/profile')}>
              <FontAwesome name="arrow-left" size={20} style={{ marginLeft: 10, marginRight: 20, color: '#4B5945' }} />
            </TouchableOpacity>
          ),
        }}
        />

        <View>
            <Image
                source={require('../../../assets/images/logo.png')}
                style={{ width: 100, height: 100, borderRadius: 50, alignSelf: 'center', marginTop: 20 }}
            />
            <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginTop: 10, marginBottom: 30 }}>
                {labels.resetPassword.heading}
            </Text>
        </View>
        
        <View style={{ width: '90%', marginHorizontal: 'auto' }}>
            <TextInput
                style={styles.input}
                onChangeText={(value) => setOldPassword(value)}
                value={oldPassword}
                placeholder={labels.resetPassword.currentPassword}
                secureTextEntry={true}
            />
            <TextInput
                style={styles.input}
                onChangeText={(value) => setPassword(value)}
                value={password}
                placeholder={labels.resetPassword.newPassword}
                secureTextEntry={true}
            />
            <TextInput
                style={styles.input}
                onChangeText={(value) => {
                    password !== value ? setPasswordError(true) : setPasswordError(false)
                    setConfirmPassword(value)
                }}
                value={confirmPassword}
                placeholder={labels.resetPassword.confirmPassword}
                secureTextEntry={true}
            />
            {passwordError ? <Text style={{color: 'red', fontSize: 12, textAlign: 'center'}}>{labels.passswordConfirmNotMatch}</Text> : ''}

            <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                <Text style={styles.buttonText}>{labels.resetPassword.submit}</Text>
            </TouchableOpacity>
        </View>
        <Snackbar visible={toastVisible} onDismiss={() => setToastVisible(false)} duration={2000}>
          {labels.resetPassword.success}
        </Snackbar>
      </ScrollView>  
    </KeyboardAvoidingView>
  )
}

export default resetPassword
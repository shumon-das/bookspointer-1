import { labels } from '@/app/utils/labels'
import { User } from '@/components/types/User'
import { login } from '@/services/api'
import { saveNewUser } from '@/services/savesApi'
import { styles } from '@/styles/writeBook.styles'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Stack, useNavigation, useRouter } from 'expo-router'
import React, { useLayoutEffect, useState } from 'react'
import { Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { Snackbar } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'

const registration = () => {
    const navigation = useNavigation()
    const title = labels.register
    useLayoutEffect(() => navigation.setOptions({ title }), [navigation, title]);
    const router = useRouter()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [emailError, setEmailError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const [toastVisible, setToastVisible] = useState(false)
    const [saveMessage, setSaveMessage] = useState('')

    
    const handleRegister = async () => {
        const date = new Date();
        let initialUserState = {
            firstName: labels.user.register.firstName,
            lastName: labels.user.register.lastName,
            email: '',
            roles: ['ROLE_USER'],
            phone: '',
            password: '',
            confirmPassword: '',
            isActive: true,
            isDeleted: false,
            series: ['বইসমূহ']
        } as any

        if (isValidEmail(email)) {
            if (password === confirmPassword) {
                initialUserState.email = email
                initialUserState.password = password
                initialUserState.confirmPassword = confirmPassword

                const response = await saveNewUser(initialUserState)
                setToastVisible(true)
                setSaveMessage(response.message)
                if (response.message) {
                    const response: {token: string; user: User} = await login(email, password)
                    if (response) {
                        AsyncStorage.setItem("auth-user", JSON.stringify(response.user))
                        AsyncStorage.setItem("auth-token", response.token)
                    
                        router.push('/')
                    } else {
                        alert("Invalid email or password")
                    }
                }
            } else {
                setPasswordError(true)
            }
        } else {
            setEmailError(true)
            console.log('invalid email')
        }
        console.log(email, isValidEmail(email), password, confirmPassword, password === confirmPassword)
    }

    const isValidEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
      };
      

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
                <TouchableOpacity onPress={() => router.replace('/')}>
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
                    {labels.welcomeMessage}
                </Text>
            </View>
            <View style={{ width: '90%', marginHorizontal: 'auto' }}>
                <TextInput
                    style={styles.input}
                    onChangeText={(value: string) => {
                        if (isValidEmail(value)) {
                            setEmailError(false)
                        }
                        setEmail(value)
                    }}
                    value={email}
                    placeholder="email"
                    placeholderTextColor="#999"
                />
                {emailError ? <Text style={{color: 'red', fontSize: 12, textAlign: 'center'}}>{labels.invalidEmail}</Text> : ''}
                <TextInput
                    style={styles.input}
                    onChangeText={(value) => setPassword(value)}
                    value={password}
                    placeholder="password"
                    placeholderTextColor="#999"
                    secureTextEntry={true}
                />
                <TextInput
                    style={styles.input}
                    onChangeText={(value) => {
                        password !== value ? setPasswordError(true) : setPasswordError(false)
                        setConfirmPassword(value)
                    }}
                    value={confirmPassword}
                    placeholder="confirm password"
                    placeholderTextColor="#999"
                    secureTextEntry={true}
                />
                {passwordError ? <Text style={{color: 'red', fontSize: 12, textAlign: 'center'}}>{labels.passswordConfirmNotMatch}</Text> : ''}
    
                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                    <Text style={styles.buttonText}>{labels.register}</Text>
                </TouchableOpacity>
            </View>
            <Snackbar visible={toastVisible} onDismiss={() => setToastVisible(false)} duration={2000}>
                {saveMessage}
            </Snackbar>
        </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default registration
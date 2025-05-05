import { View, Text, TouchableOpacity, Image, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { Stack, useNavigation, useRouter } from 'expo-router'
import Icon from 'react-native-vector-icons/FontAwesome'
import { styles } from '@/styles/writeBook.styles'
import { labels } from '../utils/labels'
import { saveNewUser } from '@/services/savesApi'
import { Snackbar } from 'react-native-paper'
import { login } from '@/services/api'
import { useAuthStore } from '../store/auth'

const registration = () => {
    const navigation = useNavigation()
    const title = labels.register
    useLayoutEffect(() => navigation.setOptions({ title }), [navigation, title]);
    const router = useRouter()
    const setUser = useAuthStore((state) => state.setUser)
    const setToken = useAuthStore((state) => state.setToken)

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
            firstName: 'your',
            lastName: 'name-' + date.getTime(),
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
                        setToken(response.token)
                        setUser(response.user)
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
                  <Icon name="arrow-left" size={20} style={{ marginLeft: 10, marginRight: 20, color: '#4B5945' }} />
                </TouchableOpacity>
              ),
            }}
          />
            <View>
                <Image
                    source={require('../../assets/images/logo.png')}
                    style={{ width: 100, height: 100, borderRadius: 50, alignSelf: 'center', marginTop: 20 }}
                />
                <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginTop: 10, marginBottom: 30 }}>
                    Welcome to the books world
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
                />
                {emailError ? <Text style={{color: 'red', fontSize: 12, textAlign: 'center'}}>{labels.invalidEmail}</Text> : ''}
                <TextInput
                    style={styles.input}
                    onChangeText={(value) => setPassword(value)}
                    value={password}
                    placeholder="password"
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
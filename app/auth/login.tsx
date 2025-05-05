import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState, useLayoutEffect } from 'react'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { useAuthStore } from '@/app/store/auth'
import { login } from '@/services/api'
import { useRouter, useNavigation, Stack } from 'expo-router'
import Icon from 'react-native-vector-icons/FontAwesome'
import { styles } from '@/styles/writeBook.styles'
import { labels } from '../utils/labels'

const Login = () => {
    const router = useRouter()
    const navigation = useNavigation()
    const title = "Login"
    useLayoutEffect(() => navigation.setOptions({ title }), [navigation, title]);
      

    const setUser = useAuthStore((state) => state.setUser)
    const setToken = useAuthStore((state) => state.setToken)

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const onChangeEmail = (event: any) => setEmail(event)
    const onChangePassword = (event: any) => setPassword(event)

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            alert("Please fill in all fields")
            return
        }
        const response: {token: string; user: User} = await login(email.trim(), password.trim())
        if (response) {
            setToken(response.token)
            setUser(response.user)
            router.push('/')
        } else {
            alert("Invalid email or password")
        }
    }
  return (
    <SafeAreaProvider>
      <SafeAreaView>
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
                onChangeText={onChangeEmail}
                value={email}
                placeholder="email"
            />
            <TextInput
                style={styles.input}
                onChangeText={onChangePassword}
                value={password}
                placeholder="password"
                secureTextEntry={true}
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 10}}>
              <Text style={{paddingHorizontal: 5}}>{labels.noAccount}</Text>
              <TouchableOpacity onPress={() => router.push('/auth/registration')}>
                <Text style={{color: 'blue'}}>{labels.register}</Text>
              </TouchableOpacity>
            </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default Login

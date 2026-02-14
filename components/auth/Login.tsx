import { View, Text, ScrollView, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import GoogleLogin from '../GoogleLogin'
import { styles } from '@/styles/writeBook.styles'
import { labels } from '@/app/utils/labels'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useUserStore } from '@/app/store/userStore'
import { useRouter } from 'expo-router'
import { AuthUser } from '../types/User'
import { insertAuthUser } from '@/app/utils/database/insertAllUsers'
import { login } from '@/services/api'

const Login = ({onLoginSuccess}: {onLoginSuccess: () => void}) => {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const onChangeEmail = (event: any) => setEmail(event)
    const onChangePassword = (event: any) => setPassword(event)

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            alert("Please fill in all fields")
            return
        }
        setLoading(true)
        try {
          const response: { token: string; user: AuthUser } =
            await login(email.trim(), password.trim())

          if (!response) {
            alert("Invalid login")
            return
          }
          await AsyncStorage.setItem("auth-token", response.token)
          await AsyncStorage.setItem("auth-user", JSON.stringify(response.user))
          await insertAuthUser(response.user)

          useUserStore.getState().setAuthUser(response.user)
          useUserStore.getState().setAuthToken(response.token)
          onLoginSuccess()
        } catch (error) {
          console.error(error)
          alert("Login failed. Please try again.")
          setLoading(false)
        } finally {
          setLoading(false)
        }
    }
    
  return (
    <ScrollView>
        <View>
            <Image
                source={require('@/assets/images/logo.png')}
                style={{ width: 100, height: 100, borderRadius: 50, alignSelf: 'center', marginTop: 20 }}
            />
            <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 }}>
                {labels.welcomeMessage}
            </Text>
        </View>
        <View style={{ width: '90%', marginHorizontal: 'auto' }}>
            <TextInput
                style={styles.input}
                onChangeText={onChangeEmail}
                value={email}
                placeholder="email"
                placeholderTextColor="#999"
            />
            <TextInput
                style={styles.input}
                onChangeText={onChangePassword}
                value={password}
                placeholder="password"
                placeholderTextColor="#999"
                secureTextEntry={true}
            />

            <TouchableOpacity style={[styles.button, {flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}]} onPress={handleLogin} disabled={loading}>
            {loading && <ActivityIndicator color="#fff" />}
            <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 10}}>
            <Text style={{paddingHorizontal: 5}}>{labels.noAccount}</Text>
            <TouchableOpacity onPress={() => router.push('/auth/registration')}>
                <Text style={{color: 'blue'}}>{labels.register}</Text>
            </TouchableOpacity>
            </View>
        </View>

        <View>
            <GoogleLogin />
        </View>
    </ScrollView>
  )
}

export default Login
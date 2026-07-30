import { View, Text, ScrollView, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import GoogleLogin from '../GoogleLogin'
import { authStyles } from '@/styles/auth.styles'
import { labels } from '@/app/utils/labels'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useUserStore } from '@/app/store/userStore'
import { useRouter } from 'expo-router'
import { AuthUser } from '../types/User'
import { insertAuthUser } from '@/app/utils/database/insertAllUsers'
import { login } from '@/services/api'
import { saveToken } from '@/services/notificationApi'
import messaging from '@react-native-firebase/messaging';

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

          const token = await messaging().getToken();
          await saveToken(token, response.user.id); 
          
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
    <ScrollView contentContainerStyle={authStyles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={authStyles.header}>
            <Image
                source={require('@/assets/images/logo.png')}
                style={authStyles.logo}
            />
            <Text style={authStyles.title}>
                {labels.welcomeMessage}
            </Text>
        </View>
        <View style={authStyles.form}>
            <TextInput
                style={authStyles.input}
                onChangeText={onChangeEmail}
                value={email}
                placeholder="email"
                placeholderTextColor="#999"
            />
            <TextInput
                style={authStyles.input}
                onChangeText={onChangePassword}
                value={password}
                placeholder="password"
                placeholderTextColor="#999"
                secureTextEntry={true}
            />

            <TouchableOpacity style={[authStyles.button, loading && authStyles.buttonDisabled]} onPress={handleLogin} disabled={loading}>
            {loading && <ActivityIndicator color="#fff" />}
            <Text style={authStyles.buttonText}>Login</Text>
            </TouchableOpacity>

            <View style={authStyles.accountPrompt}>
            <Text style={authStyles.accountPromptText}>{labels.noAccount}</Text>
            <TouchableOpacity onPress={() => router.push('/auth/registration')}>
                <Text style={authStyles.accountLink}>{labels.register}</Text>
            </TouchableOpacity>
            </View>
        </View>

        <View style={authStyles.googleContainer}>
            <GoogleLogin />
        </View>
    </ScrollView>
  )
}

export default Login

import { login } from '@/services/api'
import { Stack, useNavigation, useRouter } from 'expo-router'
import React, { useLayoutEffect, useState } from 'react'
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { labels } from '@/app/utils/labels'
import { User } from '@/components/types/User'
import { styles } from '@/styles/writeBook.styles'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useAuthStore } from '@/app/store/auth'
import GoogleLogin from '@/components/GoogleLogin'

const Login = () => {
    const router = useRouter()
    const navigation = useNavigation()
    const title = "Login"
    useLayoutEffect(() => navigation.setOptions({ title }), [navigation, title]);

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
          await AsyncStorage.setItem("auth-token", response.token)
          await AsyncStorage.setItem("auth-user", JSON.stringify(response.user))

          useAuthStore.getState().setAuthenticatedUser(response.user)
          useAuthStore.getState().setToken(response.token)
          router.push('/')
        } else {
            alert(labels.invalidLogin)
        }
    }
  return (
    <SafeAreaProvider>
      <SafeAreaView>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.replace('/')}>
              <FontAwesome name="arrow-left" size={20} style={{paddingHorizontal: 15}} />
            </TouchableOpacity>
          ),
        }}
      />
        <ScrollView>
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

          <View>
            <GoogleLogin />
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default Login

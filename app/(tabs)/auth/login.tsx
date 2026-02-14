import { Stack, useNavigation, useRouter } from 'expo-router'
import React, { useLayoutEffect } from 'react'
import { TouchableOpacity } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import Login from '@/components/auth/Login'

const AppLogin = () => {
    const router = useRouter()
    const navigation = useNavigation()
    const title = "Login"
    useLayoutEffect(() => navigation.setOptions({ title }), [navigation, title]);

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
        <Login onLoginSuccess={() => router.replace('/')} />
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default AppLogin

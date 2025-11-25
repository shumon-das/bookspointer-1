import { useEffect, useLayoutEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useHeaderOptions(
  navigation: any,
  title: string,
  options?: {
    onBack?: () => void;
    onRightPress?: () => void;
    showRightIcon?: boolean;
  }
) {
  useLayoutEffect(() => {
    navigation.setOptions({
      title,
      headerTitleAlign: 'center',
      headerLeft: () => (
        <TouchableOpacity onPress={options?.onBack || (() => router.back())}>
          <FontAwesome5 name="arrow-left" size={18} color="black" />
        </TouchableOpacity>
      ),
      headerRight: () =>
        options?.showRightIcon ? (
          <TouchableOpacity onPress={options?.onRightPress}>
            <FontAwesome5 name="cog" size={18} color="black" />
          </TouchableOpacity>
        ) : null,
    });
  }, [navigation, title, options]);
}

export function useUseEffect(value: any) {
  const [loggedInUser, setLoggedInUser] = useState<any>(null);
  
  useEffect(() => {
    const loadLoggedInUser = async () => {
       try {
        const storedUser = await AsyncStorage.getItem('auth-user');
        setLoggedInUser(storedUser ? JSON.parse(storedUser) : null);
       } catch (error) {
         console.warn('Failed to load logged-in user:', error);
       }
    }

    loadLoggedInUser()
  }, [value]);

  return loggedInUser;
}

export function useEffectForBook(uuid?: any) {
  if (!uuid) return;
  
  const [book, setBook] = useState<any>(null);
  
  useEffect(() => {
    const loadSingleFullBook = async () => {
        const response = await fetch('https://api.bookspointer.com/book', {
            method: "POST",
            body: JSON.stringify({ uuid: uuid }),
        });
        const data = await response.json();
        setBook(data)
    }

    loadSingleFullBook()
  }, [uuid]);

  return book;
}

export default { useHeaderOptions, useUseEffect, useEffectForBook }
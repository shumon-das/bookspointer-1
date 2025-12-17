import { router, useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { BackHandler, SafeAreaView, View } from 'react-native';
import UserProfileHeader from '@/components/micro/user/profile/UserProfileHeader';
import { ActivityIndicator } from 'react-native-paper';
import { useAuthStore } from '@/app/store/auth';
import UserProfileTabView from '@/components/micro/user/profile/UserProfileTabView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserSeries from '@/components/micro/user/UserSeries';

const userProfile = () => {
  const { user: author, authenticatedUser } = useAuthStore();
  const [user, setUser] = useState(authenticatedUser as any)

  useEffect(() => {
      const loadLoggedInUser = async () => {
        const storedUser = await AsyncStorage.getItem('auth-user');
        setUser(storedUser ? JSON.parse(storedUser) : null);
    }

    loadLoggedInUser()
  },[author])
        
  const navigation = useNavigation()
  useEffect(() => navigation.setOptions({ headerShown: false }), []);
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      router.replace('/');
      return true
    });
    return () => backHandler.remove();
  }, [])

  if (!author) {
    return (<View><ActivityIndicator size="small" color="#0000ff" /></View>)
  }

  const onSelectSeries = (seriesName: string) => {
    router.push({
      pathname: "/screens/user/userProfilePageBooks", 
      params: { series: seriesName, backurl: JSON.stringify({pathname: "/screens/user/userProfile"})}
    })
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <UserProfileHeader author={author} />  
      {user && author && user.id === author.id 
        ? (<UserProfileTabView onSelectSeries={onSelectSeries} />)
        : <UserSeries series={author.series} author={author} onChooseSeries={(seriesName: string) => onSelectSeries(seriesName)} />
      }
    </SafeAreaView>
  )
}

export default userProfile
import { router, useNavigation } from 'expo-router';
import React, { useEffect } from 'react';
import { BackHandler, SafeAreaView, View } from 'react-native';
import UserProfileHeader from '@/components/micro/user/profile/UserProfileHeader';
import { ActivityIndicator } from 'react-native-paper';
import { useAuthStore } from '@/app/store/auth';
import UserProfileTabView from '@/components/micro/user/profile/UserProfileTabView';

const userProfile = () => {
  const { user: author, authenticatedUser } = useAuthStore();
        
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
      <UserProfileTabView onSelectSeries={onSelectSeries} />
    </SafeAreaView>
  )
}

export default userProfile
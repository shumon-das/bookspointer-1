import { router, useNavigation } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import { SafeAreaView, TouchableOpacity, View } from 'react-native';
import UserProfileHeader from '@/components/micro/user/profile/UserProfileHeader';
import UserSeries from '@/components/micro/user/UserSeries';
import { ActivityIndicator } from 'react-native-paper';
import { labels } from '../../utils/labels';
import useAuthStore from '@/app/store/auth';
import Feather from '@expo/vector-icons/Feather';
const authorProfile = () => {
  const { user: author } = useAuthStore();

  const navigation = useNavigation()
  useLayoutEffect(() => {
    if (author) {
      const title = author ? author.fullName : labels.author;
      navigation.setOptions({
        title,
        headerTitleAlign: 'center',
        headerStyle: {
            height: 100,
            backgroundColor: '#085a80',
        },
        headerTintColor: '#d4d4d4',
        headerTitleStyle: {
            fontWeight: 'bold',
        },
        headerRight: () => (<TouchableOpacity onPress={() => {
          router.push({pathname: "/screens/user/profileUpdate", params: { }})
        }}><Feather name="settings" size={18} color="#d4d4d4" /></TouchableOpacity>),
      }), [navigation, title]
    }
  }, [navigation, author]);

  if (!author) {
    return (<View>
      <ActivityIndicator size="small" color="#0000ff" />
    </View>)
  }

  const onSelectSeries = (seriesName: string) => {
    router.push({pathname: "/screens/user/userProfilePageBooks", params: { series: seriesName }})
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <UserProfileHeader />         

      <UserSeries series={author.series} author={author} onChooseSeries={(seriesName) => onSelectSeries(seriesName)} />
    </SafeAreaView>
  )
}

export default authorProfile
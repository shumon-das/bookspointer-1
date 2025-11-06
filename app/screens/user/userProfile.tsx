import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useCallback, useLayoutEffect, useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import { UserInterface } from '../../../types/interfeces';
// import UserDescription from '@/components/micro/user/UserDescription';
import UserProfileHeader from '@/components/micro/user/profile/UserProfileHeader';
import UserSeries from '@/components/micro/user/UserSeries';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native-paper';
import { labels } from '../../utils/labels';

const authorProfile = () => {
  const {useruuid} = useLocalSearchParams();
  const [author, setAuthor] = useState<UserInterface|null>(null);

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
        headerRight: () => (<></>),
      }), [navigation, title]
    }
  }, [navigation, author]);

  useFocusEffect(
    useCallback(() => {
      const loadUserAndToken = async () => {
          const storedUser = await AsyncStorage.getItem('auth-user');
          // const storedToken = await AsyncStorage.getItem('token');
          setAuthor(storedUser ? JSON.parse(storedUser) : null);
      };
      loadUserAndToken();
    }, [useruuid])
  );

  useLayoutEffect(() => {

  }, [author]);

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
      <UserProfileHeader uuid={author.uuid} />         

      <UserSeries series={author.series} onChooseSeries={(seriesName) => onSelectSeries(seriesName)} />
    </SafeAreaView>
  )
}

export default authorProfile
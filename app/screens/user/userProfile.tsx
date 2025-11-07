import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { use, useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { SafeAreaView, Touchable, TouchableOpacity, View } from 'react-native';
import { UserInterface } from '../../../types/interfeces';
// import UserDescription from '@/components/micro/user/UserDescription';
import UserProfileHeader from '@/components/micro/user/profile/UserProfileHeader';
import UserSeries from '@/components/micro/user/UserSeries';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native-paper';
import { labels } from '../../utils/labels';
import HeaderRightPopover from '@/components/micro/user/profile/HeaderRightPopover';
import { fetchUserProfileData } from '@/services/profileApi';
import useAuthStore from '@/app/store/auth';
import Feather from '@expo/vector-icons/Feather';
const authorProfile = () => {
  const {useruuid} = useLocalSearchParams();
  const [author, setAuthor] = useState<UserInterface|null>(null);
  const [loggedInUser, setLoggedInUser] = React.useState<UserInterface|null>(null);

  const navigation = useNavigation()
  useLayoutEffect(() => {
    if (author) {
      // const settings = !useruuid || loggedInUser && useruuid && loggedInUser.uuid === useruuid 
      //   ? <HeaderRightPopover user={author} /> 
      //   : <></>
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

  useFocusEffect(
    useCallback(() => {
      const loadUserAndToken = async () => {
          const storedUser = await AsyncStorage.getItem('auth-user');
          const user = storedUser ? JSON.parse(storedUser) : null

          if (!useruuid && user) {
            setLoggedInUser(user);
            return;
          }
          if (useruuid && user && user.uuid === useruuid) {
            setLoggedInUser(user);
            setAuthor(user);
            return;
          }
          if (!useruuid && !user) {
            setLoggedInUser(null);
          }
      };
      loadUserAndToken();
    }, [useruuid])
  );

  useEffect(() => {
    if (!useruuid && loggedInUser) {
      setAuthor(loggedInUser);
      return;
    }

    if (useruuid && author && author.uuid === useruuid) {
      return;
    }

    const getNewUserDataFromDb = async () => {
      const data = await fetchUserProfileData(useruuid as string);
      setAuthor(data);
      useAuthStore.getState().setUser(data);
    }
    
    getNewUserDataFromDb();
  }, [useruuid, author, loggedInUser]);

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

      <UserSeries series={author.series} onChooseSeries={(seriesName) => onSelectSeries(seriesName)} />
    </SafeAreaView>
  )
}

export default authorProfile
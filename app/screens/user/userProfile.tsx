import { router, useFocusEffect, useNavigation } from 'expo-router';
import React, { useCallback, useLayoutEffect, useState } from 'react';
import { SafeAreaView, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import UserProfileHeader from '@/components/micro/user/profile/UserProfileHeader';
import UserSeries from '@/components/micro/user/UserSeries';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import { labels } from '../../utils/labels';
import { useAuthStore } from '@/app/store/auth';
import Feather from '@expo/vector-icons/Feather';
import { TabView } from 'react-native-tab-view';
import UserLibrary from '@/components/micro/user/UserLibrary';
import AsyncStorage from '@react-native-async-storage/async-storage';

const userProfile = () => {
  const { user: author, authenticatedUser } = useAuthStore();
  const [loggedInUser, setLoggedInUser] = useState(authenticatedUser)

  const UserProfileHeaderRight = () => (
      <TouchableOpacity
        onPress={() => {
          router.push({
            pathname: "/screens/user/profileUpdate",
            params: {}
          });
        }}
      >
        <Feather name="settings" size={18} color="#d4d4d4" />
      </TouchableOpacity>
    );

  useFocusEffect(useCallback(() => {
    const loadLoggedInUser = async () => {
      if (authenticatedUser) {
        setLoggedInUser(authenticatedUser)
      } else {
        const storageUser = await AsyncStorage.getItem('auth-user')
        setLoggedInUser(storageUser ? JSON.parse(storageUser) : null)
      }
    }
    loadLoggedInUser()
  }, [authenticatedUser]))

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
        headerRight: UserProfileHeaderRight,
      })
    }
  }, [navigation, author, UserProfileHeaderRight]);

  if (!author) {
    return (<View><ActivityIndicator size="small" color="#0000ff" /></View>)
  }

  const onSelectSeries = (seriesName: string) => {
    router.push({pathname: "/screens/user/userProfilePageBooks", params: { series: seriesName }})
  }

  // const layout = useWindowDimensions();
  const theme = useTheme();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
      { key: 'series', title: labels.books },
      { key: 'library', title: labels.userBookTypes.library },
  ]);

  const renderScene = ({ route }: any) => {
      switch (route.key) {
        case 'library':
            return <UserLibrary authorId={author.id} />;
          default:
              return <UserSeries series={author.series} author={author} onChooseSeries={(seriesName) => onSelectSeries(seriesName)} />;
      }
  };
  
  return (
    <SafeAreaView style={{flex: 1}}>
      <UserProfileHeader />  

      {authenticatedUser && author && authenticatedUser.id === author.id && <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={(index: number) => setIndex(index)}
          // initialLayout={{ width: layout.width }}
          lazy
          style={{ backgroundColor: theme.colors.background }}
          swipeEnabled={false}
      />}

      {(!authenticatedUser || !author || authenticatedUser.id !== author.id) && (
        <UserSeries
          series={author?.series}
          author={author}
          onChooseSeries={(seriesName) => onSelectSeries(seriesName)}
        />
      )} 

    </SafeAreaView>
  )
}

export default userProfile
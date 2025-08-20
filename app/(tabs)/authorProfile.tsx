import { View, Text, SafeAreaView, Image, ScrollView } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { User } from '../../components/types/User'
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { getAuthor, updateProfileImage } from '@/services/userApi';
import { styles } from '@/styles/profile.styles';
import ImagePicker from '@/components/micro/ImagePicker';
import FontAwesome from '@expo/vector-icons/FontAwesome';
// import UserDescription from '@/components/micro/user/UserDescription';
import UserSeries from '@/components/micro/user/UserSeries';
import { labels } from '../utils/labels';
import UserProfileBooks from '@/components/micro/user/UserProfileBooks';
import { ActivityIndicator } from 'react-native-paper';
import { englishNumberToBengali } from '../utils/englishNumberToBengali';

const authorProfile = () => {
  const {authorUuid} = useLocalSearchParams();
  const [author, setAuthor] = useState<User|null>(null);
  const [token, setToken] = useState<string|null>(null);
  const [choosedSeries, setChoosedSeries] = useState<string|null>(null);

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

  const getAuthorFromDb = async (uuid: string) => {
    const data = await getAuthor(uuid) as unknown as User;
    setAuthor(data);
  }

  useEffect(() => {
    setChoosedSeries(null);
    getAuthorFromDb(authorUuid as string);
  }, [authorUuid]);

  useLayoutEffect(() => {

  }, [author]);

  if (!author) {
    return (<View>
      <ActivityIndicator size="small" color="#0000ff" />
    </View>)
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.cover}>
        <Image source={require('../../assets/images/profile_cover.jpg')} style={styles.coverImg} />
        <View style={styles.userInfo}>
          <ImagePicker defaultImage={author ? author.image : 'default_post_image.jpg'} onChange={(value) => {
            if (!author || !token) return
            updateProfileImage(value, token, author.id)
          }} />
        </View>
      </View>

      <ScrollView style={{ backgroundColor: 'white' }}>
         <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
          <View style={{width: '60%', marginLeft: 6}}>
            <Text style={styles.userName}>{author?.fullName}</Text>
            <Text style={styles.userRole}>@{labels.userRoleAuthor}</Text>
          </View>
          <View style={{ width: '15%', alignItems: 'center' }}>
            <Text>{englishNumberToBengali(author ? author.totalBooks : 0)}</Text>
            <Image source={ require('../../assets/images/books_logo.png')} style={styles.booksLogo} />
          </View>
          <View style={{ width: '15%', alignItems: 'center' }}>
            <Text>{ englishNumberToBengali(0)}</Text>
            <FontAwesome name="download" size={20} color={'blue'} />
          </View>
        </View>

        {
          !choosedSeries 
            ? <UserSeries series={author.series} onChooseSeries={(seriesName) => setChoosedSeries(seriesName)} />
            : <UserProfileBooks series={choosedSeries} authorId={author.id} onBackToSeries={() => setChoosedSeries(null)} />
        }
      
      </ScrollView>
    </SafeAreaView>
  )
}

export default authorProfile
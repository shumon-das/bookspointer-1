import ImagePicker from '@/components/micro/ImagePicker';
import { getAuthor, updateProfileImage } from '@/services/userApi';
import { styles } from '@/styles/profile.styles';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { User } from '../../components/types/User';
// import UserDescription from '@/components/micro/user/UserDescription';
import UserProfileBooks from '@/components/micro/user/UserProfileBooks';
import UserSeries from '@/components/micro/user/UserSeries';
import { ActivityIndicator } from 'react-native-paper';
import { englishNumberToBengali } from '../utils/englishNumberToBengali';
import { labels } from '../utils/labels';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const authorProfile = () => {
  const {authorUuid} = useLocalSearchParams();
  const [author, setAuthor] = useState<User|null>(null);
  const [token, setToken] = useState<string|null>(null);
  const [choosedSeries, setChoosedSeries] = useState<string|null>(null);

  const router = useRouter();
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
            updateProfileImage(value, author.id)
          }} />
        </View>
      </View>

      <ScrollView style={{ backgroundColor: 'white' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginHorizontal: 5 }}>
          <View style={{width: '50%', marginLeft: 6}}>
            <Text style={styles.userName}>{author?.fullName}</Text>
            <Text style={styles.userRole}>@{labels.userRoleAuthor}</Text>
          </View>
          <TouchableOpacity  style={{ width: '10%', alignItems: 'center' }} onPress={() => router.push({pathname: '/(tabs)/search', params: {authorId: author?.id, fullName: author?.fullName}})}>
              <FontAwesome name="search" style={{}} size={20} color="black" />
          </TouchableOpacity>
          <View style={{ width: '20%', alignItems: 'center' }}>
              <Text>{ englishNumberToBengali(author ? author.totalReads : 0)}</Text>
              <Text style={{fontSize: 12}}>{labels.reads}</Text>
          </View>
          <View style={{ width: '20%', alignItems: 'center' }}>
              <Text>{ englishNumberToBengali(author ? author.totalReads : 0)}</Text>
              <Text style={{fontSize: 12}}>{labels.reads}</Text>
          </View>
          <View style={{ width: '15%', alignItems: 'center' }}>
            <Text>{englishNumberToBengali(author ? author.totalBooks : 0)}</Text>
            <Text style={{fontSize: 12}}>{labels.books}</Text>
          </View>
        </View>

        {
          !choosedSeries 
            ? <UserSeries series={author.series} author={author} onChooseSeries={(seriesName) => setChoosedSeries(seriesName)} />
            : <UserProfileBooks series={choosedSeries} authorId={author.id} onBackToSeries={() => setChoosedSeries(null)} />
        }
      
      </ScrollView>
    </SafeAreaView>
  )
}

export default authorProfile
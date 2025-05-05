import { useAuthStore } from '@/app/store/auth';
import { useUserStore } from '@/app/store/user';
import ProfileBookCard from '@/components/ProfileBookCard';
import UserBooksTabs from '@/components/UserBooksTabs';
import ImagePicker from '@/components/micro/ImagePicker';
import UserDescription from '@/components/micro/user/UserDescription';
import { User } from '@/components/types/User';
import { updateProfileImage } from '@/services/userApi';
import { styles } from '@/styles/profile.styles';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ActivityIndicator, BackHandler, Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Popover from 'react-native-popover-view';
import { labels } from '../utils/labels';
import { userRole } from '../utils/userRole';

const profile = () => {
  const {authorId} = useLocalSearchParams();
  const author = authorId ? useUserStore((state) => state.authors).find((a) => a.id === parseInt(authorId as string)) as User : null
  const router = useRouter()
  const user = author ? author : useAuthStore((state) => state.user)
  const token = useAuthStore((state) => state.token)
  if (!user || !token) {
    router.push('/')
    return
  }

  const logout = useAuthStore((state) => state.logout)
  const setSelectCategories = useUserStore((state) => state.setSelectCategories);
  const selectCategories = useUserStore((state) => state.selectCategories);
  const [role, setRole] = useState(userRole(user ? user.roles : []))
  const [loading, setLoading] = useState(false)
  const [showPopover, setShowPopover] = useState(false)
  const navigation = useNavigation()
  const headerMoreIcon = useRef<any>(null)

  useLayoutEffect(() => {
    const title = user ? user.fullName : "Profile"
    navigation.setOptions({ title }), [navigation, title]
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => setShowPopover(true)}>
          <FontAwesome name="gear" size={20} style={{paddingHorizontal: 15}} />
        </TouchableOpacity>
      ),
    })
  })

  useEffect(() => {
    if (!user && !authorId) {
      router.push('/auth/login')
    }

    setSelectCategories([])
    const deviceBackButtonAction = () => {
      // @todo have to compolete from profile back
      return true
    }

    const backHandler = BackHandler.addEventListener('hardwareBackPress', deviceBackButtonAction);

    return () => backHandler.remove();
    
  }, [user])

  return (
    <SafeAreaView style={{flex: 1}}>
      <View>
        <View
          ref={headerMoreIcon}
          style={{ position: 'absolute', top: 0, right: 0, width: 1, height: 1 }}
        />
        <Popover
          isVisible={showPopover}
          from={headerMoreIcon}
          onRequestClose={() => setShowPopover(false)}
        >
          <Text style={{ width: 160,paddingVertical: 10, paddingLeft: 10, paddingRight: 25 }}
            onPress={() => alert('')}
          > 
            <FontAwesome name="lock" size={18} />
            {labels.resetPassword}
          </Text>
          <Text style={{ width: 160,paddingVertical: 10, paddingLeft: 10, paddingRight: 25 }}
            onPress={() => alert('should update the publish status')}
          > 
            <FontAwesome name="user" size={18} />
            {labels.editProfile}
          </Text>
          <Text style={{ width: 160,paddingVertical: 10, paddingLeft: 10, paddingRight: 25 }}
            onPress={() => {
              logout()
              router.push('/')
            }}
          > 
            <FontAwesome name="sign-out" size={18} style={{marginRight: 10}} />
            <Text style={{marginLeft: 10, paddingLeft: 10}}>{labels.signOut}</Text>
          </Text>
        </Popover>
      </View>

      <View style={styles.cover}>
        <Image source={require('../../assets/images/profile_cover.jpg')} style={styles.coverImg} />
        <View style={styles.userInfo}>
          <ImagePicker defaultImage={user ? user.image : 'default_post_image.jpg'} onChange={(value) => {
            if (!user) return
            updateProfileImage(value, token, user.id)
          }} />
        </View>
      </View>

      <ScrollView>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
          <View style={{width: '60%', marginLeft: 14}}>
            <Text style={styles.userName}>{user?.fullName}</Text>
            <Text style={styles.userRole}>{role}</Text>
          </View>
          <View style={{ width: '15%', alignItems: 'center' }}>
            <Text>{(user && user.books && user?.books.length) ?? 0}</Text>
            <Image source={ require('../../assets/images/books_logo.png')} style={styles.booksLogo} />
          </View>
          <View style={{ width: '15%', alignItems: 'center' }}>
            <Text>0</Text>
            <FontAwesome name="thumbs-up" size={20} color="gray" />
          </View>
        </View>
      
        <UserDescription description={user?.details.description ?? '-'} />

        {Object.keys(selectCategories).length > 0 
          ? (<View style={styles.profileBookCard} key={5}>
              {Object.keys(selectCategories).map((key: any) => <ProfileBookCard {...selectCategories[key]} key={key} />)}
            </View>)
          : (loading ? <ActivityIndicator size="large" color="#0000ff" className="mt-10 self-center" /> 
                     : <UserBooksTabs authorId={user ? user.id : 0} isCreator={authorId ? 0 : 1} />) 
        }
      </ScrollView>
    </SafeAreaView>
  )
}

export default profile

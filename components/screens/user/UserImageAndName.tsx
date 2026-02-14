import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AuthUser, User } from '@/components/types/User'
import { styles } from '@/styles/author.styles'
import labels from '@/app/utils/labels'
import { useUserStore } from '@/app/store/userStore'
import AntDesign from '@expo/vector-icons/AntDesign';
import * as ImagePicker from 'expo-image-picker';
import { userImageUri } from '@/app/utils/user/imageUri'

const UserImageAndName = ({author}: {author: User | AuthUser | null}) => {
  const [userImage, setUserImage] = useState(require('../../../assets/images/bp_logo_gold.png'))
  const [userName, setUserName] = useState('-')
  const authUser = useUserStore();
  const isAuthUser = author?.id === authUser.authUser?.id;

  useEffect(() => {
    if (author && author.image) {
      setUserImage(userImageUri(author.image))
      setUserName(author.fullName)
    }
  }, [author])
  
  const isPickingRef = React.useRef(false);

  const pickUserImage = async () => {
    if (isPickingRef.current) return;

    isPickingRef.current = true;
    try {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [3, 4],
        quality: 1,
      });
      if (!result.canceled) {
          const data = await useUserStore.getState().updateAuthUserImage(result.assets[0].uri, 'profile')
          if (data) {
            setUserImage(userImageUri(data.url))
          }
      }
    } catch (e) {
        console.log('ImagePicker error', e);
    } finally {
        isPickingRef.current = false;
    }
  };
  
  return (
    <View style={{flexDirection: 'row', alignItems: 'flex-end', width: '100%'}}>
        <View style={{position: 'relative'}}>
            <Image source={userImage} style={styles.image} />
            {isAuthUser && <TouchableOpacity onPress={pickUserImage} disabled={isPickingRef.current} style={styles.userImageCamera}>
              <AntDesign name="camera" size={20} color="gray" />
            </TouchableOpacity>}
        </View>
        <View style={{ width: '60%', flex: 1, marginLeft: 5 }}>
            <Text style={{fontWeight: 'bold', fontSize: 16}}>{userName}</Text>
            <Text>@{author && author.roles && author.roles.length && author?.roles.includes('ROLE_AUTHOR') 
                ? labels.author 
                : labels.reader + ' | ' + labels.publisher
            }</Text>
        </View>
    </View>
  )
}

export default UserImageAndName
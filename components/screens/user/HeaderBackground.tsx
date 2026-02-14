import { View, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { User } from '@/components/types/User'
import { styles } from '@/styles/author.styles';
import * as ImagePicker from 'expo-image-picker';
import { userImageUri } from '@/app/utils/user/imageUri';
import { useUserStore } from '@/app/store/userStore';
import AntDesign from '@expo/vector-icons/AntDesign';

const HeaderBackground = ({author, authorScreen}: {author: User | null, authorScreen?: boolean}) => {
  const [cover, setCover] = useState(require('../../../assets/images/cover_1.jpg'))
  const authUser = useUserStore();
  const isAuthUser = author?.id === authUser.authUser?.id;

  useEffect(() => {
    if (author && author.profileImage) {
      setCover(userImageUri(author.profileImage))
    }
  }, [author])

  const isPickingRef = React.useRef(false);
  
  const pickCoverImage = async () => {
    if (isPickingRef.current) return;
    isPickingRef.current = true;
    try {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [10, 5],
          quality: 1,
        });
        if (!result.canceled) {
            const data = await useUserStore.getState().updateAuthUserImage(result.assets[0].uri, 'cover')
            if (data) {
                setCover(userImageUri(data.url))
            }
        }
    } catch (e) {
        console.log('ImagePicker error', e);
    } finally {
        isPickingRef.current = false;
    }
  };

  return (
    <View style={{position: 'relative'}}>
        <Image source={cover} style={styles.headerBackgroundImage} />
        {isAuthUser && <TouchableOpacity onPress={pickCoverImage} disabled={isPickingRef.current} style={styles.userImageCamera}>
            <AntDesign name="camera" size={20} color="gray" />
        </TouchableOpacity>}
    </View>
  )
}

export default HeaderBackground

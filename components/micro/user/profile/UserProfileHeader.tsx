import { useAuthStore } from "@/app/store/auth";
import { englishNumberToBengali } from "@/app/utils/englishNumberToBengali";
import { labels } from "@/app/utils/labels";
import ImagePicker from '@/components/micro/ImagePicker';
import { updateProfileImage } from "@/services/userApi";
import { styles } from "@/styles/profile.styles";
import Feather from "@expo/vector-icons/Feather";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { router } from 'expo-router';
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logout } from "@/helper/profileUpdate";


const UserProfileHeader = ({author}: {author: any }) => {
    const { authenticatedUser } = useAuthStore();
    const [user, setUser] = useState(authenticatedUser as any)
    useEffect(() => {
        const loadLoggedInUser = async () => {
          const storedUser = await AsyncStorage.getItem('auth-user');
          setUser(storedUser ? JSON.parse(storedUser) : null);
      }

      loadLoggedInUser()
    },[author])

    return (
        <View>
            <View style={{backgroundColor: '#085a80', height: 90}}>
                <View style={{marginTop: 50, flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 15}}> 
                    <TouchableOpacity onPress={() => router.replace('/')}>
                        <FontAwesome5 name="arrow-left" size={18} color="#d4d4d4" />
                    </TouchableOpacity>

                    {user && author && user.id === author.id && <TouchableOpacity onPress={() => {router.push({ pathname: "/screens/user/profileUpdate", params: {} })}}>
                        <Feather name="settings" size={18} color="#d4d4d4" />
                    </TouchableOpacity>}
                </View>
            </View>

            <View style={styles.cover}>
                <Image source={require('../../../../assets/images/profile_cover.jpg')} style={styles.coverImg} />
                <View style={styles.userInfo}>
                    <ImagePicker defaultImage={author ? author.image : 'default_post_image.jpg'} onChange={async (value) => {
                        // if (!author || !token) return
                      const response = await updateProfileImage(value, author ? author.id : 0)
                    }} />
                </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingBottom:10 }}>
                <View style={{width: '55%', marginLeft: 6}}>
                    <Text style={styles.userName}>{author?.fullName}</Text>
                    <Text style={styles.userRole}>@{labels.reader}{author && author?.totalBooks > 0 ? ` | ${labels.publisher}` : ''}</Text>
                </View>
                <View style={{ width: '20%',alignItems: 'center' }}>
                    <Text>{ englishNumberToBengali(author ? author.totalReads : 0)}</Text>
                    <Text style={{fontSize: 12}}>{labels.reads}</Text>
                </View>
                <View style={{ width: '15%', alignItems: 'center' }}>
                    <Text>{englishNumberToBengali(author ? author.totalBooks : 0)}</Text>
                    <Text style={{fontSize: 12}}>{labels.books}</Text>
                </View>
            </View>
        </View>
    )
}

export default UserProfileHeader;
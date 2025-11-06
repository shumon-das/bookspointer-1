import { englishNumberToBengali } from "@/app/utils/englishNumberToBengali";
import { labels } from "@/app/utils/labels";
import ImagePicker from '@/components/micro/ImagePicker';
import { updateProfileImage } from "@/services/userApi";
import { styles } from "@/styles/profile.styles";
import { UserInterface } from "@/types/interfeces";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { Image, Text, View } from "react-native";


const UserProfileHeader = ({uuid}: {uuid: string}) => {
    const [author, setAuthor] = useState<UserInterface|null>(null);
    const [token, setToken] = useState<string|null>(null);

    useFocusEffect(
        useCallback(() => {
        const loadUserAndToken = async () => {
            const storedUser = await AsyncStorage.getItem('auth-user');
            const storedToken = await AsyncStorage.getItem('token');
            setAuthor(storedUser ? JSON.parse(storedUser) : null);
            setToken(storedToken);
        };
        loadUserAndToken();
        }, [uuid])
    );
    
    return (
        <View>
            <View style={styles.cover}>
                <Image source={require('../../../../assets/images/profile_cover.jpg')} style={styles.coverImg} />
                <View style={styles.userInfo}>
                    <ImagePicker defaultImage={author ? author.image : 'default_post_image.jpg'} onChange={(value) => {
                        // if (!author || !token) return
                        updateProfileImage(value, token ?? '', author ? author.id : 0)
                    }} />
                </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingBottom:10 }}>
                <View style={{width: '60%', marginLeft: 6}}>
                    <Text style={styles.userName}>{author?.fullName}</Text>
                    <Text style={styles.userRole}>@{labels.reader}</Text>
                </View>
                <View style={{ width: '15%', alignItems: 'center' }}>
                    <Text>{englishNumberToBengali(author ? author.totalBooks : 0)}</Text>
                    <Image source={ require('../../../../assets/images/books_logo.png')} style={styles.booksLogo} />
                </View>
                {/* <View style={{ width: '15%', alignItems: 'center' }}>
                    <Text>{ englishNumberToBengali(0)}</Text>
                    <FontAwesome name="download" size={20} color={'blue'} />
                </View> */}
            </View>
        </View>
    )
}

export default UserProfileHeader;
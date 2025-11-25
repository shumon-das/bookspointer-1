import useAuthStore from "@/app/store/auth";
import { englishNumberToBengali } from "@/app/utils/englishNumberToBengali";
import { labels } from "@/app/utils/labels";
import ImagePicker from '@/components/micro/ImagePicker';
import { updateProfileImage } from "@/services/userApi";
import { styles } from "@/styles/profile.styles";
import { Image, Text, View } from "react-native";

const UserProfileHeader = () => {
    const { user: author, token } = useAuthStore();

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
                <View style={{width: '55%', marginLeft: 6}}>
                    <Text style={styles.userName}>{author?.fullName}</Text>
                    <Text style={styles.userRole}>@{labels.reader}{author && author?.totalBooks > 0 ? `| ${labels.publisher}` : ''}</Text>
                </View>
                <View style={{ width: '25%', alignItems: 'center' }}>
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
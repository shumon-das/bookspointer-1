// import { TouchableOpacity, View, Image, Text } from "react-native"
// import FontAwesome from "react-native-vector-icons/FontAwesome"
// import { styles } from '@/styles/bottomNav.styles';
// import { useRouter } from "expo-router";
// import labels from "@/app/utils/labels";
// import { redirectToUserProfile } from "@/helper/userRedirection";
// import { useEffect, useState } from "react";
// import { useAuthStore } from "@/app/store/auth";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const Header = () => {
//     const router = useRouter()
//     const authStore = useAuthStore()
//     const { user } = useAuthStore();
//     const [loggedInUser, setLoggedInUser] = useState(user)

//     useEffect(() => {
//         const loadStorageUser = async () => {
//             if (user) {
//                 setLoggedInUser(user)
//             } else {
//                 const storageUser = await AsyncStorage.getItem('auth-user')
//                 setLoggedInUser(storageUser ? JSON.parse(storageUser) : null)
//             }
//         }
//         loadStorageUser()
//     }, [user])

//     const goToProfile = () => {
//         loggedInUser ? redirectToUserProfile(loggedInUser.uuid, router, authStore) : router.push('/auth/login')
//     }
//     return (<View style={styles.header}>
//         <TouchableOpacity onPress={() => router.push('/(tabs)/search')}>
//             <FontAwesome name="search" style={styles.marginLeft} size={20} color="white" />
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => router.push('/screens/book/create-post')}>
//             <Text style={[styles.marginLeft, {color: 'white'}]}>{labels.writeBook}</Text>
//         </TouchableOpacity>
//         {loggedInUser && (
//             <TouchableOpacity onPress={goToProfile} style={styles.userImgParentElement}>
//                 <Image 
//                     source={{uri: `https://api.bookspointer.com/uploads/${loggedInUser?.image}`}} 
//                     style={styles.userImg} 
//                 />
//             </TouchableOpacity>
//         )}
//         {!loggedInUser &&  (
//             <TouchableOpacity onPress={goToProfile} style={styles.loginBtn}>
//                 <Text>{labels.signIn}</Text>
//             </TouchableOpacity>
//         )}
//     </View>)
// }

// export default Header
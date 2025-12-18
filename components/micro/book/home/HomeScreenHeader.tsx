import labels from "@/app/utils/labels";
import { useFocusEffect, useRouter } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native"
import { styles as styles2 } from '@/styles/bottomNav.styles';
import { useAuthStore } from "@/app/store/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import NotificationBadge from "@/components/NotificationBadge";
import { useCallback, useState } from "react";

const HomeScreenHeader = () => {
    const router = useRouter();
    const { authenticatedUser } = useAuthStore();
    const authStore = useAuthStore();
    const [loggedInUser, setLoggedInUser] = useState(authenticatedUser)
   
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
        
    const goToProfile = async () => {
        const storageUser = await AsyncStorage.getItem('auth-user')
        if (!storageUser) {
        router.push('/auth/login')
        return
        }
        authStore.setUser(JSON.parse(storageUser))
        router.push('/screens/user/userProfile');
    }

    return (<View style={styles.header}>
        <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
                 <Image  source={require('../../../../assets/images/bp_small_logo.png')} style={{width: 30, height: 25, margin: 'auto'}} />
                 <Text style={{color: 'white', fontSize: 10}}>{labels.booksPointer}</Text>
            </View>
            
            <View></View>
            
            <View style={styles.headerRight}>
                <TouchableOpacity onPress={() => router.push('/(tabs)/search')}>
                    <FontAwesome name="search" style={styles2.marginLeft} size={20} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/screens/book/create-post')}>
                    <Text style={[styles2.marginLeft, {color: 'white'}]}>{labels.writeBook}</Text>
                </TouchableOpacity>
                
                <NotificationBadge />
                
                {loggedInUser && (
                    <TouchableOpacity onPress={goToProfile} style={styles2.userImgParentElement}>
                        <Image 
                            source={{uri: `https://api.bookspointer.com/uploads/${loggedInUser?.image}`}} 
                            style={styles2.userImg} 
                        />
                    </TouchableOpacity>
                )}
                {!loggedInUser &&  (
                    <TouchableOpacity onPress={goToProfile} style={styles2.loginBtn}>
                        <Text>{labels.signIn}</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    </View>)
}

export default HomeScreenHeader

const styles = StyleSheet.create({
    header: {
        height: '80%',
        marginTop: '9%',
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 50,
        alignItems: 'center'
    },
    headerLeft: {
        marginHorizontal: 10,
        textAlign: 'center',
        marginVertical: 5
    },
    headerRight: {
        flexDirection: 'row', 
        alignItems: 'center',
        marginRight: 10,
    },
})
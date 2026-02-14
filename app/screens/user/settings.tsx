import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import React, { useLayoutEffect, useState, useEffect } from 'react'
import { useNavigation, useRouter } from 'expo-router'
import { useUserStore } from '@/app/store/userStore';
import { User } from '@/components/types/User';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { logout } from '@/helper/profileUpdate';

const settings = () => {
    const navigation = useNavigation();
    useLayoutEffect(() => { navigation.setOptions({ headerShown: true, title: 'Settings' });}, []);
    const router = useRouter();

    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        let authUser = useUserStore.getState().authUser;
        if (!authUser) {
            useUserStore.getState().fetchAuthUserFromDb();
            authUser = useUserStore.getState().authUser;
        }
        setUser(authUser);
    }, []);

    const onPressLogout = async () => {
        try {
            Alert.alert('Logout', 'Are you sure you want to logout?', [
                {text: 'Cancel', style: 'cancel'},
                {text: 'Logout', onPress: async () => {
                    await logout(router);
                }}
            ])
        } catch (error) {
            console.log(error)
            Alert.alert('Logout Failed', JSON.stringify(error))
        }
    }

    const screens = [
        {title: 'Update Profile', icon: 'user', onPress: () => router.push('/screens/user/profileUpdate')},
        {title: 'Reset Password', icon: 'lock', onPress: () => router.push('/screens/user/resetPassword')},
        {title: 'Blocked User List', icon: 'user-times', onPress: () => router.push('/screens/user/blocked-users')},
        {title: 'Logout', icon: 'sign-out', onPress: onPressLogout},
    ]
  return (
    <View style={styles.container}>
        {screens.map((item, index) => (
            <TouchableOpacity key={index} onPress={item.onPress} style={styles.item}>
                <FontAwesome name={item.icon as any} size={24} color="gray" style={styles.itemIcon} />
                <Text style={styles.itemText}>{item.title}</Text>
            </TouchableOpacity>
        ))}
    </View>
  )
}

export default settings

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    itemIcon: {
        marginRight: 10,
        width: 30,
    },
    itemText: {
        fontSize: 16,
    },
})
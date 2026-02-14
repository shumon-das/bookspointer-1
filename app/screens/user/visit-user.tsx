import { useAuthorsStore } from '@/app/store/authorStore'
import labels from '@/app/utils/labels'
import AppBottomSheet from '@/components/micro/AppBottomSheet'
import AppLoginBottomSheet from '@/components/micro/AppLoginBottomSheet'
import { useNetworkStatus } from '@/components/network/networkConnectionStatus'
import Description from '@/components/screens/user/Description'
import Follow from '@/components/screens/user/Follow'
import FollowersCount from '@/components/screens/user/FollowersCount'
import HeaderBackground from '@/components/screens/user/HeaderBackground'
import SeriesList from '@/components/screens/user/SeriesList'
import UserImageAndName from '@/components/screens/user/UserImageAndName'
import { User } from '@/components/types/User'
import { styles } from '@/styles/author.styles'
import { MaterialIcons } from '@expo/vector-icons'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

const VisitUser = () => {
    const {isOnline, isInitializing} = useNetworkStatus(() => {
        console.log('✅ Online again, syncing data...');
    });

    const navigation = useNavigation();
    useEffect(() => navigation.setOptions({ headerShown: false }), [isOnline]);
    const { uuid } = useLocalSearchParams()

    const [visitUser, setVisitUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false);
    const [followersCountChange, setFollowersCountChange] = useState(null as boolean | null)

    const sheetRef = useRef<any>(null);
    const loginSheetRef = useRef<any>(null);

    const handleBottomSheet = (value: boolean) => {
        loginSheetRef.current?.close()
        setTimeout(() => {
            value ? sheetRef.current?.snapToIndex(1) : sheetRef.current?.close()
        }, 50);
    }

    const handleLoginBottomSheet = (value: boolean) => {
        sheetRef.current?.close()
        setTimeout(() => {
            value ? loginSheetRef.current?.expand() : loginSheetRef.current?.close()
        }, 50);
    }

    const authorStore = useAuthorsStore()
    const fetchUser = async () => {
        setLoading(true)
        const user = await authorStore.findUserByUuid(uuid as string, isOnline)
        if (user) {
            setVisitUser(user as any)
        }
        setLoading(false)
    }

    const fetchUserByApi = async () => {
        const user = await authorStore.fetchUserByUuidApi(uuid as string)
        if (user) {
            setVisitUser(user as any)
        }
    }
    
    useEffect(() => {
        if (isInitializing) return;
        fetchUser()
        fetchUserByApi()
    }, [uuid, isOnline, isInitializing])

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchUserByApi();
        setRefreshing(false);
    }, []);

    if (!visitUser && !isOnline) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <MaterialIcons name="wifi-off" size={48} color="#444" />
                <Text>No internet connection</Text>
            </View>
        )
    }

    if (!visitUser && !isInitializing && !isOnline) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>{labels.userNotFound}</Text>
            </View>
        )
    }

    return (
        <GestureHandlerRootView style={{ flex: 1, position: 'relative' }}>
            <ScrollView 
                style={{ backgroundColor: '#f9f0eb' }} 
                overScrollMode="never" 
                bounces={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View style={{ paddingBottom: 50 }}>
                    <View style={styles.cover}>
                        <HeaderBackground author={visitUser} />
                    </View>
                    <View style={styles.userImageAndName}>
                        <UserImageAndName author={visitUser} />
                    </View>
                </View>
                <View style={styles.section}>
                    <Follow 
                        author={visitUser} 
                        onFollowUnfollow={(value) => setFollowersCountChange(value)} 
                        onPressSearch={handleBottomSheet}
                        onTryLogin={handleLoginBottomSheet}
                    />
                </View>
                <View style={styles.section}>
                    <FollowersCount author={visitUser} changedValue={followersCountChange} />
                </View>
                {(loading || refreshing) && <View style={styles.floatingLoading}>
                    <ActivityIndicator size="large" color="#e63946" />
                </View>}
                <View style={styles.section}>
                    <Description author={visitUser} />
                </View>
                <View style={styles.section}>
                    <SeriesList author={visitUser} isUser={true}/>
                </View>
                <View style={[styles.section, { height: 200 }]}>

                </View>
            </ScrollView>

            {visitUser && <AppBottomSheet {...visitUser} ref={sheetRef} />}
            {visitUser && <AppLoginBottomSheet {...visitUser} ref={loginSheetRef} />}
        </GestureHandlerRootView>
    )
}

export default VisitUser
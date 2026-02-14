import { View, ScrollView, ActivityIndicator, Text, RefreshControl } from 'react-native'
import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useNavigation } from 'expo-router';
import { AuthUser } from '@/components/types/User';
import HeaderBackground from '@/components/screens/user/HeaderBackground';
import { styles } from '@/styles/author.styles';
import UserImageAndName from '@/components/screens/user/UserImageAndName';
import FollowersCount from '@/components/screens/user/FollowersCount';
import Description from '@/components/screens/user/Description';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppBottomSheet from '@/components/micro/AppBottomSheet';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import SeriesList from '@/components/screens/user/SeriesList';
import { useUserStore } from '@/app/store/userStore';
import UserSelfSearchAndUpdate from '@/components/micro/user/profile/UserSelfSearchAndUpdate';
import AuthUserContent from '@/components/micro/user/profile/AuthUserContent';
import { useNetworkStatus } from '@/components/network/networkConnectionStatus';

// it is *** OPTIONAL *** this will prevent the extra warning from Reanimated
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // This is the key line
});
// end *** optional *** configuration

const UserProfile = () => {
    const navigation = useNavigation();
    useEffect(() => navigation.setOptions({ headerShown: false }), []);
    const [refreshing, setRefreshing] = useState(false);
    const {isOnline, isInitializing} = useNetworkStatus(() => {
        console.log('✅ Online again, syncing data...');
    });

    const [author, setAuthor] = useState<AuthUser|null>(null);
    const [loading, setLoading] = useState(false);

    const getAuthorFromDb = async () => {
        if (isInitializing) return;
        setLoading(true);
        const fetchAuthUser = await useUserStore.getState().fetchAuthUserFromDb();
        setAuthor(fetchAuthUser);
        setLoading(false);
    }

    const fetchAuthUser = async () => {
        setLoading(true);
        const fetchAuthUser = await useUserStore.getState().fetchAuthUserByAPi();
        setAuthor(fetchAuthUser);
        setLoading(false);
    }
    
    useEffect(() => {
        getAuthorFromDb();
        fetchAuthUser();
    }, [isOnline, isInitializing]);

    const sheetRef = useRef<any>(null);
    const handleBottomSheet = (value: boolean) => {
        value ? sheetRef.current?.snapToIndex(1) : sheetRef.current?.close() 
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchAuthUser();
        setRefreshing(false);
    }, []);

    if (!author) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>loading...</Text>
            </View>
        )
    }

    return (
        <GestureHandlerRootView style={{ flex: 1,backgroundColor: '#f9f0eb', position: 'relative' }} >
            <ScrollView 
                overScrollMode="never" 
                bounces={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View style={{ paddingBottom: 50}}>
                    <View style={styles.cover}>
                        <HeaderBackground author={author} />
                    </View>
                    <View style={styles.userImageAndName}>
                        <UserImageAndName author={author} />
                    </View>
                </View>
                <View style={styles.section}>
                    <UserSelfSearchAndUpdate author={author} onPressSearch={handleBottomSheet} />
                </View>
                <View style={styles.section}>
                    <FollowersCount author={author} changedValue={null} />
                </View>
                {refreshing || loading && <View style={styles.floatingLoading}>
                    <ActivityIndicator size="large" color="#e63946" />
                </View>}
                <View style={styles.section}>
                    <Description author={author} />
                </View>
                <View style={styles.section}>
                    <SeriesList author={author} isUser={true}/>
                </View>
                <View>
                    <AuthUserContent author={author} />
                </View>
                <View style={{height: 100}}>
                    
                </View>
            </ScrollView>
            
            {author && <AppBottomSheet {...author} ref={sheetRef} />}
        </GestureHandlerRootView>
    )
}

export default UserProfile
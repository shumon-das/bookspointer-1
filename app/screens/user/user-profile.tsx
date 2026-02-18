import { useUserStore } from '@/app/store/userStore';
import AppBottomSheet from '@/components/micro/bottomSheet/AppBottomSheet';
import AppCreateSeriesSheet from '@/components/micro/bottomSheet/AppCreateSeriesSheet';
import AuthUserContent from '@/components/micro/user/profile/AuthUserContent';
import UserSelfSearchAndUpdate from '@/components/micro/user/profile/UserSelfSearchAndUpdate';
import { useNetworkStatus } from '@/components/network/networkConnectionStatus';
import Description from '@/components/screens/user/Description';
import FollowersCount from '@/components/screens/user/FollowersCount';
import HeaderBackground from '@/components/screens/user/HeaderBackground';
import SeriesList from '@/components/screens/user/SeriesList';
import UserImageAndName from '@/components/screens/user/UserImageAndName';
import { AuthUser } from '@/components/types/User';
import { styles } from '@/styles/author.styles';
import { useNavigation } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';

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
    const createSeriesSheetRef = useRef<any>(null);

    const handleBottomSheet = (value: boolean) => {
        createSeriesSheetRef.current?.close()
        value ? sheetRef.current?.snapToIndex(1) : sheetRef.current?.close()
    }

    const handleCreateSeriesSheet = (value: boolean) => {
        sheetRef.current?.close()
        value ? createSeriesSheetRef.current?.snapToIndex(1) : createSeriesSheetRef.current?.close()
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
                    <SeriesList author={author} isUser={true} onPressCreateSeries={handleCreateSeriesSheet} />
                </View>
                <View>
                    <AuthUserContent author={author} />
                </View>
                <View style={{height: 100}}>
                    
                </View>
            </ScrollView>
            
            {author && <AppBottomSheet {...author} ref={sheetRef} />}
            {author && <AppCreateSeriesSheet {...author} ref={createSeriesSheetRef} />}
        </GestureHandlerRootView>
    )
}

export default UserProfile
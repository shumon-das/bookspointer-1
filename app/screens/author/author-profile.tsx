import { View, ScrollView, RefreshControl, ActivityIndicator } from 'react-native'
import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { User } from '@/components/types/User';
import HeaderBackground from '@/components/screens/user/HeaderBackground';
// import { getAuthorByUrl } from '@/services/userApi';
import { styles } from '@/styles/author.styles';
import UserImageAndName from '@/components/screens/user/UserImageAndName';
import Follow from '@/components/screens/user/Follow';
import FollowersCount from '@/components/screens/user/FollowersCount';
import Description from '@/components/screens/user/Description';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppBottomSheet from '@/components/micro/bottomSheet/AppBottomSheet';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import SeriesList from '@/components/screens/user/SeriesList';
import PopularBooks from '@/components/screens/user/PopularBooks';
import { useAuthorsStore } from '@/app/store/authorStore';
import { useNetworkStatus } from '@/components/network/networkConnectionStatus';
import AppLoginBottomSheet from '@/components/micro/bottomSheet/AppLoginBottomSheet';

// it is *** OPTIONAL *** this will prevent the extra warning from Reanimated
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // This is the key line
});
// end *** optional *** configuration

const Author = () => {
    const navigation = useNavigation();
    useEffect(() => navigation.setOptions({ headerShown: false }), []);
    const authorsStore = useAuthorsStore();
    const {isOnline} = useNetworkStatus(() => {
        console.log('✅ Online again, syncing data...');
    });
    const {authorUuid, url} = useLocalSearchParams();
    const [author, setAuthor] = useState<User|null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [followersCountChange, setFollowersCountChange] = useState(null as boolean | null)
    
    const fetchAuthorFromStore = async () => {
        const author = await authorsStore.findUserByUuid(authorUuid as string, isOnline);
        if (author) {
            setAuthor(author as any);
            return;
        }
    }

    const fetchAuthorByApi = async () => {
        const user = await useAuthorsStore.getState().fetchUserByUuidApi(authorUuid as string)
        if (user) {
            setAuthor(user as any)
        }
    }

    useEffect(() => {
        fetchAuthorFromStore();
        fetchAuthorByApi();
    }, [authorUuid, isOnline]);

    const sheetRef = useRef<any>(null);
    const handleBottomSheet = (value: boolean) => {
        value ? sheetRef.current?.snapToIndex(0) : sheetRef.current?.close() 
    }

    const loginSheetRef = useRef<any>(null);
    const handleLoginBottomSheet = (value: boolean) => {
        value ? loginSheetRef.current?.snapToIndex(1) : loginSheetRef.current?.close()
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchAuthorByApi();
        setRefreshing(false);
    }, []);

    return (
        <GestureHandlerRootView style={{ flex: 1, position: 'relative' }}>
            <ScrollView
                overScrollMode="never" 
                bounces={false} 
                style={{backgroundColor: '#f9f0eb'}}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View style={{ paddingBottom: 50}}>
                    <View style={styles.cover}>
                        <HeaderBackground author={author} authorScreen={true} />
                    </View>
                    <View style={styles.userImageAndName}>
                        <UserImageAndName author={author} />
                    </View>
                </View>
                <View style={styles.section}>
                    <Follow 
                        author={author} 
                        onFollowUnfollow={(value) => setFollowersCountChange(value)} 
                        onPressSearch={handleBottomSheet}
                        onTryLogin={handleLoginBottomSheet}
                    />
                </View>
                <View style={styles.section}>
                    <FollowersCount author={author} changedValue={followersCountChange} />
                </View>
                {(refreshing) && <View style={styles.floatingLoading}>
                    <ActivityIndicator size="large" color="#e63946" />
                </View>}
                <View style={styles.section}>
                    <Description author={author} />
                </View>
                <View style={styles.section}>
                    <PopularBooks author={author} />
                </View>
                <View style={styles.section}>
                    <SeriesList author={author} onPressCreateSeries={() => { }}/>
                </View>
                <View style={[styles.section, {height: 200}]}>
                    
                </View>
            </ScrollView>
            
            {author && <AppBottomSheet {...author} ref={sheetRef} />}
            {author && <AppLoginBottomSheet {...author} ref={loginSheetRef} />}
        </GestureHandlerRootView>
    )
}

export default Author
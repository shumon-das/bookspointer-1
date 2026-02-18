import AppBottomSheet from '@/components/micro/bottomSheet/AppBottomSheet';
import Follow from '@/components/screens/user/Follow';
import HeaderBackground from '@/components/screens/user/HeaderBackground';
import SeriesBooks from '@/components/screens/user/SeriesBooks';
import UserImageAndName from '@/components/screens/user/UserImageAndName';
import { User } from '@/components/types/User';
import { getSingleUserByUuid } from '@/services/userApi';
import { styles } from '@/styles/author.styles';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';

// it is *** OPTIONAL *** this will prevent the extra warning from Reanimated
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // This is the key line
});
// end *** optional *** configuration

const UserSeries = () => {
    const navigation = useNavigation();
    useEffect(() => navigation.setOptions({ headerShown: false }), []);

    const {authorUuid, url, series} = useLocalSearchParams();
    const [author, setAuthor] = useState<User|null>(null);

    const getAuthorFromDb = async (uuid: string) => {
        const data = await getSingleUserByUuid(authorUuid as string) as unknown as User;
        setAuthor(data);
    }
    
    useEffect(() => {
        getAuthorFromDb(authorUuid as string);
    }, [authorUuid]);

    const sheetRef = useRef<any>(null);
    const handleBottomSheet = (value: boolean) => {
        value ? sheetRef.current?.snapToIndex(0) : sheetRef.current?.close() 
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={{backgroundColor: '#f9f0eb'}}>
                <View style={{ paddingBottom: 50}}>
                    <View style={styles.cover}>
                        <HeaderBackground author={author} />
                    </View>
                    <View style={styles.userImageAndName}>
                        <UserImageAndName author={author} />
                    </View>
                </View>
                <View style={styles.section}>
                    <Follow 
                        author={author} 
                        onFollowUnfollow={() => console.log('follow/unfollow')}
                        onPressSearch={handleBottomSheet} 
                        onTryLogin={() => console.log('try login')}
                    />
                </View>
                <View style={styles.section}>
                    <SeriesBooks series={series as string} author={author} isUser={true} />
                </View>
                <View style={[styles.section, {height: 200}]}>
                    
                </View>
            </View>
            
            {author && <AppBottomSheet {...author} ref={sheetRef} />}
        </GestureHandlerRootView>
    )
}

export default UserSeries
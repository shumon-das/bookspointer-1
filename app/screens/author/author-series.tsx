import { View } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { User } from '@/components/types/User';
import HeaderBackground from '@/components/screens/user/HeaderBackground';
import { getAuthorByUrl, getSingleUserByUuid } from '@/services/userApi';
import { styles } from '@/styles/author.styles';
import UserImageAndName from '@/components/screens/user/UserImageAndName';
import Follow from '@/components/screens/user/Follow';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppBottomSheet from '@/components/micro/AppBottomSheet';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import SeriesBooks from '@/components/screens/user/SeriesBooks';

// it is *** OPTIONAL *** this will prevent the extra warning from Reanimated
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // This is the key line
});
// end *** optional *** configuration

const Author = () => {
    const navigation = useNavigation();
    useEffect(() => navigation.setOptions({ headerShown: false }), []);

    const {authorUuid, url, series} = useLocalSearchParams();
    const [author, setAuthor] = useState<User|null>(null);

    const getAuthorFromDb = async (uuid: string) => {
        const data = url.includes('/author/') 
            ? await getAuthorByUrl(url as string) as unknown as User 
            : await getSingleUserByUuid(uuid as string) as unknown as User;
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
                        onPressSearch={handleBottomSheet}
                        onFollowUnfollow={() => {}}
                        onTryLogin={() => {}}
                    />
                </View>
                <View style={styles.section}>
                    <SeriesBooks series={series as string} author={author} isUser={false} />
                </View>
                <View style={[styles.section, {height: 200}]}>
                    
                </View>
            </View>
            
            {author && <AppBottomSheet {...author} ref={sheetRef} />}
        </GestureHandlerRootView>
    )
}

export default Author
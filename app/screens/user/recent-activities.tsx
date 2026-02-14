import { View, Text, ActivityIndicator, FlatList } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { AuthUser } from '@/components/types/User';
import { useUserStore } from '@/app/store/userStore';
import { formatActivity, icons } from '@/helper/activities';
import { useNavigation } from 'expo-router';
import labels from '@/app/utils/labels';

const RecentActivities = () => {
    const navigation = useNavigation();
    useLayoutEffect(() => { navigation.setOptions({ headerShown: true, title: labels.resentActivity });}, []);
    const [author, setAuthor] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [recentActivities, setRecentActivities] = useState([] as any[]);
    
    const getAuthorFromDb = async () => {
            setLoading(true);
            const authUser = await useUserStore.getState().fetchAuthUserFromDb() as AuthUser;
            setAuthor(authUser);
            setRecentActivities(authUser.recentActivities);
            setLoading(false);
        }
    
    useEffect(() => {
        getAuthorFromDb();
    }, []);
    
    if (loading) {
        return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#e63946" />
                </View>
            )
        }
    
        if (!author) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Activities not found</Text>
                </View>
            )
        }
    
    const renderItem = (activity: any) => {
        console.log(Object.keys(activity));
        return (
            <View key={activity.last_activity_at} style={{}}>
                <View style={{
                    flexDirection: 'row', 
                    alignItems: 'center', 
                    gap: 10, 
                    marginHorizontal: 20, 
                    borderBottomWidth: 1, 
                    borderBottomColor: '#ccc', 
                    paddingVertical: 10
                }}>
                    <Text>{icons[activity.type]}</Text>
                    <Text>{formatActivity(activity)}</Text>
                </View>
            </View>
        )
    }
  return (
    <View>
        <FlatList
            data={recentActivities}
            renderItem={({ item}) => renderItem(item)}
            keyExtractor={(item) => item.book_id}
            ListFooterComponent={() => (
                <View style={{ height: 200 }} />
            )}
            ListEmptyComponent={() => (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>No activities found</Text>
                </View>
            )}
        />
    </View>
  )
}

export default RecentActivities
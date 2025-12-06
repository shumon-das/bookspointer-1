import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, BackHandler, FlatList, Text, TouchableOpacity, View } from "react-native";
import labels from "../utils/labels";
import { getNotificationBooks, markNotificationAsRead } from "@/services/notificationApi";
import useBookStore from "../store/book";

const notifications = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const navigation = useNavigation()
    useEffect(() => navigation.setOptions({ title: labels.notifications }), []);
    
    const {data} = useLocalSearchParams();
    const [items, setItems] = useState<any>(useBookStore.getState().notificationBooks);

    useEffect(() => {
        const getItems = async () => {
            setLoading(true);
            const dbData = await getNotificationBooks();
            setItems(dbData.data);
            useBookStore.getState().setNotificationBooks(dbData.data);
            setLoading(false);
        }
        getItems();
    }, []);

    useEffect(() => {
        const deviceBackButtonAction = () => {
            router.push('/');
            return true
        }
        
        const backHandler = BackHandler.addEventListener('hardwareBackPress', deviceBackButtonAction);
        return () => backHandler.remove();
    }, [])

    const onPressNotification = (item: any) => {
        markNotificationAsRead(item.notificationId);
        router.push({
            pathname: "/screens/book/details", 
            params: { 
                id: item.id, 
                title: item.title,
                author: item.author,
                content: null,
                isQuote: 'no',
                backurl: JSON.stringify({pathname: "/screens/notifications"})
            }}
        )
    } 

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity onPress={() => onPressNotification(item)} 
          style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}
        >
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.title}</Text>
            <Text style={{ fontSize: 12, fontStyle: 'italic' }}>{item.author}</Text>
            <Text style={{ fontSize: 14 }}>{item.content}</Text>
        </TouchableOpacity>
    );

    if (!items || items.length === 0) {
        return (
            loading 
            ? <ActivityIndicator size="large" color="#0000ff" className="mt-10 self-center" />
            : <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text>{labels.noNotifications}</Text>
              </View>
        );
    }

    return (
        loading 
        ? <ActivityIndicator size="large" color="#0000ff" className="mt-10 self-center" />
        : <FlatList data={items} keyExtractor={(item: any) => item.id} renderItem={renderItem} />
    );
}

export default notifications;
import { useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native";
import labels from "../utils/labels";
import { useBookStore } from "../store/book";
import TextContent from "@/components/screens/book/TextContent";
import englishNumberToBengali from "../utils/englishNumberToBengali";
import { useNotificationStore } from "../store/notificationStore";
import { useBookDetailsStore } from "../store/bookDetailsStore";

const notifications = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const navigation = useNavigation()
    const notificationStore = useNotificationStore();
    useEffect(() => navigation.setOptions({ title: labels.notifications, headerTintColor: '#d4d4d4', headerStyle: { backgroundColor: '#085a80' } }), []);
    
    const [items, setItems] = useState<any>(useBookStore.getState().notificationBooks);

    useEffect(() => {
        const getItems = async () => {
            setLoading(true);
            const dbData = await notificationStore.getNotifications();
            setItems(dbData.data);
            useBookStore.getState().setNotificationBooks(dbData.data);
            setLoading(false);
            
            await notificationStore.markAllNotificationAsRead(); // mark all notifications as read after load screen
        }
        getItems();
    }, []);

    const onPressNotification = (item: any) => {
        useBookDetailsStore.getState().setSelectedBook({id: item.data.id, title: item.data.title, url: item.data.url})
        router.push({
            pathname: "/screens/book/details", 
            params: { 
                id: item.data.id, 
                title: item.data.title,
                author: item.data.author.full_name,
                content: null,
                isQuote: 'no',
                backurl: JSON.stringify({pathname: "/screens/notifications"})
            }}
        )
    } 

    const renderItem = ({ item }: { item: any }) => {
        if (item.data.type === 'create_book') {
            return renderCreateBookNotification(item);
        }

        if (item.data.type === 'review') {
            return renderReviewNotification(item);
        }

        if (item.data.type === 'follow') {
            return renderFollowNotification(item);
        }

        return <></>
    };

    const renderCreateBookNotification = (item: any) => {
        return (<TouchableOpacity onPress={() => onPressNotification(item)} 
          style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc', backgroundColor: 'white' }}
        >
            <Text style={{ paddingHorizontal: 10, fontWeight: 'bold', fontSize: 16, color: item.viewed ? 'gray' : 'black' }}>{item.data.title}</Text>
            <Text style={{ paddingHorizontal: 14, fontSize: 12, fontWeight: 'bold', color: item.viewed ? 'gray' : 'black' }}>{item.data.author.full_name}</Text>
            <Text style={{ paddingHorizontal: 10, fontSize: 12, fontStyle: 'italic', color: item.viewed ? 'gray' : 'black' }}>{englishNumberToBengali(item.sentAt.date)}</Text>
            <View style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
                <TextContent content={item.body} textColor={item.viewed ? 'gray' : 'black'} fontSize={12}/>
            </View>
        </TouchableOpacity>)
    }

    const renderReviewNotification = (item: any) => {
        return <TouchableOpacity onPress={() => console.log(item)} 
          style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc', backgroundColor: 'white' }}
        >
            <Text style={{ paddingHorizontal: 10, fontWeight: 'bold', fontSize: 16, color: item.viewed ? 'gray' : 'black' }}>{item.title}</Text>
            <View style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
                <TextContent content={item.body} textColor={item.viewed ? 'gray' : 'black'} fontSize={12}/>
            </View>
        </TouchableOpacity>
    }

    const renderFollowNotification = (item: any) => {
        return <TouchableOpacity onPress={() => console.log(item)} 
          style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc', backgroundColor: 'white' }}
        >
            <Text style={{ paddingHorizontal: 10, fontWeight: 'bold', fontSize: 16, color: item.viewed ? 'gray' : 'black' }}>{item.title}</Text>
            <View style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
                <TextContent content={item.body} textColor={item.viewed ? 'gray' : 'black'} fontSize={12}/>
            </View>
        </TouchableOpacity>
    }

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
        : <FlatList 
            data={items} 
            keyExtractor={(item: any) => item.id} 
            renderItem={renderItem}
            ListFooterComponent={() => <View style={{height: 100}}></View>}
          />
    );
}

export default notifications;
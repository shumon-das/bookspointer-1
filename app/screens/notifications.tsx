import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import labels from "../utils/labels";
import { getNotificationBooks } from "@/services/notificationApi";
import useBookStore from "../store/book";

const notifications = () => {
    const router = useRouter();
    const navigation = useNavigation()
    useEffect(() => navigation.setOptions({ title: labels.notifications }), []);
    
    const {data} = useLocalSearchParams();
    const [items, setItems] = useState<any>(useBookStore.getState().notificationBooks);

    useEffect(() => {
        if (data) {
            const getItems = async () => {
                const currentData = JSON.parse(data as string);
                const dbData = await getNotificationBooks(currentData);
                setItems(dbData.data);
                useBookStore.getState().setNotificationBooks(dbData.data);
            }
            getItems();
        }
    }, [data]);

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity onPress={() => {
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
          }} 
          style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}
        >
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.title}</Text>
            <Text style={{ fontSize: 12, fontStyle: 'italic' }}>{item.author}</Text>
            <Text style={{ fontSize: 14 }}>{item.content}</Text>
        </TouchableOpacity>
    );

    return (<FlatList data={items} keyExtractor={(item: any) => item.id} renderItem={renderItem} />);
}

export default notifications;
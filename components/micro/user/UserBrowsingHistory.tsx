import englishNumberToBengali from "@/app/utils/englishNumberToBengali";
import { deleteAllHistory, deleteHistory, fetchHistories } from "@/app/utils/history/history"
import labels from "@/app/utils/labels";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useFocusEffect, useRouter } from "expo-router"
import { useCallback, useState } from "react"
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native"

const UserBrowsingHistory = () => {
    const router = useRouter();
    const [histories, setHistories] = useState([])
    useFocusEffect(useCallback(() => {
        const fetchData = async () => {
            const data = await fetchHistories()
            setHistories(data)
        }
        fetchData();
    }, []))

    const onPressDeleteHistory = async (item: any) => {
        await deleteHistory(item.item.target)
        setHistories(histories.filter((hs: any) => hs.target !== item.item.target))
    }

    const onPressDeleteAllHistory = async () => {
        await deleteAllHistory()
        setHistories([])
    }

    const redirectToDetailsScreen = (item: any): any => {
        return String(Math.round(item.item.active_page / item.item.total_page * 100)) + '%'
    }

    const calculateWidth = (item: any): any => {
        return String(Math.round(item.item.active_page / item.item.total_page * 100)) + '%'
    }
    const renderItem = (item: any) => {
        return <View>
            <View style={styles.item}>
                <TouchableOpacity onPress={() => router.push({pathname: "/screens/book/details", params: {
                    id: item.item.target, 
                    title: item.item.title, 
                    author: item.item.author,
                    content: null,
                    isQuote: 'no',
                    backurl: ''
                }})}>
                    <Text>{item.item.title}</Text>
                    <View style={styles.readed}>
                        <Text style={styles.readedItem}>{labels.totalPages}</Text>
                        <Text style={styles.readedItem}>{englishNumberToBengali(item.item.total_page)}</Text>
                        <Text style={styles.readedItem}>{labels.readed}</Text>
                        <Text style={styles.readedItem}>{englishNumberToBengali(item.item.active_page)}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onPressDeleteHistory(item)}>
                    <FontAwesome6 name="window-close" size={20} color="gray" />
                </TouchableOpacity>
            </View>
            <Text style={{height: 2, backgroundColor: 'blue', width: calculateWidth(item)}}></Text>
        </View>
    }

    return (<View>
        <View style={styles.clearAll}>
            <TouchableOpacity onPress={() => onPressDeleteAllHistory()}>
                <Text>Clear All</Text>
            </TouchableOpacity>
        </View>
        <FlatList 
            data={histories} 
            keyExtractor={(item: any) => item.target.toString()} 
            renderItem={renderItem}
        />
    </View>)
}

export default UserBrowsingHistory

const styles = StyleSheet.create({
    clearAll: {
        flexDirection: 'row', 
        justifyContent: 'flex-end',
        marginHorizontal: 10,
        paddingVertical: 10
    },
    item: {
        borderBottomWidth: 1,
        borderColor: 'lightgray',
        paddingHorizontal: 10,
        paddingTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    readed: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    readedItem: {
        color: 'gray',
        fontSize: 10,
        marginTop: 5,
        marginRight: 5,
        marginVertical: 5,
    },
})
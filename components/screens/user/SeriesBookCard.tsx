import { View, Text, StyleSheet, Alert } from 'react-native'
import React, { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import PopOver from '@/components/micro/PopOver';
import labels from '@/app/utils/labels';
import { useRouter } from 'expo-router';
import { useBooksStore } from '@/app/store/bookStore';
import { UserInterface } from '@/types/interfeces';

const SeriesBookCardActions = ({book, author}: {book: any, author: any}) => {
    const [loggedInUser, setLoggedInUser] = React.useState<UserInterface|null>(null);
    const loadLoggedInUser = async () => {
        const storedUser = await AsyncStorage.getItem('auth-user');
        setLoggedInUser(storedUser ? JSON.parse(storedUser) : null);
    }
    
    useEffect(() => {
        loadLoggedInUser();
    }, [])
    
    const bookStore = useBooksStore();
    const popoverIcon = <FontAwesome name="chevron-down" size={14} color="black" />
    const popoverMenus = [
        {label: 'Edit'},
        {label: `Disable`},
        {label: `Delete`},
    ];

    const router = useRouter();
    const popoverAction = (item: any) => {
        if ('edit' === item.label.toLowerCase()) {
            router.push({pathname: "/screens/book/write-book", params: { bookuuid: book.uuid, id: book.id }})
        }
        if ('disable' === item.label.toLowerCase()) {
            Alert.alert(
                book.title, // Title
                "Are you sure you want to disable this book?", // Message
                [
                    {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel" // On iOS, this makes the text bold
                    },
                    { 
                        text: "OK", 
                        onPress: () => bookStore.updateBookPermission({ uuid: book.uuid, isPublished: false, isDeleted: false }),
                    }
                ]
            );
        }
        if ('delete' === item.label.toLowerCase()) {
            Alert.alert(
                book.title, // Title
                "Are you sure you want to permanently delete this book?", // Message
                [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel" // On iOS, this makes the text bold
                },
                { 
                    text: "OK", 
                    onPress: () => bookStore.deleteBook(book.id),
                }
                ]
            );
        }
    }

    if (!loggedInUser) {
        return null
    }

    return (
        <View style={styles.row}>
            <View></View>
            <View>
              <PopOver icon={popoverIcon} menus={popoverMenus} action={popoverAction} />
            </View>
        </View>
    )
}

export default SeriesBookCardActions

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    }
})
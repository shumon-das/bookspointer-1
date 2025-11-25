import { TouchableOpacity, View, Text } from "react-native"
import { styles } from "@/styles/writeBookScreen.styles";
import TextEditor from "@/components/micro/TextEditor";
import { useEffect, useLayoutEffect, useState } from "react";
import labels from "@/app/utils/labels";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import useAuthStore from "@/app/store/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { saveBook } from "@/services/api";
import { Snackbar } from "react-native-paper";
import useCategoryStore from "@/app/store/categories";
import { FontAwesome5 } from "@expo/vector-icons";
import Dialog from "@/components/micro/Dialog";

const EthernelWord = () => {
    const {bookuuid} = useLocalSearchParams();
    const [id, setId] = useState(null)
    const [uuid, setUuid] = useState(null)
    const [categoryData, setCategoryData] = useState(null as any)
    const [content, setContent] = useState('')
    const [initialContent, setInitialContent] = useState('')
    const [showSnackBar, setShowSnakBar] = useState(false);
    const [snackBarMessage, setSnakBarMessage] = useState('');
    const [confirmSave, setConfirmSave] = useState(false);

    const navigation = useNavigation();
    useLayoutEffect(() => {
        const title = useCategoryStore.getState().categoryTab?.label ?? labels.writeBook
        navigation.setOptions({
            title: title ?? '',
            headerTitleAlign: 'center',
            headerLeft: () => (
                <TouchableOpacity onPress={() => router.back()}>
                <FontAwesome5 name="arrow-left" size={18} color="black" />
                </TouchableOpacity>
            ),
        });
    }, [navigation, useCategoryStore.getState().categoryTab]);

    useEffect(() => {
        const loadSingleFullBook = async () => {
            if (bookuuid) {
                const response = await fetch('https://api.bookspointer.com/book', {
                    method: "POST",
                    body: JSON.stringify({ uuid: bookuuid }),
                });
                const data = await response.json();
                setInitialContent(data.content)
                setId(data.id)
                setUuid(data.uuid)
                setCategoryData(data.category)
            }
        }
        
        loadSingleFullBook();        
    }, [bookuuid]);

    const updateContent = (content: string) => {
        setContent(content)
    }

    const saveQuote = async () => {
        const storedToken = await AsyncStorage.getItem('auth-token');
        const storageUser = await AsyncStorage.getItem('auth-user');

        if (!storedToken || !storageUser) {
            alert(labels.pleaseLoginToContinue);
            return;
        }

        const category = useCategoryStore.getState().categoryTab;
        if (!category) {
            console.log('category not exists')
            return;
        } else {
            setCategoryData(category)
        }

        if ('' === content || content.length <= 0 || !categoryData) {
            console.log('content is empty or category is null')
            return;
        }

        const data = {
            id: id,
            uuid: uuid,
            title: 'quote-song-poem',
            category: !bookuuid ? category : categoryData,
            author: '-',
            content: content,
            estimatedReadTime: {words: 1, minutes: 1},
            seriesName: 'বইসমূহ',
            tags: [],
        }

        const response = await saveBook(data as any, storedToken);
        if (!response.status) {
            if ('Book already exists' === response.message) setSnakBarMessage(labels.bookCreate.bookExists)
            else setSnakBarMessage(response.message)
            setShowSnakBar(true)
        }

        if (response.status) {
            setSnakBarMessage(response.message)
            setShowSnakBar(true)
            useAuthStore.getState().setUser(JSON.parse(storageUser))

            setTimeout(() => {
                setContent('')
                setInitialContent('')
            }, 5000)
        }
    }

    return (
        <View style={styles.screen}>
            <View style={{height: 400, marginVertical: 10}}>
                <TextEditor initialContent={initialContent} onChange={updateContent} />
            </View>

            <View style={{marginTop: 50, marginBottom: 10}}>
                <TouchableOpacity onPress={saveQuote}>
                    <Text style={styles.saveButton}>{ labels.saveBook }</Text>
                </TouchableOpacity>

                <Snackbar
                    visible={showSnackBar}
                    onDismiss={() => setShowSnakBar(false)}
                    duration={3000}
                    action={{
                        label: labels.bookCreate.viewBook,
                        onPress: () => router.push("/screens/user/userProfile"),
                    }}
                >{snackBarMessage}</Snackbar>    
            </View>

            {/* <Dialog visible={confirmSave} message={'sdf'} onChange={saveQuote} /> */}
            <View style={{ height: 200 }}></View>
            
        </View>
    )
}

export default EthernelWord
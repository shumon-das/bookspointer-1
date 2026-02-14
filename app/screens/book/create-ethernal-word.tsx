import useCategoryStore from "@/app/store/categories";
import labels from "@/app/utils/labels";
import TextEditor from "@/components/micro/TextEditor";
import { saveBook } from "@/services/api";
import { styles } from "@/styles/writeBookScreen.styles";
import { FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { Snackbar } from "react-native-paper";
// import QuoteContent from "@/components/micro/QuoteContent";
// import { QuoteStyles } from "@/styles/quoteCard.styles";
// import quoteThemes from "@/app/utils/QuoteThemes";

const EthernelWord = ({ category }: { category: any }) => {
    const { bookuuid } = useLocalSearchParams();
    const [id, setId] = useState(null)
    const [uuid, setUuid] = useState(null)
    const [categoryData, setCategoryData] = useState(null as any)
    const [content, setContent] = useState('')
    const [initialContent, setInitialContent] = useState('')
    const [showSnackBar, setShowSnakBar] = useState(false);
    const [snackBarMessage, setSnakBarMessage] = useState('');
    // const randomThemeIndex = Math.floor(Math.random() * quoteThemes.length);

    const navigation = useNavigation();
    useLayoutEffect(() => {
        const title = category.label ?? ''
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
        setCategoryData(category)
    }, [bookuuid, category]);

    const updateContent = (content: string) => {
        setContent(content)
    }

    const saveQuote = async () => {
        const storedToken = await AsyncStorage.getItem('auth-token');
        const storageUser = await AsyncStorage.getItem('auth-user');

        if (!storedToken || !storageUser) {
            Alert.alert(labels.pleaseLoginToContinue);
            return;
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
            estimatedReadTime: { words: 1, minutes: 1 },
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

            setTimeout(() => {
                setContent('')
                setInitialContent('')
            }, 5000)
        }
    }

    return (
        <View style={styles.screen}>
            {/* <View className='postBody' style={[QuoteStyles.card, {backgroundColor: quoteThemes[randomThemeIndex].backgroundColor,}]}>
                <Text style={[QuoteStyles.quote, {color: quoteThemes[randomThemeIndex].textColor}]}>
                    { content ? <QuoteContent content={content} /> : '' }
                </Text>
            </View> */}
            <View style={{ height: 300, marginVertical: 10 }}>
                <TextEditor initialContent={initialContent} onChange={updateContent} />
            </View>

            <View style={{ marginTop: 50, marginBottom: 10 }}>
                <TouchableOpacity onPress={saveQuote}>
                    <Text style={styles.saveButton}>{labels.saveBook}</Text>
                </TouchableOpacity>

                <Snackbar
                    visible={showSnackBar}
                    onDismiss={() => setShowSnakBar(false)}
                    duration={3000}
                    action={{
                        label: labels.bookCreate.viewBook,
                        onPress: () => router.push("/screens/user/user-profile"),
                    }}
                >{snackBarMessage}</Snackbar>
            </View>

            <View style={{ height: 200 }}></View>

        </View>
    )
}

export default EthernelWord
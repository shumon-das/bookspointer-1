import { useCategoryStore } from "@/app/store/categories";
import { useTempStore } from "@/app/store/temporaryStore";
import { useUserStore } from "@/app/store/user";
import { labels } from "@/app/utils/labels";
import Dropdown from "@/components/micro/Dropdown";
import HtmlContent from "@/components/micro/HtmlContent";
import { Category } from "@/components/types/Category";
import { User } from "@/components/types/User";
import goToProfile from "@/helper/redirectToProfile";
import { saveBook } from "@/services/api";
import { styles } from "@/styles/writeBookScreen.styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from "react-native";
import { Snackbar, TextInput } from "react-native-paper";

const WriteBook = () => {
    const { bookuuid, id } = useLocalSearchParams();
    const router = useRouter()

    const navigation = useNavigation();
    useLayoutEffect(() => {
        navigation.setOptions({
            title: labels.writeBook,
            headerTitleAlign: 'center',
            headerStyle: {
                height: 100,
                backgroundColor: '#085a80',
            },
            headerTintColor: '#d4d4d4',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
            headerRight: () => (<></>),
        })
    })

    const [categories, setCategories] = React.useState(useCategoryStore((state) => state.categories));
    const [authors, setAuthors] = React.useState(useUserStore((state) => state.authors))

    const [title, setTitle] = React.useState('');
    const [category, setCategory] = React.useState<Category | null>(null);
    const [author, setAuthor] = React.useState<User | null>(null);
    const [content, setContent] = React.useState('');
    const [preview, setPreview] = useState(false)
    const [loading, setLoading] = useState(false)
    const [showSnackBar, setShowSnakBar] = useState(false);
    const [snackBarMessage, setSnakBarMessage] = useState('');

    useFocusEffect(
        useCallback(() => {
            setContent(useTempStore.getState().bookContent)
        }, [useTempStore.getState().bookContent])
    )

    useEffect(() => {
        const loadSingleFullBook = async () => {
            if (bookuuid) {
                setLoading(true)
                const response = await fetch('https://api.bookspointer.com/book', {
                    method: "POST",
                    body: JSON.stringify({ uuid: bookuuid }),
                });
                const data = await response.json();
                setTitle(data.title);
                setCategory(data.category)
                setAuthor(data.author)
                useTempStore.getState().setBookContent(data.content)
                setLoading(false)
            }
        }

        const loadCategories = async () => {
            if (categories.length <= 0) {
                const response = await fetch('https://api.bookspointer.com/categories');
                const data = await response.json();
                setCategories(data);
            }
        };

        const loadAuthors = async () => {
            if (authors.length <= 0) {
                const response = await fetch('https://api.bookspointer.com/authors', {
                    method: "POST",
                });
                const data = await response.json();
                setAuthors(data.authors);
            }
        };

        loadSingleFullBook();
        loadCategories();
        loadAuthors();
    }, [bookuuid, id]);

    const previewBook = async () => {
        const storageUser = await AsyncStorage.getItem('auth-user')
        const token = await AsyncStorage.getItem('auth-token')
        if (!storageUser || !token) {
            Alert.alert(labels.sorry, labels.pleaseLoginToContinue)
            return;
        }

        const data = {
            id: id,
            uuid: bookuuid,
            title: title,
            category: category,
            author: JSON.parse(storageUser),
            content: content,
            estimatedReadTime: { words: 1, minutes: 1 },
            seriesName: '',
            tags: [],
        } as any;

        setLoading(true)
        const response = await saveBook(data, token)
        setSnakBarMessage(response?.message)
        setShowSnakBar(true)

        if (response?.status) {
            useTempStore.getState().setBookContent('')
            setTimeout(() => {
                goToProfile(router, useTempStore)
            }, 3000);
        }
        setLoading(false)
    }

    return (
        <View style={{ flex: 1, marginHorizontal: 5 }}>
            <View style={{ marginHorizontal: 10, marginTop: 5 }}>
                {loading && <ActivityIndicator></ActivityIndicator>}
                {loading && <Text>{labels.loadingBook}</Text>}
            </View>
            <View style={styles.title}>
                <TextInput
                    style={styles.input}
                    onChangeText={(event) => setTitle(event)}
                    value={title}
                    placeholder={labels.bookTitle}
                />
                {preview && !title && <Text style={{ marginHorizontal: 10, color: 'red' }}>{labels.bookCreate.titleRequired}</Text>}
            </View>

            <View style={styles.category}>
                <Dropdown
                    selectedOption={category}
                    options={categories}
                    optionLabel="label"
                    placeholder={labels.selectCategory}
                    filterPlaceholder={labels.searchCategory}
                    onSelect={(item: any) => setCategory(item)}
                />
                {preview && !category && <Text style={{ color: 'red' }}>{labels.bookCreate.categoryRequired}</Text>}
            </View>

            <View style={{ height: 320 }}>
                <TouchableOpacity
                    style={{ height: 300, borderWidth: 1, borderColor: 'gray', borderRadius: 5, margin: 10 }}
                    onPress={() => router.push({
                        pathname: '/screens/book/write-screen',
                        params: { content: useTempStore.getState().bookContent?.substring(1, 10) }
                    })}
                >
                    {useTempStore.getState().bookContent.length > 0
                        ? <HtmlContent content={content} />
                        : <Text style={{ padding: 10, }}>{labels.startWriting}</Text>
                    }
                </TouchableOpacity>
                {preview && !content && <Text style={{ color: 'red' }}>{labels.bookCreate.contentRequired}</Text>}
            </View>

            <View style={{ marginTop: 50 }}>
                <TouchableOpacity onPress={previewBook}>
                    {!loading && <Text style={styles.saveButton}>{labels.saveBook}</Text>}
                    {loading && <ActivityIndicator style={styles.saveButton}></ActivityIndicator>}
                </TouchableOpacity>
            </View>

            <View style={{ height: 200 }}></View>
            <Snackbar visible={showSnackBar} onDismiss={() => setShowSnakBar(false)} duration={2000}>
              {snackBarMessage}
          </Snackbar>
        </View>
    );
}

export default WriteBook;

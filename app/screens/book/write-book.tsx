import Dropdown from "@/components/micro/Dropdown";
import { View, Text, TouchableOpacity, Switch, Alert } from "react-native";
import TextEditor from "@/components/micro/TextEditor";
import { TextInput } from "react-native-paper";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { labels } from "@/app/utils/labels";
import { styles } from "@/styles/writeBookScreen.styles";
import { useCategoryStore } from "@/app/store/categories";
import { useUserStore } from "@/app/store/user";
import { useLocalSearchParams, useNavigation } from 'expo-router'
import { Category } from "@/components/types/Category";
import { User } from "@/components/types/User";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { saveBook } from "@/services/api";
import useAuthStore from "@/app/store/auth";
import { useUseEffect } from "@/helper/setHeaderOptions";
import BookCardPreview from "@/components/BookCardPreview";

const WriteBook = () => {
    const {bookuuid} = useLocalSearchParams();
    const {user} = useAuthStore();
    
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
    const [category, setCategory] = React.useState<Category|null>(null);
    const [author, setAuthor] = React.useState<User|null>(null);
    // const [isSelfAuthor, setIsSelfAuthor] = React.useState(true);
    // const toggleSwitch = () => setIsSelfAuthor(previousState => !previousState);
    const [content, setContent] = React.useState('');
    const [initialContent, setInitialContent] = React.useState('');
    const [preview, setPreview] = useState(false)
    const [previewData, setPreviewData] = useState(null as any)    

    useEffect(() => {
        const loadSingleFullBook = async () => {
            if (bookuuid) {
                const response = await fetch('https://api.bookspointer.com/book', {
                    method: "POST",
                    body: JSON.stringify({ uuid: bookuuid }),
                });
                const data = await response.json();
                setTitle(data.title);
                setCategory(data.category)
                setAuthor(data.author)
                setInitialContent(data.content)
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
    }, [bookuuid]);

    const previewBook = async () => {
        const storageUser = await AsyncStorage.getItem('auth-user')
        if (!storageUser) {
            Alert.alert(labels.sorry, labels.pleaseLoginToContinue)
            return;
        }

        const data = {
            title: title,
            category: category,
            author: JSON.parse(storageUser),
            content: content,
            estimatedReadTime: {words: 1, minutes: 1},
            seriesName: '',
            tags: [],
        }
        setPreviewData(data)
        setPreview(true)
    }

    return preview && title && content && category ? (
        <BookCardPreview book={previewData} onBack={(value) => {
                setPreview(false)
                setInitialContent(content)
            }}
        />
    ) : (
        <View style={{flex: 1, marginHorizontal: 5}}>
            <View style={styles.title}>
                <TextInput
                    style={styles.input}
                    onChangeText={(event) => setTitle(event)}
                    value={title}
                    placeholder={labels.bookTitle}
                />
                {preview && !title && <Text style={{marginHorizontal: 10, color: 'red'}}>{labels.bookCreate.titleRequired}</Text>}
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
                {preview && !category && <Text style={{color: 'red'}}>{labels.bookCreate.categoryRequired}</Text>}
            </View>

            {/* <View style={styles.category}>
                <Dropdown
                    selectedOption={isSelfAuthor ? loggedInUser : author}
                    options={authors}
                    optionLabel="fullName"
                    placeholder={labels.selectAuthor}
                    filterPlaceholder={labels.searchAuthor}
                    onSelect={(item: any) => {
                        setIsSelfAuthor(false)
                        setAuthor(item)
                    }} 
                />
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Switch
                        trackColor={{false: '#767577', true: '#81b0ff'}}
                        thumbColor={isSelfAuthor ? '#f5dd4b' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={isSelfAuthor}
                    />
                    {isSelfAuthor && <Text>{labels.createBook.selfAuthor}</Text>}
                </View>
            </View> */}

            <View style={{height: 320}}>
                <TextEditor initialContent={initialContent} onChange={(content: string) => setContent(content)} />
                {preview && !content && <Text style={{color: 'red'}}>{labels.bookCreate.contentRequired}</Text>}
            </View>

            <View style={{marginTop: 50}}>
                <TouchableOpacity onPress={previewBook}>
                    <Text style={styles.saveButton}>{ labels.bookCreate.preview }</Text>
                </TouchableOpacity>
            </View>

            <View style={{ height: 200 }}></View>
            
        </View>
    );
}

export default WriteBook;

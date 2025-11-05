import Dropdown from "@/components/micro/Dropdown";
import { View, Text, TouchableOpacity } from "react-native";
import TextEditor from "@/components/micro/TextEditor";
import { TextInput } from "react-native-paper";
import React, { useEffect, useLayoutEffect } from "react";
import { labels } from "@/app/utils/labels";
import { styles } from "@/styles/writeBookScreen.styles";
import { useCategoryStore } from "@/app/store/categories";
import { useUserStore } from "@/app/store/user";
import { useLocalSearchParams, useNavigation } from 'expo-router'

const writeBook = () => {
    const {bookuuid} = useLocalSearchParams();

    const navigation = useNavigation();
    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (<></>),
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
    const [category, setCategory] = React.useState('');
    const [author, setAuthor] = React.useState('');
    const [content, setContent] = React.useState('');

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
                setContent(data.content)
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

    const saveBook = async () => {
        // $data['title'] = $title;
        // $data['content'] = $content;
        // $data['category']['id'] = 20;
        // $data['author']['id'] = $authorid;
        // $data["estimatedReadTime"] = ["words" => 0, "minutes" => 1];
        // $data['seriesName'] = '';
        // $data['tags'] = [];
    }

    return (
        <View style={styles.screen}>
            <View style={styles.title}>
                <TextInput
                    style={styles.input}
                    onChangeText={(event) => setTitle(event)}
                    value={title}
                    placeholder={labels.bookTitle}
                />
            </View>

            <View style={styles.category}>
                <Dropdown
                    selectedOption={category}
                    options={categories}
                    optionLabel="label"
                    placeholder={labels.selectCategory}
                    onSelect={(item: any) => setCategory(item)} 
                />
            </View>

            <View style={styles.category}>
                <Dropdown
                    selectedOption={author}
                    options={authors}
                    optionLabel="fullName"
                    placeholder={labels.selectAuthor}
                    onSelect={(item: any) => setAuthor(item)} 
                />
            </View>

            <View style={{height: 500}}>
                <TextEditor initialContent={content} onChange={(content: string) => setContent(content)} />
            </View>

            <View>
                <TouchableOpacity onPress={saveBook}>
                    <Text style={styles.saveButton}>{ labels.saveBook }</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default writeBook;

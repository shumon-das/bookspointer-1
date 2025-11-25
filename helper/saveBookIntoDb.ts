import labels from "@/app/utils/labels";
import { saveBook } from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
interface propsType {
    router: any, 
    value: {
        title: string, 
        category: object, 
        author: object, 
        content: string
    },
    onSave: (value: any) => any, 
}
export const saveBookDataIntoDb = async (props: propsType) => {
    const storageUser = await AsyncStorage.getItem('auth-user');
    const storedToken = await AsyncStorage.getItem('auth-token');
    if (!storedToken) {
        alert(labels.pleaseLoginToContinue);
        return;
    }

    const data = {
        title: props.value.title,
        category: props.value.category,
        author: props.value.author,
        content: props.value.content,
        estimatedReadTime: {words: 1, minutes: 1},
        seriesName: '',
        tags: [],
    }

    const response = await saveBook(data as any, storedToken);
    if (!response.status) {
        props.onSave(response)
        // if ('Book already exists' === response.message) setSaveError(labels.bookCreate.bookExists)
        // else setSaveError(response.message)
        // setTimeout(() => setSaveError(null), 5000)
    }

    if (response.status && storageUser) {
        // useAuthStore.getState().setUser(JSON.parse(storageUser))
        // router.push("/screens/user/userProfile");
    }
}


export default {
    saveBookDataIntoDb
}
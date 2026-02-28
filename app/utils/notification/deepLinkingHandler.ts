import { Router } from "expo-router";
import API_CONFIG from "../config";
import { useBookDetailsStore } from "@/app/store/bookDetailsStore";

export const handleDeepLinking = async (path: string, queryParams: any, router: Router) => {
    console.log("deep linking", path, queryParams)
    const categoryPaths = Object.values(CATEGORIES_TYPE);
    if (categoryPaths.some(cat => path.startsWith(cat))) {
        const book = await fetchFullBookByUrl(path);
        router.push({
            pathname: "/screens/book/details",
            params: { id: book.uuid, title: book.title, author: book.author.fullName },
        });
    } else if (path.startsWith(USER_TYPE.USER)) {
        router.push({
            pathname: "/screens/user/visit-user",
            params: { uuid: path.split('/')[2] },
        });
    } else if (path.startsWith(USER_TYPE.AUTHOR)) {
        const author = await fetchFullAuthorByUrl(path);
        router.push({
            pathname: "/screens/author/author-profile",
            params: { authorUuid: author.uuid },
        });
    } else {
        router.push('/(tabs)');
    }
}

const CATEGORIES_TYPE = {
    BOOK: '/book/',
    AUTHOR: '/author/',
    HISTORY: '/history/',
    JOKES: '/jokes/',
    NOVEL: '/novel/',
    THRILLER: '/thriller/',
    SHORTSTORY: '/short-story/',
    TRAVEL: '/travel/',
    MORAL: '/moral/',
    ETHERNELWORD: '/eternal-word/',
    SCIENCEFICTION: '/science-fiction/',
    RELIGIOUS: '/religious/',
    THAKURMARJHULI: '/thakurmar-jhuli/',
    POETRY: '/poetry/',
    ARTICLES: '/articles/',
    JUVENILELITERATURE: '/juvenile-literature/',
    MOTIVATIONAL: '/motivational/',
    DRAMA: '/drama/',
    SONG: '/song/',
    DETECTIVE: '/detective/',
    HORROR: '/horror/',
    UNCATEGORIZED: '/uncategorized/',
    AUTOBIGROPHY: '/autobiography/',
}

const USER_TYPE = {
    USER: '/user/',
    AUTHOR: '/author/',
}

const fetchFullBookByUrl = async (url: string) => {
    const response = await fetch(`${API_CONFIG.BASE_URL}/book/${url}`);
    const data = await response.json();
    useBookDetailsStore.getState().setSelectedBook(data);
    return data;
}

const fetchFullAuthorByUrl = async (url: string) => {
    const response = await fetch(`${API_CONFIG.BASE_URL}${url}`);
    const data = await response.json();
    return data;
}
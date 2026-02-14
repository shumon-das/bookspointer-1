import { singleBook } from "@/services/api";
import * as FileSystem from 'expo-file-system';
import CryptoJS from 'react-native-crypto-js';
import * as SecureStore from 'expo-secure-store';


const BOOKS_DIR = FileSystem.documentDirectory + 'books/';
const secretKey = async () => await SecureStore.getItemAsync('book_secret_2026');

export const fetchNextPrevPageTexts = async (bookId: number, pageNumber: number, isFirstRequest: boolean) => {
    let prev = null
    if (pageNumber > 1) {
        prev = await singleBook({id: bookId, page: pageNumber - 1, firstRequest: isFirstRequest})
    }
    const next = await singleBook({id: bookId, page: pageNumber + 1, firstRequest: isFirstRequest})

    return {
        prevPageTexts: prev ? prev.text : '',
        nextPageTexts: next.text 
    }
}

export const ensureBooksDir = async () => {
  const dirInfo = await FileSystem.getInfoAsync(BOOKS_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(BOOKS_DIR, { intermediates: true });
  }
};


export const saveEncryptedBook = async (bookId: number,content: string) => {
    await ensureBooksDir();
    const secret = await secretKey()
    if (!secret) {
        console.log('No secret key found');
        return;
    }
    const encrypted = CryptoJS.AES.encrypt(content, secret).toString();

    const path = `${BOOKS_DIR}book_${bookId}.txt`;
    await FileSystem.writeAsStringAsync(path, encrypted);

    return path;
};

export const readEncryptedBook = async (bookId: number) => {
    const secret = await secretKey()
    if (!secret) {
        console.log('No secret key found');
        return;
    }
    const path = `${BOOKS_DIR}book_${bookId}.txt`;

    const encrypted = await FileSystem.readAsStringAsync(path);
    const bytes = CryptoJS.AES.decrypt(encrypted, secret);

    return bytes.toString(CryptoJS.enc.Utf8);
};


export const listDownloadedBooks = async () => {
  await ensureBooksDir();
  return await FileSystem.readDirectoryAsync(BOOKS_DIR);
};


export const isBookDownloaded = async (bookId: number) => {
  const filePath = `${BOOKS_DIR}book_${bookId}.txt`;
  const info = await FileSystem.getInfoAsync(filePath);
  return info.exists;
};

export const deleteBookFile = async (bookId: number) => {
  const filePath = `${BOOKS_DIR}book_${bookId}.txt`;
  const info = await FileSystem.getInfoAsync(filePath);

  if (info.exists) {
    await FileSystem.deleteAsync(filePath, { idempotent: true });
  }
};

export default { fetchNextPrevPageTexts }
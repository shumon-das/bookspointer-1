import * as FileSystem from 'expo-file-system';
import CryptoJS from 'react-native-crypto-js';


const SECRET_KEY = 'try_bp_your_super_secret_key'; // You can hardcode or generate securely

export async function encryptAndSaveBook(bookId: number, title: string, author: string, bookContent: string) {
  try {
    const chunkSize = 10000;
    const chunks = [];

    for (let i = 0; i < bookContent.length; i += chunkSize) {
      const chunk = bookContent.slice(i, i + chunkSize);
      const encryptedChunk = CryptoJS.AES.encrypt(chunk, SECRET_KEY).toString();
      chunks.push(encryptedChunk);
    }

    const path = `${FileSystem.documentDirectory}${bookId}.${title.replace(/\s+/g, '_')}.${author.replace(/\s+/g, '_')}.book`;

    await FileSystem.writeAsStringAsync(path, JSON.stringify(chunks), {
      encoding: FileSystem.EncodingType.UTF8,
    });

    console.log('Book saved at:', path);
    return path;
  } catch (error) {
    console.error('Error saving book:', error);
    return null;
  }
}

export async function encryptedPagesNumbers(bookId: number, title: string, author: string) {
  const path = `${FileSystem.documentDirectory}${bookId}.${title.replace(/\s+/g, '_')}.${author.replace(/\s+/g, '_')}.book`;
    const encrypted = await FileSystem.readAsStringAsync(path, {
      encoding: FileSystem.EncodingType.UTF8,
    });

  return JSON.parse(encrypted).length;
}

export async function decryptBook(bookId: number, title: string, author: string, pageNumber=0) {
  try {
    const path = `${FileSystem.documentDirectory}${bookId}.${title.replace(/\s+/g, '_')}.${author.replace(/\s+/g, '_')}.book`;
    const encrypted = await FileSystem.readAsStringAsync(path, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    const encryptedChunks = JSON.parse(encrypted); // array of encrypted strings
    const bytes = CryptoJS.AES.decrypt(encryptedChunks[pageNumber], SECRET_KEY);
    const originalText = bytes.toString(CryptoJS.enc.Utf8)
    return originalText;
  } catch (error) {
    console.error('Error reading book:', error);
    return null;
  }
}

export default {
  encryptAndSaveBook,
  decryptBook,
  encryptedPagesNumbers
};
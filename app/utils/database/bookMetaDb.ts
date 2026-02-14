import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('bookspointer.db');

export const createBookMetaTable = async () => {
    try {
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS book_meta (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            book_id INTEGER NOT NULL UNIQUE,
            uuid TEXT NOT NULL,
            title TEXT NOT NULL,
            author TEXT NOT NULL,
            category TEXT NOT NULL,
            active_page INTEGER NOT NULL,
            download_path TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          );
        `);
        console.log('✅ Table verified/created');
    } catch (error) {
        console.error('Table creation error', error);
    }
}

export const insertBookMeta = async (bookId: number, uuid: string, title: string, author: string, category: string, activePage: number, downloadPath: string) => {
    try {
        await db.runAsync(`
          INSERT INTO book_meta (book_id, uuid, title, author, category, active_page, download_path)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [bookId, uuid, title, author, category, activePage, downloadPath]);
        console.log('✅ Book meta inserted');
        const savedMeta = await getBookMeta(bookId);
        return savedMeta;
    } catch (error) {
        console.error('Book meta insertion error', error);
    }
}

export const updateActivePage = async (bookId: number, activePage: number) => {
    try {
        await db.runAsync(`UPDATE book_meta SET active_page = ? WHERE book_id = ?`, [activePage, bookId]);
        console.log('✅ Book meta updated');
    } catch (error) {
        console.error('Book meta update error', error);
    }
}

export const getBookMeta = async (bookId: number) => {
    try {
        const result = await db.getAllAsync(`SELECT * FROM book_meta WHERE book_id = ?`, [bookId]);
        return result;
    } catch (error) {
        console.error('Error fetching book meta:', error);
        return null;
    }
}

export const deleteBookMeta = async (bookId: number) => {
    try {
        await db.runAsync(`DELETE FROM book_meta WHERE book_id = ?`, [bookId]);
        console.log('✅ Book meta deleted');
    } catch (error) {
        console.error('Error deleting book meta:', error);
    }
}

export const getDownloadedBooksMetaList = async () => {
    try {
        const result = await db.getAllAsync(`SELECT * FROM book_meta`);
        return result;
    } catch (error) {
        console.error('Error fetching downloaded books:', error);
        return [];
    }
}
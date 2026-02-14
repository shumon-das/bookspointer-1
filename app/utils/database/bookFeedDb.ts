import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('bookspointer.db');

export const createFeedBooksTable = async () => {
    try {
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS feed_books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            book_id INTEGER NOT NULL UNIQUE,
            uuid TEXT NOT NULL,
            title TEXT NOT NULL,
            author TEXT NOT NULL,
            book_data TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          );
        `);
        console.log('✅ Table verified/created');
    } catch (error) {
        console.error('Table creation error', error);
    }
}

export const replaceFeedBooksCache = async (books: any[]) => {
    if (!books.length) return;

    try {
        // insert or replace newest books
        for (const book of books) {
            await db.runAsync(
                `INSERT OR REPLACE INTO feed_books
                (book_id, uuid, title, author, book_data, created_at)
                VALUES (?, ?, ?, ?, ?, ?)`,
                [
                book.id,
                book.uuid,
                book.title,
                book.author,
                JSON.stringify(book),
                Date.now(),
                ]
            );
        }

        // trim old records (keep latest 100)
        await db.runAsync(`
            DELETE FROM feed_books
            WHERE id NOT IN (
                SELECT id FROM feed_books
                ORDER BY created_at DESC
                LIMIT 100
            )
        `);

        console.log(`Synced ${books.length} paginated feed books`);
    } catch (e) {
        console.error("Paginated feed insert failed", e);
    }
}

export const getAllFeedBooks = async () => {
    const result = await db.getAllAsync<{ book_data: string }>(
        `SELECT book_data FROM feed_books ORDER BY created_at DESC LIMIT 100`
    );
    return result.map(row => JSON.parse(row.book_data));
}

export const inserSingleFeedBook = async (book: any) => {
    try {
        await db.runAsync(
            `INSERT OR REPLACE INTO feed_books (book_id, uuid, title, author, book_data, created_at)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [book.id, book.uuid, book.title, book.author, JSON.stringify(book), Date.now()]
        );
    } catch (e) {
        console.error('Insert transaction failed', e);
        throw e;
    }
}

export const getCountFeedBooks = async () => {
    const result = await db.getAllAsync<{ count: number }>(`SELECT COUNT(*) as count FROM feed_books`);
    return result[0]?.count ?? 0;
}

export const getBookIdsOnly = async () => {
    const result = await db.getAllAsync<{ book_id: number }>(`SELECT book_id FROM feed_books`);
    return result.map(row => row.book_id);
}

export const deleteAllFeedBooks = async () => {
    await db.runAsync(`DELETE FROM feed_books`);
}
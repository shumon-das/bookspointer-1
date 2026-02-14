import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('bookspointer.db');

export const createTable = async () => {
    try {
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL UNIQUE,
            uuid TEXT NOT NULL,
            full_name TEXT NOT NULL,
            user_data TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          );
        `);
        console.log('✅ Table verified/created');
    } catch (error) {
        console.error('Table creation error', error);
    }
}

export const inserSingleUser = async (user: any) => {
    try {
        await db.runAsync(
            `INSERT OR REPLACE INTO users (user_id, uuid, full_name, user_data, created_at)
             VALUES (?, ?, ?, ?, ?)`,
            [user.id, user.uuid, user.fullName, JSON.stringify(user), Date.now()]
        );
    } catch (e) {
        console.error('Insert transaction failed', e);
        throw e;
    }
}

export const insertAllUsers = async (users: any[]) => {
    try {
        // await db.withTransactionAsync(async () => {
            for (const user of users) {
                await db.runAsync(
                    `INSERT OR REPLACE INTO users (user_id, uuid, full_name, user_data, created_at)
                     VALUES (?, ?, ?, ?, ?)`,
                    [user.id, user.uuid, user.fullName, JSON.stringify(user), Date.now()]
                );
            }
        // });
        console.log(`Successfully synced ${users.length} users`);
    } catch (e) {
        console.error('Insert transaction failed', e);
        throw e;
    }
}

export const getAllUsersCount = async () => {
  const result = await db.getAllAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM users'
  );

  console.log('count..', result);

  return result[0]?.count ?? 0;
}

export const getAllUsersIds = async () => {
  const result = await db.getAllAsync<{ user_id: number }>(
    'SELECT user_id FROM users'
  );
  
  // This converts [{user_id: 1}] to [1]
  return result.map(row => row.user_id); 
}

export const getAllAuthors = async () => {
  const result = await db.getAllAsync<{ user_data: string }>(
    'SELECT user_data FROM users'
  );
  
  let authors: any[] = [];
  result.map(row => {
    const user = JSON.parse(row.user_data)
    if (user.authorBookCount > 0) {
        authors.push(user);
    } 
  });

  return authors;
}

export const deleteAllUsers = async () => {
    try {
        await db.execAsync('DELETE FROM users');
        console.log('✅ All users deleted');
    } catch (error) {
        console.error('Delete transaction failed', error);
        throw error;
    }
}

export const getUserByIdFromSqlite = async (id: number) => {
    const result = await db.getAllAsync<{ user_data: string }>(`SELECT user_data FROM users WHERE user_id = ?`, [id]);
    if (result.length === 0) {
        return null;
    }
    return JSON.parse(result[0].user_data);
}

export const insertAuthUser = async (data: any) => {
    try {
        await db.runAsync(
            `INSERT OR REPLACE INTO users (user_id, uuid, full_name, user_data, created_at)
             VALUES (?, ?, ?, ?, ?)`,
            [data.id, data.uuid, data.fullName, JSON.stringify(data), Date.now()]
        );
    } catch (e) {
        console.error('Insert transaction failed', e);
        throw e;
    }
}

export const updateAuthUser = async (data: any) => {
    try {
        await db.runAsync(
            `INSERT OR REPLACE INTO users (user_id, uuid, full_name, user_data, created_at)
             VALUES (?, ?, ?, ?, ?)`,
            [data.id, data.uuid, data.fullName, JSON.stringify(data), Date.now()]
        );
    } catch (e) {
        console.error('Update transaction failed', e);
        throw e;
    }
}

export const getAuthUser = async () => {
  const storageUser = await AsyncStorage.getItem('auth-user');
  if (!storageUser) {
    return null;
  }
  
  const data = JSON.parse(storageUser);
    const result = await db.getAllAsync<{ user_data: string }>(`SELECT user_data FROM users WHERE user_id = ?`, [data.id]);
    if (result.length === 0) {
        return null;
    }
    return JSON.parse(result[0].user_data);
}

import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseSync("books.db");

export async function run(sql: string, params: any[] = []) {
  return db.runAsync(sql, params);
}

export async function getAll(sql: string, params: any[] = []) {
  return db.getAllAsync(sql, params);
}

export async function getOne(sql: string, params: any[] = []) {
  return db.getFirstAsync(sql, params);
}

import { run } from "./db";

export async function initTables() {
  await run(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      book_id TEXT UNIQUE,
      title TEXT,
      author TEXT,
      meta TEXT,
      created_at INTEGER
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS chunks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      book_id TEXT,
      chunk_index INTEGER,
      text TEXT,
      UNIQUE(book_id, chunk_index)
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS reads (
      book_id TEXT PRIMARY KEY,
      chunk_index INTEGER,
      timestamp INTEGER
    )
  `);

  await run(`CREATE INDEX IF NOT EXISTS idx_chunks ON chunks(book_id, chunk_index)`);
}

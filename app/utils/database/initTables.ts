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

  // await run(`
  //   CREATE TABLE IF NOT EXISTS reads (
  //     book_id TEXT PRIMARY KEY,
  //     chunk_index INTEGER,
  //     timestamp INTEGER
  //   )
  // `);

  await run(`
    CREATE TABLE IF NOT EXISTS appversion (
      app_version TEXT PRIMARY KEY,
      version_check_date TEXT,
      new_version TEXT,
      new_version_alert_label_message TEXT,
      new_version_alert_body_message TEXT,
      playstore_url TEXT,
      timestamp INTEGER
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      author TEXT,
      target INTEGER UNIQUE,
      read_duration TEXT,
      total_page INTEGER,
      active_page INTEGER,
      greater_readed_page INTEGER,
      browsing_time INTEGER,
      timestamp INTEGER
    )
  `);

  await run(`CREATE INDEX IF NOT EXISTS idx_chunks ON chunks(book_id, chunk_index)`);
}

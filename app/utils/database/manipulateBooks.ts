import { db, run, getOne, getAll } from "./db";

export async function makeChunks(bookContent: string) {
  const chunkSize = 10000;
  const chunks = [];

  for (let i = 0; i < bookContent.length; i += chunkSize) {
    const chunk = bookContent.slice(i, i + chunkSize);
    chunks.push(chunk);
  }

  return chunks;
}

export async function insertBook(bookId: string, title: string, author: string, chunks: string[]) {
  try {
    await run(
      `INSERT OR REPLACE INTO books (book_id, title, author, meta, created_at)
      VALUES (?, ?, ?, ?, ?)`,
      [bookId, title, author, "{}", Date.now()]
    );

    // remove old chunks
    await run(`DELETE FROM chunks WHERE book_id = ?`, [bookId]);

    // Insert chunks in a batch
    const stmt = await db.prepareAsync(
      `INSERT INTO chunks (book_id, chunk_index, text) VALUES (?, ?, ?)`
    );

    try {
      for (let i = 0; i < chunks.length; i++) {
        await stmt.executeAsync([bookId, i, chunks[i]]);
      }
    } finally {
      await stmt.finalizeAsync();
      console.log('Book Downloaded...')
    }
  } catch (e) {
    console.log("🔥 SQLite ERROR:", e);
  }
}

export async function getChunk(bookId: string, chunkIndex: number) {
  const row = await getOne(
    `SELECT text FROM chunks WHERE book_id = ? AND chunk_index = ?`,
    [bookId, chunkIndex]
  ) as any;
  return row ? row.text : null;
}

export async function getTotalChunks(bookId: string) {
  const row = await getOne(
    `SELECT COUNT(*) AS total FROM chunks WHERE book_id = ?`,
    [bookId]
  ) as any;
  return row?.total ?? 0;
}

export async function listBooks() {
  return getAll(`SELECT * FROM books ORDER BY created_at DESC`);
}

export async function deleteBook(bookId: string) {
  try {
    await run(`DELETE FROM chunks WHERE book_id = ?`, [bookId]);
    await run(`DELETE FROM books WHERE book_id = ?`, [bookId]);
  } catch (error) {
    console.log('Book delete failed ', error)
  }
}




import { db, run, getOne, getAll } from "./db";

export async function saveReadProgress(bookId: string, chunkIndex: number) {
    try {
    await run(
      `INSERT INTO reads (book_id, chunk_index, timestamp)
      VALUES (?, ?, ?)
      ON CONFLICT(book_id)
      DO UPDATE SET chunk_index = excluded.chunk_index, timestamp = excluded.timestamp`,
      [bookId, chunkIndex, Date.now()]
    );
    } catch (e) {
        console.log("🔥 SQLite ERROR:", e);
    }
}

export async function getLastReadProgress(bookId: string) {
  const row = await getOne(
    `SELECT chunk_index FROM reads WHERE book_id = ?`,
    [bookId]
  ) as any;
  return row?.chunk_index ?? 1; // default first page
}

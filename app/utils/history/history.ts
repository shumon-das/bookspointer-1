import { getAll, getOne, run } from "../database/db";
interface propType {
  title: string;
  author: string;
  target: number; 
  duration: string; 
  totalPage: number;
  activePage: number;
  greaterReadedPage: number;
  browsingTime: number;
}

export async function saveReadHistory(data: propType) {
    try {
      await run(
        `INSERT INTO history (
          title,
          author,
          target, 
          read_duration, 
          total_page, 
          active_page, 
          greater_readed_page, 
          browsing_time, 
          timestamp
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(target)
        DO UPDATE SET 
          read_duration = excluded.read_duration, 
          active_page = excluded.active_page, 
          greater_readed_page = excluded.greater_readed_page, 
          browsing_time = excluded.browsing_time,
          timestamp = excluded.timestamp`,
        [
          data.title, 
          data.author, 
          data.target, 
          data.duration, 
          data.totalPage, 
          data.activePage, 
          data.greaterReadedPage, 
          data.browsingTime, 
          Date.now()
        ]
      );
    } catch (e) {
        console.log("SQLite ERROR on saving HISTORY: ", e);
    }
}

export async function getLastReadProgress(bookId: string) {
  const row = await getOne(
    `SELECT active_page FROM history WHERE target = ?`,
    [bookId]
  ) as any;
  return row?.active_page ?? 1; // default first page
}

export const fetchHistories = async () => {
  const rows = await getAll(`SELECT * FROM history ORDER BY timestamp DESC`) as any;
  return rows ?? []; // default first page
}

export const deleteHistory = async (bookId: number) => {
  await run(`DELETE FROM history WHERE target = ?`, [bookId]);
}

export const deleteAllHistory = async () => {
  await run(`DELETE FROM history`);
}
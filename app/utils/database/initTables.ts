import { run } from "./db";

export async function initTables() {
  await run(`DROP TABLE IF EXISTS books;`);
  await run(`DROP TABLE IF EXISTS chunks;`);
  await run(`DROP TABLE IF EXISTS history;`);
  await run(`DROP TABLE IF EXISTS appversion;`);
  await run(`DROP TABLE IF EXISTS chunks;`);
}

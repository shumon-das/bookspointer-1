
export function startDuration() {
  const startTime = Date.now();
  return startTime;
}

export function stopDuration(startTime: number) {
  if (!startTime) return "00:00:00";

  const durationMs = Date.now() - startTime; // milliseconds
  const totalSeconds = Math.floor(durationMs / 1000);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Format to always have two digits: 00:00:00
  const formatted = [
    hours.toString().padStart(2, "0"),
    minutes.toString().padStart(2, "0"),
    seconds.toString().padStart(2, "0"),
  ].join(":");

  return formatted;
};

export default {startDuration, stopDuration}

// // 1. Capture the start time when the user opens the page
// const startTime = new Date(); 

// // ... user is browsing ...

// // 2. Capture the end time when the user leaves or closes the tab
// const endTime = new Date();

// // 3. Calculate the difference in milliseconds
// const durationMs = endTime - startTime;

// // 4. Convert milliseconds to seconds (Integer)
// const durationSeconds = Math.floor(durationMs / 1000);

// // 5. Format the dates for SQLite TEXT storage (ISO 8601)
// // toISOString() gives: 2023-12-18T10:23:44.000Z
// const formattedStart = startTime.toISOString();
// const formattedEnd = endTime.toISOString();

// console.log(`Started: ${formattedStart}`);
// console.log(`Duration: ${durationSeconds} seconds`);

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
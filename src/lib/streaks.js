import { todayISO, addDaysISO } from "./dates.js";

export const STREAK_MILESTONES = [7, 14, 21, 30, 50, 100];

function dayNumber(iso) {
  const [year, month, day] = iso.split("-").map(Number);
  return Math.floor(Date.UTC(year, month - 1, day) / 86400000);
}

/**
 * Derives streak info from a habit's check-in history.
 * `current` counts consecutive completed days up to today OR yesterday —
 * a habit completed every day through yesterday still shows its live
 * streak even before today's check-in happens, so it doesn't flash to 0
 * first thing in the morning.
 */
export function computeStreaks(checkIns) {
  const uniqueDates = [...new Set(checkIns)];

  if (uniqueDates.length === 0) {
    return { current: 0, best: 0 };
  }

  const checkedSet = new Set(uniqueDates);
  const today = todayISO();
  const yesterday = addDaysISO(today, -1);

  let cursor = checkedSet.has(today)
    ? today
    : checkedSet.has(yesterday)
      ? yesterday
      : null;

  let current = 0;
  while (cursor && checkedSet.has(cursor)) {
    current += 1;
    cursor = addDaysISO(cursor, -1);
  }

  const sortedDayNumbers = uniqueDates.map(dayNumber).sort((a, b) => a - b);
  let best = 1;
  let run = 1;
  for (let i = 1; i < sortedDayNumbers.length; i += 1) {
    run = sortedDayNumbers[i] === sortedDayNumbers[i - 1] + 1 ? run + 1 : 1;
    best = Math.max(best, run);
  }
  best = Math.max(best, current);

  return { current, best };
}

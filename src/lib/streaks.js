import { todayISO, addDaysISO } from "./dates.js";

export const STREAK_MILESTONES = [7, 14, 21, 30, 50, 100];

function dayNumber(iso) {
  const [year, month, day] = iso.split("-").map(Number);
  return Math.floor(Date.UTC(year, month - 1, day) / 86400000);
}

/** ISO date of the Monday starting the calendar week containing `iso`. */
export function mondayOf(iso) {
  const [year, month, day] = iso.split("-").map(Number);
  const jsDay = new Date(year, month - 1, day).getDay(); // 0=Sun..6=Sat
  const daysSinceMonday = (jsDay + 6) % 7;
  return addDaysISO(iso, -daysSinceMonday);
}

/**
 * Derives streak info from a daily habit's check-in history.
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

/**
 * Derives streak info for a weekly-frequency habit: a "streak" here counts
 * consecutive calendar weeks (Monday-start) that hit `target` completions,
 * mirroring computeStreaks' day-grace logic one level up — the current week
 * doesn't break the streak until it's actually over without meeting target.
 */
export function computeWeeklyStreaks(checkIns, target) {
  const uniqueDates = [...new Set(checkIns)];
  if (uniqueDates.length === 0) return { current: 0, best: 0 };

  const counts = new Map();
  uniqueDates.forEach((iso) => {
    const weekStart = mondayOf(iso);
    counts.set(weekStart, (counts.get(weekStart) ?? 0) + 1);
  });

  const meetsTarget = (weekStart) => (counts.get(weekStart) ?? 0) >= target;

  const thisWeekStart = mondayOf(todayISO());
  const lastWeekStart = addDaysISO(thisWeekStart, -7);

  let cursor = meetsTarget(thisWeekStart)
    ? thisWeekStart
    : meetsTarget(lastWeekStart)
      ? lastWeekStart
      : null;

  let current = 0;
  while (cursor && meetsTarget(cursor)) {
    current += 1;
    cursor = addDaysISO(cursor, -7);
  }

  const sortedWeeks = [...counts.keys()].sort();
  let best = 0;
  let run = 0;
  let prevWeek = null;
  for (const week of sortedWeeks) {
    if (!meetsTarget(week)) {
      run = 0;
      prevWeek = week;
      continue;
    }
    run = prevWeek && addDaysISO(prevWeek, 7) === week ? run + 1 : 1;
    best = Math.max(best, run);
    prevWeek = week;
  }
  best = Math.max(best, current);

  return { current, best };
}

/** Uniform {current, best, unit} regardless of the habit's frequency type. */
export function getStreakInfo(habit) {
  const frequency = habit.frequency ?? { type: "daily" };
  if (frequency.type === "weekly") {
    return { ...computeWeeklyStreaks(habit.checkIns, frequency.target), unit: "week" };
  }
  return { ...computeStreaks(habit.checkIns), unit: "day" };
}

/** Completions so far within the current Monday-start calendar week. */
export function countCurrentCalendarWeek(checkIns) {
  const checkedSet = new Set(checkIns);
  const today = todayISO();
  const weekStart = mondayOf(today);
  let count = 0;
  let cursor = weekStart;
  while (cursor <= today) {
    if (checkedSet.has(cursor)) count += 1;
    cursor = addDaysISO(cursor, 1);
  }
  return count;
}

/**
 * Lifetime completion rate. For daily habits: unique completed days over
 * days elapsed since creation. For weekly habits: completions over the
 * total expected (target * weeks elapsed), clamped to 100 in case an early
 * partial week is front-loaded above target.
 */
export function computeConsistency(checkIns, createdAt, frequency = { type: "daily" }) {
  const totalDays = dayNumber(todayISO()) - dayNumber(createdAt) + 1;
  if (totalDays <= 0) return 0;
  const completed = new Set(checkIns).size;

  if (frequency.type === "weekly") {
    const weeksElapsed = Math.max(1, Math.ceil(totalDays / 7));
    const expected = frequency.target * weeksElapsed;
    return expected <= 0 ? 0 : Math.min(100, Math.round((completed / expected) * 100));
  }

  return Math.round((completed / totalDays) * 100);
}

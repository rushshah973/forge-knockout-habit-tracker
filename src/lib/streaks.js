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

/**
 * Completions within [today+startOffset, today+endOffset] inclusive.
 * Offsets are day deltas from today (negative = past), e.g. (-6, 0) is a
 * rolling "last 7 days including today" window.
 */
export function countInRange(checkIns, startOffset, endOffset) {
  const checkedSet = new Set(checkIns);
  const today = todayISO();
  let count = 0;
  for (let offset = startOffset; offset <= endOffset; offset += 1) {
    if (checkedSet.has(addDaysISO(today, offset))) count += 1;
  }
  return count;
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

/**
 * Every completed run of consecutive days in the check-in history, most
 * recent first — a timeline of past streaks, not just current/best.
 * Single-day "runs" are filtered out as noise. Daily-habit oriented: for a
 * weekly habit, consecutive calendar days aren't the meaningful unit, so
 * this is only rendered for frequency.type === "daily".
 */
export function computeStreakHistory(checkIns) {
  const uniqueDates = [...new Set(checkIns)].sort();
  if (uniqueDates.length === 0) return [];

  const runs = [];
  let runStart = uniqueDates[0];
  let prev = uniqueDates[0];

  for (let i = 1; i < uniqueDates.length; i += 1) {
    const current = uniqueDates[i];
    if (dayNumber(current) !== dayNumber(prev) + 1) {
      runs.push({ start: runStart, end: prev, length: dayNumber(prev) - dayNumber(runStart) + 1 });
      runStart = current;
    }
    prev = current;
  }
  runs.push({ start: runStart, end: prev, length: dayNumber(prev) - dayNumber(runStart) + 1 });

  return runs.filter((run) => run.length >= 2).reverse();
}

/**
 * Daily completion rate (% of days checked) for a rolling window, plus the
 * same window immediately before it for a trend comparison, plus a
 * day-by-day 0/1 sparkline for the current window. Days before the habit
 * existed are excluded from the rate so a new habit isn't penalized for
 * not existing yet.
 */
export function computeCompletionTrend(checkIns, createdAt, windowDays = 14) {
  const checkedSet = new Set(checkIns);
  const today = todayISO();

  function rateFor(startOffset, endOffset) {
    let total = 0;
    let count = 0;
    for (let offset = startOffset; offset <= endOffset; offset += 1) {
      const iso = addDaysISO(today, offset);
      if (iso < createdAt) continue;
      total += 1;
      if (checkedSet.has(iso)) count += 1;
    }
    return total === 0 ? 0 : (count / total) * 100;
  }

  const currentRate = rateFor(-(windowDays - 1), 0);
  const previousRate = rateFor(-(windowDays * 2 - 1), -windowDays);

  const sparkline = [];
  for (let offset = -(windowDays - 1); offset <= 0; offset += 1) {
    sparkline.push(checkedSet.has(addDaysISO(today, offset)) ? 1 : 0);
  }

  return {
    currentRate: Math.round(currentRate),
    change: Math.round(currentRate - previousRate),
    sparkline,
  };
}

/**
 * True when a daily habit's streak just broke: it was on an active streak
 * through the day before yesterday, yesterday was missed, and today hasn't
 * been checked off yet either. Deliberately narrow — this flags the exact
 * "you just fell off" moment, not any long-abandoned habit.
 */
export function justBrokeStreak(checkIns) {
  const checkedSet = new Set(checkIns);
  const today = todayISO();
  const yesterday = addDaysISO(today, -1);
  const dayBeforeYesterday = addDaysISO(today, -2);
  return (
    !checkedSet.has(today) &&
    !checkedSet.has(yesterday) &&
    checkedSet.has(dayBeforeYesterday)
  );
}

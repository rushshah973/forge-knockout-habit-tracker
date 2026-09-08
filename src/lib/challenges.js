import { addDaysISO, todayISO } from "./dates.js";
import { mondayOf } from "./streaks.js";

function anyHabitDoneOn(habits, iso) {
  return habits.some((h) => h.checkIns.includes(iso));
}

function allHabitsDoneOn(habits, iso) {
  return habits.length > 0 && habits.every((h) => h.checkIns.includes(iso));
}

/**
 * Consecutive days (today or yesterday grace, mirroring the daily streak
 * grace period) where at least one habit was completed — a cross-habit
 * "did you show up at all today" streak.
 */
export function computeNoZeroDaysStreak(habits) {
  if (habits.length === 0) return 0;
  const today = todayISO();
  const yesterday = addDaysISO(today, -1);

  let cursor = anyHabitDoneOn(habits, today)
    ? today
    : anyHabitDoneOn(habits, yesterday)
      ? yesterday
      : null;

  let count = 0;
  while (cursor && anyHabitDoneOn(habits, cursor)) {
    count += 1;
    cursor = addDaysISO(cursor, -1);
  }
  return count;
}

/** Days this calendar week (Monday through today) where every habit was completed. */
export function computePerfectWeekDays(habits) {
  if (habits.length === 0) return 0;
  const today = todayISO();
  let count = 0;
  let cursor = mondayOf(today);
  while (cursor <= today) {
    if (allHabitsDoneOn(habits, cursor)) count += 1;
    cursor = addDaysISO(cursor, 1);
  }
  return count;
}

/**
 * Solo, client-only challenges — no participants/social features (that's
 * later, stretch social accountability). Progress is always derived live
 * from real habit data, never its own persisted state.
 */
export const CHALLENGES = [
  {
    id: "no-zero-days",
    name: "No-Zero-Days Challenge",
    length: 30,
    reward: "Consistency badge",
    compute: computeNoZeroDaysStreak,
  },
  {
    id: "perfect-week",
    name: "Perfect Week Challenge",
    length: 7,
    reward: "Perfect Week badge",
    compute: computePerfectWeekDays,
  },
];

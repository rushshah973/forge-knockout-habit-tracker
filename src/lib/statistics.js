import { addDaysISO, todayISO } from "./dates.js";
import { getStreakInfo } from "./streaks.js";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function computeOverallStats(habits) {
  const totalHabits = habits.length;
  const totalCheckIns = habits.reduce((sum, h) => sum + new Set(h.checkIns).size, 0);
  const bestStreakEver = habits.reduce((max, h) => Math.max(max, getStreakInfo(h).best), 0);
  const activeStreaks = habits.filter((h) => getStreakInfo(h).current > 0).length;
  return { totalHabits, totalCheckIns, bestStreakEver, activeStreaks };
}

/** Habits completed per day for the last 7 days (today back to 6 days ago). */
export function computeWeeklyCompletion(habits) {
  const today = todayISO();
  const days = [];
  for (let offset = -6; offset <= 0; offset += 1) {
    const iso = addDaysISO(today, offset);
    const weekday = new Date(`${iso}T00:00:00`).getDay();
    const count = habits.filter((h) => h.checkIns.includes(iso)).length;
    const percent = habits.length === 0 ? 0 : Math.round((count / habits.length) * 100);
    days.push({ iso, label: WEEKDAY_LABELS[weekday], count, percent, isToday: offset === 0 });
  }
  return days;
}

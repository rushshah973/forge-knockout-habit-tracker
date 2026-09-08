import { getStreakInfo } from "./streaks.js";
import { computePerfectWeekDays } from "./challenges.js";

const XP_PER_COMPLETION = 10;
const XP_PER_BEST_STREAK_DAY = 2;
const XP_PER_LEVEL = 100;

function totalCompletions(habits) {
  return habits.reduce((sum, h) => sum + new Set(h.checkIns).size, 0);
}

/**
 * Simple, documented XP formula — a gamification/product metric, not a
 * scientific one. 10 XP per unique completion across all habits, plus 2 XP
 * per day of each habit's best-ever streak (rewards consistency depth, not
 * just raw check-in volume).
 */
export function computeXP(habits) {
  const completions = totalCompletions(habits);
  const streakBonus = habits.reduce(
    (sum, h) => sum + getStreakInfo(h).best * XP_PER_BEST_STREAK_DAY,
    0,
  );
  return completions * XP_PER_COMPLETION + streakBonus;
}

/** Level 1 starts at 0 XP; every XP_PER_LEVEL XP earns another level. */
export function computeLevel(xp) {
  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const xpIntoLevel = xp % XP_PER_LEVEL;
  return { level, xpIntoLevel, xpForNextLevel: XP_PER_LEVEL };
}

const ACHIEVEMENTS = [
  {
    id: "first-habit",
    icon: "🌱",
    name: "First Habit Built",
    isUnlocked: (habits) => habits.length >= 1,
  },
  {
    id: "first-7-day-streak",
    icon: "🔥",
    name: "First 7-Day Streak",
    isUnlocked: (habits) => habits.some((h) => getStreakInfo(h).best >= 7),
  },
  {
    id: "recovery-master",
    icon: "🔁",
    name: "Recovery Master",
    isUnlocked: (habits) =>
      habits.some((h) => {
        const { current, best } = getStreakInfo(h);
        return best > current && current >= 1;
      }),
  },
  {
    id: "perfect-week",
    icon: "⚡",
    name: "Perfect Week",
    isUnlocked: (habits) => computePerfectWeekDays(habits) >= 7,
  },
  {
    id: "30-completed",
    icon: "🏆",
    name: "30 Habits Completed",
    isUnlocked: (habits) => totalCompletions(habits) >= 30,
  },
  {
    id: "100-checkins",
    icon: "💯",
    name: "100 Check-ins",
    isUnlocked: (habits) => totalCompletions(habits) >= 100,
  },
];

/** Computed live from habit data every render — nothing extra to persist. */
export function computeAchievements(habits) {
  return ACHIEVEMENTS.map((a) => ({
    id: a.id,
    icon: a.icon,
    name: a.name,
    unlocked: a.isUnlocked(habits),
  }));
}

import { countInRange, getStreakInfo, justBrokeStreak } from "./streaks.js";

const WINDOW_DAYS = 7;
const STREAK_CAP = 14; // normalization ceiling, not a real limit
const TREND_CAP = 10; // max points the trend can move the score
const RECOVERY_PENALTY = 5;

function average(nums) {
  return nums.length === 0 ? 0 : nums.reduce((sum, n) => sum + n, 0) / nums.length;
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function expectedInWindow(habit) {
  const frequency = habit.frequency ?? { type: "daily" };
  return frequency.type === "weekly" ? frequency.target : WINDOW_DAYS;
}

function adherenceRatio(habit, startOffset, endOffset) {
  const expected = expectedInWindow(habit);
  if (expected <= 0) return 0;
  const actual = countInRange(habit.checkIns, startOffset, endOffset);
  return Math.min(1, actual / expected);
}

/**
 * A single 0-100 "momentum" score meant to feel motivating at a glance —
 * this is a product metric for the dashboard, not a scientific measure of
 * anything. It blends, across all habits:
 *
 *  - completion rate (60%): how much of what you expected of yourself this
 *    week actually got done, frequency-aware (daily expects 7, a 3x/week
 *    habit expects 3)
 *  - streak strength (40%): current streaks normalized against a rough
 *    "solid habit" ceiling (STREAK_CAP)
 *  - trend (±10 pts): this week's completion rate vs last week's — reward
 *    improving, penalize declining
 *  - recovery (-5 pts each): a small nudge down per daily habit currently
 *    sitting in a freshly-broken, not-yet-restarted state
 *
 * Returns null when there are no habits yet — nothing to score.
 */
export function computeMomentum(habits) {
  if (habits.length === 0) return null;

  const thisWeekRate = average(habits.map((h) => adherenceRatio(h, -6, 0))) * 100;
  const lastWeekRate = average(habits.map((h) => adherenceRatio(h, -13, -7))) * 100;
  const streakScore =
    average(habits.map((h) => Math.min(1, getStreakInfo(h).current / STREAK_CAP))) * 100;

  const trend = clamp(thisWeekRate - lastWeekRate, -TREND_CAP, TREND_CAP);

  const recoveryPenalty =
    habits.filter(
      (h) => (h.frequency?.type ?? "daily") === "daily" && justBrokeStreak(h.checkIns),
    ).length * RECOVERY_PENALTY;

  const base = thisWeekRate * 0.6 + streakScore * 0.4;
  const score = Math.round(clamp(base + trend - recoveryPenalty, 0, 100));

  return { score, trend: Math.round(trend) };
}

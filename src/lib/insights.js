import { addDaysISO, todayISO } from "./dates.js";
import { getStreakInfo } from "./streaks.js";

const LOOKBACK_DAYS = 28; // ~4 weeks, enough sample without needing long history

function isWeekend(iso) {
  const day = new Date(`${iso}T00:00:00`).getDay();
  return day === 0 || day === 6;
}

function recentDates() {
  const today = todayISO();
  const dates = [];
  for (let offset = -(LOOKBACK_DAYS - 1); offset <= 0; offset += 1) {
    dates.push(addDaysISO(today, offset));
  }
  return dates;
}

function completionRate(habits, dateList) {
  if (dateList.length === 0 || habits.length === 0) return 0;
  let done = 0;
  dateList.forEach((iso) => {
    habits.forEach((h) => {
      if (h.checkIns.includes(iso)) done += 1;
    });
  });
  return done / (dateList.length * habits.length);
}

/**
 * Rule-based, fully deterministic insights derived from real habit data —
 * no external API call, no chatbot. Each rule below is a plain JS
 * condition over the same data already shown elsewhere in the app.
 */
export function computeInsights(habits) {
  const insights = [];
  if (habits.length === 0) return insights;

  const dates = recentDates();
  const weekdayRate = completionRate(
    habits,
    dates.filter((d) => !isWeekend(d)),
  );
  const weekendRate = completionRate(
    habits,
    dates.filter((d) => isWeekend(d)),
  );
  const diff = Math.round(Math.abs(weekdayRate - weekendRate) * 100);

  if (diff >= 10) {
    insights.push(
      weekdayRate > weekendRate
        ? `You're ${diff}% more consistent on weekdays than weekends.`
        : `You're ${diff}% more consistent on weekends than weekdays.`,
    );
  }

  const strongest = habits.reduce((top, h) => {
    const { current } = getStreakInfo(h);
    return current > (top?.current ?? -1) ? { name: h.name, current } : top;
  }, null);
  if (strongest && strongest.current > 0) {
    insights.push(
      `"${strongest.name}" is your strongest habit right now, with a ${strongest.current}-day streak.`,
    );
  }

  const stalled = habits.find(
    (h) => getStreakInfo(h).current === 0 && h.checkIns.length > 0,
  );
  if (stalled) {
    insights.push(
      `"${stalled.name}" hasn't been checked off in a while — a small restart could help.`,
    );
  }

  if (insights.length === 0) {
    insights.push("Keep checking in daily to unlock personalized insights.");
  }

  return insights;
}

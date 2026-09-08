import { addDaysISO, todayISO } from "./dates.js";
import { saveHabits } from "./storage.js";

function daysAgo(n) {
  return addDaysISO(todayISO(), -n);
}

/** ISO dates for every offset in [from..to] (both "days ago", from >= to), skipping any offset listed in `skip`. */
function span(from, to, skip = []) {
  const dates = [];
  for (let n = from; n >= to; n -= 1) {
    if (skip.includes(n)) continue;
    dates.push(daysAgo(n));
  }
  return dates;
}

/**
 * A realistic, multi-week demo dataset covering every feature: strong
 * long-running streaks, a habit one day short of a 7-day milestone (for a
 * live celebration), a habit mid-recovery from a broken streak, a mix of
 * daily/weekly frequency, and enough total volume to unlock most
 * achievements. Deliberately not "everything at 100%" — a couple of gaps
 * and one locked achievement keep it honest.
 */
export function buildDemoHabits() {
  return [
    {
      id: "demo-water",
      name: "Drink water",
      createdAt: daysAgo(30),
      frequency: { type: "daily" },
      // long solid history with a couple of realistic gaps, ending in a
      // strong ongoing streak (current run: day 12 ago through today)
      checkIns: span(29, 0, [25, 19]),
    },
    {
      id: "demo-read",
      name: "Read 20 pages",
      createdAt: daysAgo(24),
      frequency: { type: "daily" },
      // solid older history, then exactly 6 consecutive days ending
      // yesterday — checking it off today crosses the 7-day milestone live
      checkIns: [...span(23, 8, [15]), ...span(6, 1, [])],
    },
    {
      id: "demo-meditation",
      name: "Morning meditation",
      createdAt: daysAgo(20),
      frequency: { type: "daily" },
      // a strong stretch, then missed yesterday and today — shows the
      // Recovery card on load; checking it off today restarts the streak
      checkIns: span(19, 2, [11]),
    },
    {
      id: "demo-gym",
      name: "Gym workout",
      createdAt: daysAgo(21),
      frequency: { type: "weekly", target: 3 },
      checkIns: [
        daysAgo(20),
        daysAgo(18),
        daysAgo(16),
        daysAgo(13),
        daysAgo(11),
        daysAgo(9),
        daysAgo(6),
        daysAgo(4),
        daysAgo(2),
        daysAgo(0),
      ],
    },
    {
      id: "demo-journal",
      name: "Journal",
      createdAt: daysAgo(18),
      frequency: { type: "daily" },
      // an early stretch longer than the current one (best > current) —
      // unlocks Recovery Master — then a mid gap, then an active run
      // through today
      checkIns: [...span(17, 10, []), ...span(5, 0, [])],
    },
    {
      id: "demo-sugar",
      name: "No sugar",
      createdAt: daysAgo(15),
      frequency: { type: "weekly", target: 4 },
      checkIns: [
        daysAgo(14),
        daysAgo(12),
        daysAgo(11),
        daysAgo(9),
        daysAgo(7),
        daysAgo(6),
        daysAgo(4),
        daysAgo(2),
        daysAgo(1),
        daysAgo(0),
      ],
    },
  ];
}

/** Writes the demo dataset to storage and reloads so App.jsx re-reads it. */
export function seedDemoData() {
  saveHabits(buildDemoHabits());
  window.location.reload();
}

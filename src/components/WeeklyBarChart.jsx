import { computeWeeklyCompletion } from "../lib/statistics.js";

// Single-hue magnitude chart (sequential, not categorical) — bar height alone
// encodes the count, but the count is also printed directly above every bar
// and "today" is marked with an outline ring, not a color swap, so nothing
// here depends on color perception to be readable.
export default function WeeklyBarChart({ habits }) {
  const days = computeWeeklyCompletion(habits);
  const max = Math.max(1, ...days.map((d) => d.count));

  return (
    <div className="bar-chart" role="img" aria-label="Habits completed over the last 7 days">
      {days.map((day) => (
        <div key={day.iso} className="bar-chart-col">
          <span className="bar-chart-value">{day.count}</span>
          <div className="bar-chart-track">
            <div
              className={
                day.isToday ? "bar-chart-bar bar-chart-bar-today" : "bar-chart-bar"
              }
              style={{ height: `${Math.max(6, (day.count / max) * 100)}%` }}
              title={`${day.label}: ${day.count} habit${day.count === 1 ? "" : "s"} completed`}
            />
          </div>
          <span className="bar-chart-label">{day.label}</span>
        </div>
      ))}
    </div>
  );
}

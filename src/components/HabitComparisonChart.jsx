import { getHabitColor, getHabitIcon } from "../lib/habitVisuals.js";
import { getStreakInfo } from "../lib/streaks.js";

// Categorical chart (identity = habit). The pastel palette alone doesn't
// clear strict colorblind-separation checks for adjacent hues, so every bar
// is always direct-labeled with the habit's name and value in plain text
// (never colored text) plus an outline stroke on the fill — identity never
// depends on color alone.
export default function HabitComparisonChart({ habits }) {
  const max = Math.max(1, ...habits.map((h) => getStreakInfo(h).current));

  return (
    <div className="compare-chart" role="img" aria-label="Current streak by habit">
      {habits.map((habit) => {
        const { current, unit } = getStreakInfo(habit);
        const color = getHabitColor(habit);
        const icon = getHabitIcon(habit);
        const percent = Math.max(4, (current / max) * 100);

        return (
          <div key={habit.id} className="compare-row">
            <span className="compare-row-icon" aria-hidden="true">
              {icon}
            </span>
            <span className="compare-row-label">{habit.name}</span>
            <div className="compare-row-track">
              <div
                className="compare-row-bar"
                style={{ width: `${percent}%`, "--habit-accent": `var(--${color})` }}
              />
            </div>
            <span className="compare-row-value">
              {current}
              {unit === "week" ? "w" : "d"}
            </span>
          </div>
        );
      })}
    </div>
  );
}

import { todayISO } from "../lib/dates.js";
import { countCurrentCalendarWeek, getStreakInfo } from "../lib/streaks.js";

const SHAPES = ["circle", "blob-a", "pill", "blob-b", "star"];
const COLORS = ["pink", "lavender", "green", "blue", "yellow"];

export default function DailyHighlights({ habits }) {
  if (habits.length === 0) return null;

  return (
    <section className="daily-highlights" aria-label="Daily highlights">
      <h2 className="text-h3 daily-highlights-title">Daily Highlights</h2>
      <div className="daily-highlights-row">
        {habits.map((habit, index) => {
          const frequency = habit.frequency ?? { type: "daily" };
          const { current } = getStreakInfo(habit);
          const stat =
            frequency.type === "weekly"
              ? `${countCurrentCalendarWeek(habit.checkIns)}/${frequency.target}`
              : current > 0
                ? `🔥 ${current}`
                : "Not yet";

          const shape = SHAPES[index % SHAPES.length];
          const color = COLORS[index % COLORS.length];

          return (
            <div
              key={habit.id}
              className={`highlight-shape highlight-shape-${shape} highlight-color-${color}`}
            >
              <span className="highlight-name">{habit.name}</span>
              <span className="highlight-stat">{stat}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

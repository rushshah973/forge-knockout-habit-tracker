import { Link } from "react-router-dom";
import { todayISO } from "../lib/dates.js";
import { countCurrentCalendarWeek, getStreakInfo } from "../lib/streaks.js";
import StreakBadge from "./StreakBadge.jsx";

export default function HabitCard({ habit, onToggleToday, onDelete }) {
  const done = habit.checkIns.includes(todayISO());
  const frequency = habit.frequency ?? { type: "daily" };
  const { current, unit } = getStreakInfo(habit);

  const frequencyLabel =
    frequency.type === "weekly" ? `${frequency.target}x/week` : "Daily";
  const weeklyProgress =
    frequency.type === "weekly" ? countCurrentCalendarWeek(habit.checkIns) : null;

  return (
    <li className="habit-card">
      <button
        type="button"
        className={
          done
            ? "habit-check-control habit-check-control-done"
            : "habit-check-control"
        }
        aria-pressed={done}
        aria-label={
          done
            ? `Mark ${habit.name} as not done today`
            : `Mark ${habit.name} as done today`
        }
        onClick={() => onToggleToday(habit.id)}
      >
        {done && <span aria-hidden="true">✓</span>}
      </button>

      <Link to={`/habit/${habit.id}`} className="habit-card-body">
        <span className={done ? "habit-name habit-name-done" : "habit-name"}>
          {habit.name}
        </span>
        <div className="habit-card-meta">
          <span className="text-caption">{frequencyLabel}</span>
          {frequency.type === "weekly" && (
            <span className="text-caption">
              {weeklyProgress}/{frequency.target} this week
            </span>
          )}
          <StreakBadge count={current} unit={unit} />
        </div>
      </Link>

      <button
        type="button"
        className="habit-delete"
        aria-label={`Delete ${habit.name}`}
        onClick={() => onDelete(habit.id)}
      >
        ×
      </button>
    </li>
  );
}

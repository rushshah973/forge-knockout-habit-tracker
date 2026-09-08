import { useRef } from "react";
import { Link } from "react-router-dom";
import { todayISO } from "../lib/dates.js";
import { getHabitColor, getHabitIcon } from "../lib/habitVisuals.js";
import {
  computeConsistency,
  countCurrentCalendarWeek,
  getStreakInfo,
  justBrokeStreak,
} from "../lib/streaks.js";
import RecoveryCard from "./RecoveryCard.jsx";
import StreakBadge from "./StreakBadge.jsx";

export default function HabitCard({ habit, onToggleToday, onDelete }) {
  const checkButtonRef = useRef(null);
  const done = habit.checkIns.includes(todayISO());
  const frequency = habit.frequency ?? { type: "daily" };
  const { current, unit } = getStreakInfo(habit);
  const color = getHabitColor(habit);
  const icon = getHabitIcon(habit);

  const frequencyLabel =
    frequency.type === "weekly" ? `${frequency.target}x/week` : "Daily";
  const weeklyProgress =
    frequency.type === "weekly" ? countCurrentCalendarWeek(habit.checkIns) : null;

  const showRecovery = frequency.type === "daily" && justBrokeStreak(habit.checkIns);
  const consistency = showRecovery
    ? computeConsistency(habit.checkIns, habit.createdAt, frequency)
    : null;

  return (
    <li className="habit-card">
      <div className="habit-card-row">
        <button
          ref={checkButtonRef}
          type="button"
          className={
            done ? "habit-check-control habit-check-control-done" : "habit-check-control"
          }
          style={{ "--habit-accent": `var(--${color})` }}
          aria-pressed={done}
          aria-label={
            done
              ? `Mark ${habit.name} as not done today`
              : `Mark ${habit.name} as done today`
          }
          onClick={() => onToggleToday(habit.id)}
        >
          <span aria-hidden="true">{done ? "✓" : icon}</span>
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
      </div>

      {showRecovery && (
        <RecoveryCard
          consistency={consistency}
          onStartAgain={() => checkButtonRef.current?.focus()}
        />
      )}
    </li>
  );
}

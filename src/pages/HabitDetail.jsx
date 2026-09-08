import { useNavigate, useParams } from "react-router-dom";
import AppShell from "../components/AppShell.jsx";
import Heatmap from "../components/Heatmap.jsx";
import { getHabitColor, getHabitIcon } from "../lib/habitVisuals.js";
import {
  computeConsistency,
  countCurrentCalendarWeek,
  countInRange,
  getStreakInfo,
} from "../lib/streaks.js";

export default function HabitDetail({ habits, onAddClick }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const habit = habits.find((h) => h.id === id);

  const header = (
    <header className="top-bar detail-header">
      <button
        type="button"
        className="detail-back"
        onClick={() => navigate("/")}
        aria-label="Back to today"
      >
        ←
      </button>
      <h1 className="text-h1 detail-title">{habit ? habit.name : "Habit"}</h1>
    </header>
  );

  if (!habit) {
    return (
      <AppShell header={header} onAddClick={onAddClick}>
        <p className="empty-state">This habit was deleted or doesn't exist.</p>
      </AppShell>
    );
  }

  const frequency = habit.frequency ?? { type: "daily" };
  const { current, best, unit } = getStreakInfo(habit);
  const consistency = computeConsistency(habit.checkIns, habit.createdAt, frequency);
  const total = new Set(habit.checkIns).size;
  const color = getHabitColor(habit);
  const icon = getHabitIcon(habit);

  const thisWeekLabel =
    frequency.type === "weekly"
      ? `${countCurrentCalendarWeek(habit.checkIns)}/${frequency.target}`
      : `${countInRange(habit.checkIns, -6, 0)}/7`;

  return (
    <AppShell header={header} onAddClick={onAddClick}>
      <section
        className="detail-hero"
        style={{ "--habit-accent": `var(--${color})` }}
      >
        <span className="detail-hero-icon" aria-hidden="true">
          {icon}
        </span>
        <p className="detail-streak-line">
          <span aria-hidden="true">🔥</span> {current} {unit}
          {current === 1 ? "" : "s"} streak
        </p>
        <span className="detail-consistency text-display">{consistency}%</span>
        <span className="text-caption">Consistency</span>
      </section>

      <Heatmap checkIns={habit.checkIns} createdAt={habit.createdAt} accentColor={color} />

      <div className="detail-stats">
        <div className="detail-stat">
          <span className="detail-stat-value">{thisWeekLabel}</span>
          <span className="text-caption">This week</span>
        </div>
        <div className="detail-stat">
          <span className="detail-stat-value">{best}</span>
          <span className="text-caption">Best streak</span>
        </div>
        <div className="detail-stat">
          <span className="detail-stat-value">{total}</span>
          <span className="text-caption">Total completions</span>
        </div>
      </div>
    </AppShell>
  );
}

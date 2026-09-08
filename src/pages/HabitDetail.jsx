import { useNavigate, useParams } from "react-router-dom";
import AppShell from "../components/AppShell.jsx";
import { addDaysISO, todayISO } from "../lib/dates.js";
import { computeConsistency, computeStreaks } from "../lib/streaks.js";

function countThisWeek(checkIns) {
  const checkedSet = new Set(checkIns);
  const today = todayISO();
  let count = 0;
  for (let offset = -6; offset <= 0; offset += 1) {
    if (checkedSet.has(addDaysISO(today, offset))) count += 1;
  }
  return count;
}

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

  const { current, best } = computeStreaks(habit.checkIns);
  const consistency = computeConsistency(habit.checkIns, habit.createdAt);
  const thisWeek = countThisWeek(habit.checkIns);
  const total = new Set(habit.checkIns).size;

  return (
    <AppShell header={header} onAddClick={onAddClick}>
      <section className="detail-hero">
        <p className="detail-streak-line">
          <span aria-hidden="true">🔥</span> {current} day streak
        </p>
        <span className="detail-consistency text-display">{consistency}%</span>
        <span className="text-caption">Consistency</span>
      </section>

      <div className="detail-stats">
        <div className="detail-stat">
          <span className="detail-stat-value">
            {thisWeek}/7
          </span>
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

import AppShell from "../components/AppShell.jsx";
import PageHeader from "../components/PageHeader.jsx";
import DailyHighlights from "../components/DailyHighlights.jsx";
import HabitComparisonChart from "../components/HabitComparisonChart.jsx";
import MomentumCard from "../components/MomentumCard.jsx";
import StatTiles from "../components/StatTiles.jsx";
import WeeklyBarChart from "../components/WeeklyBarChart.jsx";

export default function Progress({ habits, onAddClick }) {
  return (
    <AppShell header={<PageHeader title="Progress" />} onAddClick={onAddClick}>
      {habits.length === 0 ? (
        <p className="empty-state">Add a habit to see your progress here.</p>
      ) : (
        <>
          <StatTiles habits={habits} />

          <MomentumCard habits={habits} />

          <h2 className="text-h3 stats-section-title">This Week</h2>
          <div className="stats-card">
            <WeeklyBarChart habits={habits} />
          </div>

          <h2 className="text-h3 stats-section-title">Current Streaks</h2>
          <div className="stats-card">
            <HabitComparisonChart habits={habits} />
          </div>

          <DailyHighlights habits={habits} />
        </>
      )}
    </AppShell>
  );
}

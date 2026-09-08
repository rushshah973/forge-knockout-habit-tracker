import AppShell from "../components/AppShell.jsx";
import TopBar from "../components/TopBar.jsx";
import AIInsights from "../components/AIInsights.jsx";
import Challenges from "../components/Challenges.jsx";
import Crew from "../components/Crew.jsx";
import DailyHighlights from "../components/DailyHighlights.jsx";
import DateStrip from "../components/DateStrip.jsx";
import Gamification from "../components/Gamification.jsx";
import HabitList from "../components/HabitList.jsx";
import MomentumCard from "../components/MomentumCard.jsx";
import ProgressRing from "../components/ProgressRing.jsx";
import { todayISO } from "../lib/dates.js";

export default function Home({ habits, streak, onToggleToday, onDelete, onAddClick }) {
  const today = todayISO();
  const completedCount = habits.filter((h) => h.checkIns.includes(today)).length;
  const totalCount = habits.length;
  const progressPercent =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <AppShell header={<TopBar streak={streak} />} onAddClick={onAddClick}>
      <DateStrip />

      {totalCount > 0 && (
        <section className="today-progress" aria-label="Today's progress">
          <ProgressRing
            value={progressPercent}
            label={`${completedCount}/${totalCount}`}
            sublabel="Today"
          />
          <div className="today-progress-copy">
            <p className="text-h3 today-progress-title">Today's Progress</p>
            <p className="text-caption">
              {completedCount} of {totalCount} habit
              {totalCount === 1 ? "" : "s"} completed
            </p>
          </div>
        </section>
      )}

      <MomentumCard habits={habits} />

      <HabitList
        habits={habits}
        onToggleToday={onToggleToday}
        onDelete={onDelete}
        onAddClick={onAddClick}
      />

      <DailyHighlights habits={habits} />

      <Challenges habits={habits} />

      <Crew habits={habits} />

      <Gamification habits={habits} />

      <AIInsights habits={habits} />
    </AppShell>
  );
}

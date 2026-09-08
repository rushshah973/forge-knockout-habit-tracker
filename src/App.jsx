import { useEffect, useState } from "react";
import AppShell from "./components/AppShell.jsx";
import AddHabitForm from "./components/AddHabitForm.jsx";
import BottomSheet from "./components/BottomSheet.jsx";
import CelebrationOverlay from "./components/CelebrationOverlay.jsx";
import DateStrip from "./components/DateStrip.jsx";
import HabitList from "./components/HabitList.jsx";
import ProgressRing from "./components/ProgressRing.jsx";
import { loadHabits, saveHabits } from "./lib/storage.js";
import { todayISO } from "./lib/dates.js";
import { computeStreaks, STREAK_MILESTONES } from "./lib/streaks.js";

export default function App() {
  const [habits, setHabits] = useState(() => loadHabits());
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [celebration, setCelebration] = useState(null);

  useEffect(() => {
    saveHabits(habits);
  }, [habits]);

  function handleAddHabit(name) {
    const newHabit = {
      id: crypto.randomUUID(),
      name,
      createdAt: todayISO(),
      checkIns: [],
    };
    setHabits((prev) => [...prev, newHabit]);
    setIsAddOpen(false);
  }

  function handleToggleToday(habitId) {
    const today = todayISO();
    const target = habits.find((h) => h.id === habitId);
    if (!target) return;

    const isDone = target.checkIns.includes(today);
    const nextCheckIns = isDone
      ? target.checkIns.filter((d) => d !== today)
      : [...target.checkIns, today];

    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === habitId ? { ...habit, checkIns: nextCheckIns } : habit,
      ),
    );

    if (!isDone) {
      const { current } = computeStreaks(nextCheckIns);
      if (STREAK_MILESTONES.includes(current)) {
        setCelebration({ streak: current });
      }
    }
  }

  function handleDelete(habitId) {
    setHabits((prev) => prev.filter((habit) => habit.id !== habitId));
  }

  const today = todayISO();
  const completedCount = habits.filter((h) => h.checkIns.includes(today)).length;
  const totalCount = habits.length;
  const progressPercent =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);
  const overallStreak = habits.reduce(
    (max, h) => Math.max(max, computeStreaks(h.checkIns).current),
    0,
  );

  return (
    <>
      <AppShell streak={overallStreak} onAddClick={() => setIsAddOpen(true)}>
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

        <HabitList
          habits={habits}
          onToggleToday={handleToggleToday}
          onDelete={handleDelete}
        />
      </AppShell>

      {isAddOpen && (
        <BottomSheet onClose={() => setIsAddOpen(false)}>
          <AddHabitForm onAddHabit={handleAddHabit} />
        </BottomSheet>
      )}

      {celebration && (
        <CelebrationOverlay
          streak={celebration.streak}
          onClose={() => setCelebration(null)}
        />
      )}
    </>
  );
}

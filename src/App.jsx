import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import AddHabitForm from "./components/AddHabitForm.jsx";
import BottomSheet from "./components/BottomSheet.jsx";
import CelebrationOverlay from "./components/CelebrationOverlay.jsx";
import Onboarding from "./components/Onboarding.jsx";
import Home from "./pages/Home.jsx";
import HabitDetail from "./pages/HabitDetail.jsx";
import ProgressPage from "./pages/Progress.jsx";
import ChallengesPage from "./pages/ChallengesPage.jsx";
import InsightsPage from "./pages/InsightsPage.jsx";
import Profile from "./pages/Profile.jsx";
import { hasOnboarded, loadHabits, markOnboarded, saveHabits } from "./lib/storage.js";
import { todayISO } from "./lib/dates.js";
import { getStreakInfo, STREAK_MILESTONES } from "./lib/streaks.js";

export default function App() {
  const [habits, setHabits] = useState(() => loadHabits());
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [celebration, setCelebration] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(() => !hasOnboarded());

  function handleFinishOnboarding() {
    markOnboarded();
    setShowOnboarding(false);
  }

  useEffect(() => {
    saveHabits(habits);
  }, [habits]);

  function handleAddHabit(name, frequency) {
    const newHabit = {
      id: crypto.randomUUID(),
      name,
      createdAt: todayISO(),
      checkIns: [],
      frequency: frequency ?? { type: "daily" },
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
      const { current, unit } = getStreakInfo({ ...target, checkIns: nextCheckIns });
      if (STREAK_MILESTONES.includes(current)) {
        setCelebration({ streak: current, unit });
      }
    }
  }

  function handleDelete(habitId) {
    setHabits((prev) => prev.filter((habit) => habit.id !== habitId));
  }

  const overallStreak = habits.reduce(
    (max, h) => Math.max(max, getStreakInfo(h).current),
    0,
  );

  const sharedProps = {
    habits,
    onToggleToday: handleToggleToday,
    onDelete: handleDelete,
    onAddClick: () => setIsAddOpen(true),
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Home streak={overallStreak} {...sharedProps} />} />
        <Route path="/habit/:id" element={<HabitDetail {...sharedProps} />} />
        <Route path="/progress" element={<ProgressPage {...sharedProps} />} />
        <Route path="/challenges" element={<ChallengesPage {...sharedProps} />} />
        <Route path="/insights" element={<InsightsPage {...sharedProps} />} />
        <Route path="/profile" element={<Profile {...sharedProps} />} />
      </Routes>

      {isAddOpen && (
        <BottomSheet onClose={() => setIsAddOpen(false)}>
          <AddHabitForm onAddHabit={handleAddHabit} />
        </BottomSheet>
      )}

      {celebration && (
        <CelebrationOverlay
          streak={celebration.streak}
          unit={celebration.unit}
          onClose={() => setCelebration(null)}
        />
      )}

      {showOnboarding && <Onboarding onFinish={handleFinishOnboarding} />}
    </>
  );
}

import EmptyState from "./EmptyState.jsx";
import HabitCard from "./HabitCard.jsx";

export default function HabitList({ habits, onToggleToday, onDelete, onAddClick }) {
  if (habits.length === 0) {
    return <EmptyState onAddClick={onAddClick} />;
  }

  return (
    <ul className="habit-list">
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          onToggleToday={onToggleToday}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

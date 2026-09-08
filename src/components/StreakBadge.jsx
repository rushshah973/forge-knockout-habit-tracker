export default function StreakBadge({ count }) {
  if (!count) return null;

  return (
    <span className="streak-badge">
      <span aria-hidden="true">🔥</span>
      {count} day{count === 1 ? "" : "s"} streak
    </span>
  );
}

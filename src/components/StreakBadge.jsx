export default function StreakBadge({ count, unit = "day" }) {
  if (!count) return null;

  return (
    <span className="streak-badge">
      <span aria-hidden="true">🔥</span>
      {count} {unit}
      {count === 1 ? "" : "s"} streak
    </span>
  );
}

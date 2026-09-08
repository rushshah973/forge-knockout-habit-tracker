export default function ChallengeCard({ name, day, length, reward }) {
  const displayDay = Math.min(day, length);
  const percent = Math.round((displayDay / length) * 100);
  const complete = day >= length;

  return (
    <div className="challenge-card">
      <div className="challenge-card-header">
        <span className="challenge-name">{name}</span>
        <span className="text-caption">{reward}</span>
      </div>
      <p className="challenge-day-label">
        {complete ? "Complete! " : ""}Day {displayDay} / {length}
      </p>
      <div className="challenge-bar-track">
        <div className="challenge-bar-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

import { computeStreakHistory } from "../lib/streaks.js";

function formatShort(iso) {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function StreakHistory({ checkIns }) {
  const runs = computeStreakHistory(checkIns).slice(0, 5);
  if (runs.length === 0) return null;

  const maxLength = Math.max(...runs.map((run) => run.length));

  return (
    <div className="streak-history">
      <h2 className="text-h3 streak-history-title">
        <span aria-hidden="true">🔥</span> Streaks
      </h2>
      <div className="streak-history-list">
        {runs.map((run) => (
          <div key={run.start} className="streak-history-row">
            <span className="streak-history-date">{formatShort(run.start)}</span>
            <div className="streak-history-track">
              <div
                className="streak-history-bar"
                style={{ width: `${Math.max(20, (run.length / maxLength) * 100)}%` }}
              >
                {run.length}
              </div>
            </div>
            <span className="streak-history-date">{formatShort(run.end)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

import { computeCompletionTrend } from "../lib/streaks.js";

export default function CompletionTrend({ checkIns, createdAt }) {
  const { currentRate, change, sparkline } = computeCompletionTrend(checkIns, createdAt, 14);
  const isUp = change > 0;
  const isDown = change < 0;

  const points = sparkline
    .map((value, index) => {
      const x = (index / Math.max(1, sparkline.length - 1)) * 100;
      const y = value ? 8 : 32;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="completion-trend">
      <span className="text-caption">Avg Completion Rate</span>
      <div className="completion-trend-value-row">
        <span className="completion-trend-value">{currentRate}%</span>
        {change !== 0 && (
          <span
            className={
              isDown
                ? "completion-trend-change completion-trend-down"
                : "completion-trend-change completion-trend-up"
            }
          >
            <span aria-hidden="true">{isUp ? "▲" : "▼"}</span> {Math.abs(change)}%
          </span>
        )}
      </div>
      <svg
        className="completion-trend-sparkline"
        viewBox="0 0 100 40"
        preserveAspectRatio="none"
        role="img"
        aria-label={`Daily completion over the last ${sparkline.length} days`}
      >
        <polyline
          points={points}
          fill="none"
          stroke="var(--habit-accent, var(--primary))"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

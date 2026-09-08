import { computeOverallStats } from "../lib/statistics.js";

export default function StatTiles({ habits }) {
  const stats = computeOverallStats(habits);

  return (
    <div className="stat-tiles">
      <div className="detail-stat">
        <span className="detail-stat-value">{stats.totalHabits}</span>
        <span className="text-caption">Habits</span>
      </div>
      <div className="detail-stat">
        <span className="detail-stat-value">{stats.totalCheckIns}</span>
        <span className="text-caption">Check-ins</span>
      </div>
      <div className="detail-stat">
        <span className="detail-stat-value">{stats.bestStreakEver}</span>
        <span className="text-caption">Best streak</span>
      </div>
      <div className="detail-stat">
        <span className="detail-stat-value">{stats.activeStreaks}</span>
        <span className="text-caption">Active streaks</span>
      </div>
    </div>
  );
}

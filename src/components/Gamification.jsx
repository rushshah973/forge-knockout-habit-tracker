import { computeAchievements, computeLevel, computeXP } from "../lib/gamification.js";

const LEVEL_TITLES = [
  "Getting Started",
  "Building Habits",
  "Consistency Builder",
  "Habit Master",
  "Unstoppable",
];

function titleFor(level) {
  return LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)];
}

export default function Gamification({ habits }) {
  if (habits.length === 0) return null;

  const xp = computeXP(habits);
  const { level, xpIntoLevel, xpForNextLevel } = computeLevel(xp);
  const achievements = computeAchievements(habits);
  const percent = Math.round((xpIntoLevel / xpForNextLevel) * 100);

  return (
    <section className="gamification" aria-label="Level and achievements">
      <div className="level-card">
        <div className="level-header">
          <span className="level-badge">LEVEL {level}</span>
          <span className="text-caption">
            {xpIntoLevel}/{xpForNextLevel} XP
          </span>
        </div>
        <p className="level-title">{titleFor(level)}</p>
        <div
          className="level-bar-track"
          role="progressbar"
          aria-valuenow={xpIntoLevel}
          aria-valuemin={0}
          aria-valuemax={xpForNextLevel}
        >
          <div className="level-bar-fill" style={{ width: `${percent}%` }} />
        </div>
      </div>

      <div className="achievements-row">
        {achievements.map((a) => (
          <div
            key={a.id}
            className={
              a.unlocked ? "achievement-badge achievement-badge-unlocked" : "achievement-badge"
            }
            title={a.unlocked ? a.name : `${a.name} — locked`}
          >
            <span aria-hidden="true">{a.icon}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

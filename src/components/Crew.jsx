import { getStreakInfo } from "../lib/streaks.js";
import { MOCK_CREW } from "../lib/crew.js";

export default function Crew({ habits }) {
  if (habits.length === 0) return null;

  const yourStreak = habits.reduce((max, h) => Math.max(max, getStreakInfo(h).current), 0);
  const members = [{ name: "You", streak: yourStreak, isYou: true }, ...MOCK_CREW];

  return (
    <section className="crew" aria-label="Your crew">
      <h2 className="text-h3 crew-title">Your Crew</h2>
      <div className="crew-list">
        {members.map((member) => (
          <div
            key={member.name}
            className={member.isYou ? "crew-member crew-member-you" : "crew-member"}
          >
            <span className="crew-avatar" aria-hidden="true">
              {member.name.charAt(0)}
            </span>
            <span className="crew-name">{member.name}</span>
            <span className="crew-streak">🔥 {member.streak}</span>
          </div>
        ))}
      </div>
      <p className="text-caption crew-note">Demo data — inviting real friends is coming soon.</p>
    </section>
  );
}

import { CHALLENGES } from "../lib/challenges.js";
import ChallengeCard from "./ChallengeCard.jsx";

export default function Challenges({ habits }) {
  if (habits.length === 0) return null;

  return (
    <section className="challenges" aria-label="Challenges">
      <h2 className="text-h3 challenges-title">Challenges</h2>
      <div className="challenges-list">
        {CHALLENGES.map((challenge) => (
          <ChallengeCard
            key={challenge.id}
            name={challenge.name}
            day={challenge.compute(habits)}
            length={challenge.length}
            reward={challenge.reward}
          />
        ))}
      </div>
    </section>
  );
}

import { CHALLENGES } from "../lib/challenges.js";
import ChallengeCard from "./ChallengeCard.jsx";

export default function Challenges({ habits }) {
  if (habits.length === 0) return null;

  return (
    <section className="challenges" aria-label="Challenges">
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

import { computeMomentum } from "../lib/momentum.js";

const MESSAGE_TIERS = [
  { min: 80, message: "Strong week. Keep going." },
  { min: 60, message: "Good momentum. Stay consistent." },
  { min: 40, message: "Building up. Small steps count." },
  { min: 20, message: "A slow start — every check-in helps." },
  { min: 0, message: "Let's rebuild momentum together." },
];

function messageFor(score) {
  return MESSAGE_TIERS.find((tier) => score >= tier.min)?.message ?? "";
}

export default function MomentumCard({ habits }) {
  const momentum = computeMomentum(habits);
  if (!momentum) return null;

  return (
    <section className="momentum-card" aria-label="Your momentum">
      <div className="momentum-header">
        <span className="text-caption momentum-label">Your Momentum</span>
        <span className="momentum-score">{momentum.score}</span>
      </div>
      <div
        className="momentum-bar-track"
        role="progressbar"
        aria-valuenow={momentum.score}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="momentum-bar-fill" style={{ width: `${momentum.score}%` }} />
      </div>
      <p className="text-caption momentum-message">{messageFor(momentum.score)}</p>
    </section>
  );
}

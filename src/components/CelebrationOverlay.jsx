import { useEffect } from "react";

const MILESTONE_MESSAGES = {
  7: "One week strong.",
  14: "Two weeks in — it's sticking.",
  21: "Three weeks. That's a habit now.",
  30: "A full month. Incredible.",
  50: "50 days of showing up.",
  100: "100 days. Legendary.",
};

const AUTO_DISMISS_MS = 3200;

export default function CelebrationOverlay({ streak, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className="celebration-overlay"
      role="status"
      aria-live="polite"
      onClick={onClose}
    >
      <div className="celebration-card">
        <span className="celebration-flame" aria-hidden="true">
          🔥
        </span>
        <span className="celebration-count text-display">{streak}</span>
        <span className="celebration-label">DAY STREAK</span>
        <p className="celebration-message">
          {MILESTONE_MESSAGES[streak] ?? "You're on fire."}
        </p>
      </div>
    </div>
  );
}

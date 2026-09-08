import { useEffect } from "react";

// Written assuming a daily streak, so only used for unit === "day" — a
// weekly habit's Nth-week milestone gets the generic fallback instead,
// since "A full month." would misread for a 30-week streak.
const MILESTONE_MESSAGES = {
  7: "One week strong.",
  14: "Two weeks in — it's sticking.",
  21: "Three weeks. That's a habit now.",
  30: "A full month. Incredible.",
  50: "50 days of showing up.",
  100: "100 days. Legendary.",
};

const AUTO_DISMISS_MS = 3200;

export default function CelebrationOverlay({ streak, unit = "day", onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [onClose]);

  const message =
    unit === "day" ? (MILESTONE_MESSAGES[streak] ?? "You're on fire.") : "You're on fire.";

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
        <span className="celebration-label">{unit.toUpperCase()} STREAK</span>
        <p className="celebration-message">{message}</p>
      </div>
    </div>
  );
}

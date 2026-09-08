import { useEffect } from "react";

const AUTO_DISMISS_MS = 3200;

export default function PerfectDayOverlay({ onClose }) {
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
      <div className="celebration-card celebration-card-perfect">
        <span className="celebration-flame" aria-hidden="true">
          🎉
        </span>
        <span className="celebration-label">PERFECT DAY</span>
        <p className="celebration-message">Every habit done. That's the whole game.</p>
      </div>
    </div>
  );
}

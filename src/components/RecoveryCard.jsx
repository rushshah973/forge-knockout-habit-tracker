export default function RecoveryCard({ consistency, onStartAgain }) {
  return (
    <div className="recovery-card">
      <p className="recovery-message">
        You missed yesterday — but your consistency is still{" "}
        <strong>{consistency}%</strong>.
      </p>
      <p className="recovery-prompt">Ready to restart?</p>
      <button type="button" className="recovery-cta" onClick={onStartAgain}>
        Start again
      </button>
    </div>
  );
}

export default function EmptyState({ onAddClick }) {
  return (
    <div className="empty-state-card">
      <span className="empty-state-icon" aria-hidden="true">
        🌱
      </span>
      <p className="empty-state-title">No habits yet</p>
      <p className="text-caption empty-state-body">Start with one tiny habit.</p>
      <button type="button" className="empty-state-cta" onClick={onAddClick}>
        + Create a habit
      </button>
    </div>
  );
}

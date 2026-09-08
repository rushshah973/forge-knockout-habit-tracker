export default function TopBar() {
  return (
    <header className="top-bar">
      <div className="top-bar-greeting">
        <p className="text-caption top-bar-eyebrow">Good morning 👋</p>
        <h1 className="text-h1 top-bar-title">Today</h1>
      </div>
      <div className="top-bar-streak" aria-label="Current streak">
        <span aria-hidden="true">🔥</span>
        <span className="top-bar-streak-count">0</span>
      </div>
    </header>
  );
}

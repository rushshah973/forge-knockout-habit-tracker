const LEFT_ITEMS = [{ key: "home", label: "Home", icon: "🏠", enabled: true }];

const RIGHT_ITEMS = [
  { key: "progress", label: "Progress", icon: "📊", enabled: false },
  { key: "challenges", label: "Challenges", icon: "🏆", enabled: false },
  { key: "insights", label: "Insights", icon: "✨", enabled: false },
  { key: "profile", label: "Profile", icon: "👤", enabled: false },
];

function NavButton({ item }) {
  return (
    <button
      type="button"
      className={
        item.key === "home"
          ? "bottom-nav-item bottom-nav-item-active"
          : "bottom-nav-item"
      }
      disabled={!item.enabled}
      aria-current={item.key === "home" ? "page" : undefined}
      title={item.enabled ? item.label : `${item.label} — coming soon`}
    >
      <span className="bottom-nav-icon" aria-hidden="true">
        {item.icon}
      </span>
      <span className="bottom-nav-label">{item.label}</span>
    </button>
  );
}

export default function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Primary">
      <div className="bottom-nav-items">
        {LEFT_ITEMS.map((item) => (
          <NavButton key={item.key} item={item} />
        ))}
        {RIGHT_ITEMS.slice(0, 1).map((item) => (
          <NavButton key={item.key} item={item} />
        ))}
        <button
          type="button"
          className="bottom-nav-add"
          aria-label="Add a habit"
          disabled
          title="Add a habit — coming soon"
        >
          +
        </button>
        {RIGHT_ITEMS.slice(1).map((item) => (
          <NavButton key={item.key} item={item} />
        ))}
      </div>
    </nav>
  );
}

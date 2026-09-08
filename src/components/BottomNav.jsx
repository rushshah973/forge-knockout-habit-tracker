import { Link, useLocation } from "react-router-dom";

const LEFT_ITEMS = [{ key: "home", label: "Home", icon: "🏠", enabled: true, to: "/" }];

const RIGHT_ITEMS = [
  { key: "progress", label: "Progress", icon: "📊", enabled: false },
  { key: "challenges", label: "Challenges", icon: "🏆", enabled: false },
  { key: "insights", label: "Insights", icon: "✨", enabled: false },
  { key: "profile", label: "Profile", icon: "👤", enabled: false },
];

function NavButton({ item }) {
  const { pathname } = useLocation();

  if (item.enabled && item.to) {
    const isActive = pathname === item.to;
    return (
      <Link
        to={item.to}
        className={
          isActive ? "bottom-nav-item bottom-nav-item-active" : "bottom-nav-item"
        }
        aria-current={isActive ? "page" : undefined}
        title={item.label}
      >
        <span className="bottom-nav-icon" aria-hidden="true">
          {item.icon}
        </span>
        <span className="bottom-nav-label">{item.label}</span>
      </Link>
    );
  }

  return (
    <button
      type="button"
      className="bottom-nav-item"
      disabled
      title={`${item.label} — coming soon`}
    >
      <span className="bottom-nav-icon" aria-hidden="true">
        {item.icon}
      </span>
      <span className="bottom-nav-label">{item.label}</span>
    </button>
  );
}

export default function BottomNav({ onAddClick }) {
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
          onClick={onAddClick}
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

import TopBar from "./TopBar.jsx";
import BottomNav from "./BottomNav.jsx";

export default function AppShell({ children, streak = 0, onAddClick }) {
  return (
    <div className="app-shell">
      <TopBar streak={streak} />
      <main className="app-content">{children}</main>
      <BottomNav onAddClick={onAddClick} />
    </div>
  );
}

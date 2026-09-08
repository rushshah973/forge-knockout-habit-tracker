import TopBar from "./TopBar.jsx";
import BottomNav from "./BottomNav.jsx";

export default function AppShell({ children }) {
  return (
    <div className="app-shell">
      <TopBar />
      <main className="app-content">{children}</main>
      <BottomNav />
    </div>
  );
}

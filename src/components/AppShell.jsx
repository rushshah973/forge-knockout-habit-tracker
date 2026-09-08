import BottomNav from "./BottomNav.jsx";

export default function AppShell({ children, header, onAddClick }) {
  return (
    <div className="app-shell">
      {header}
      <main className="app-content">{children}</main>
      <BottomNav onAddClick={onAddClick} />
    </div>
  );
}

import AppShell from "../components/AppShell.jsx";
import PageHeader from "../components/PageHeader.jsx";
import AIInsights from "../components/AIInsights.jsx";

export default function InsightsPage({ habits, onAddClick }) {
  return (
    <AppShell header={<PageHeader title="Insights" />} onAddClick={onAddClick}>
      {habits.length === 0 ? (
        <p className="empty-state">Add a habit to unlock insights.</p>
      ) : (
        <AIInsights habits={habits} />
      )}
    </AppShell>
  );
}

import AppShell from "../components/AppShell.jsx";
import PageHeader from "../components/PageHeader.jsx";
import DailyHighlights from "../components/DailyHighlights.jsx";
import MomentumCard from "../components/MomentumCard.jsx";

export default function Progress({ habits, onAddClick }) {
  return (
    <AppShell header={<PageHeader title="Progress" />} onAddClick={onAddClick}>
      {habits.length === 0 ? (
        <p className="empty-state">Add a habit to see your progress here.</p>
      ) : (
        <>
          <MomentumCard habits={habits} />
          <DailyHighlights habits={habits} />
        </>
      )}
    </AppShell>
  );
}

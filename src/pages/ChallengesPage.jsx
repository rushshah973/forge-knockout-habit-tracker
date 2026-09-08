import AppShell from "../components/AppShell.jsx";
import PageHeader from "../components/PageHeader.jsx";
import Challenges from "../components/Challenges.jsx";

export default function ChallengesPage({ habits, onAddClick }) {
  return (
    <AppShell header={<PageHeader title="Challenges" />} onAddClick={onAddClick}>
      {habits.length === 0 ? (
        <p className="empty-state">Add a habit to start a challenge.</p>
      ) : (
        <Challenges habits={habits} />
      )}
    </AppShell>
  );
}

import AppShell from "../components/AppShell.jsx";
import PageHeader from "../components/PageHeader.jsx";
import Crew from "../components/Crew.jsx";
import DemoDataButton from "../components/DemoDataButton.jsx";
import Gamification from "../components/Gamification.jsx";

export default function Profile({ habits, onAddClick }) {
  return (
    <AppShell header={<PageHeader title="Profile" />} onAddClick={onAddClick}>
      {habits.length === 0 ? (
        <p className="empty-state">Add a habit to build your profile.</p>
      ) : (
        <>
          <Gamification habits={habits} />
          <Crew habits={habits} />
        </>
      )}
      <DemoDataButton />
    </AppShell>
  );
}

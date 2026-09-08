export default function PageHeader({ title }) {
  return (
    <header className="top-bar">
      <div className="top-bar-greeting">
        <h1 className="text-h1 top-bar-title">{title}</h1>
      </div>
    </header>
  );
}

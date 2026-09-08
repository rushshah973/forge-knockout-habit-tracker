import { seedDemoData } from "../lib/demoData.js";

// Dev-only: import.meta.env.DEV is false in a production build, so this
// never ships to a real user — it's purely a presenter tool for filling
// the app with realistic, feature-covering data before a demo.
export default function DemoDataButton() {
  if (!import.meta.env.DEV) return null;

  return (
    <div className="demo-data">
      <button type="button" className="demo-data-button" onClick={seedDemoData}>
        ✨ Load demo data
      </button>
      <p className="text-caption demo-data-note">
        Dev only — fills the app with realistic multi-week data covering every
        feature.
      </p>
    </div>
  );
}

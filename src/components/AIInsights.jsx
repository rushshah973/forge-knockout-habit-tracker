import { computeInsights } from "../lib/insights.js";

export default function AIInsights({ habits }) {
  if (habits.length === 0) return null;

  const insights = computeInsights(habits);

  return (
    <section className="ai-insights" aria-label="Insights">
      <div className="ai-insights-list">
        {insights.map((text, index) => (
          <div key={index} className="ai-insight-card">
            <span className="ai-insight-label">✨ AI INSIGHT</span>
            <p className="ai-insight-text">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

import { useState } from "react";
import { todayISO } from "../lib/dates.js";

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTH_LABELS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function pad(n) {
  return String(n).padStart(2, "0");
}

function isoFor(year, monthIndex, day) {
  return `${year}-${pad(monthIndex + 1)}-${pad(day)}`;
}

function daysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function mondayFirstIndex(year, monthIndex, day) {
  const jsDay = new Date(year, monthIndex, day).getDay(); // 0=Sun..6=Sat
  return (jsDay + 6) % 7; // 0=Mon..6=Sun
}

export default function Heatmap({ checkIns, createdAt, accentColor }) {
  const today = todayISO();
  const [todayYear, todayMonth] = today.split("-").map(Number);
  const [viewYear, setViewYear] = useState(todayYear);
  const [viewMonthIndex, setViewMonthIndex] = useState(todayMonth - 1);

  const checkedSet = new Set(checkIns);
  const total = daysInMonth(viewYear, viewMonthIndex);
  const leadingBlanks = mondayFirstIndex(viewYear, viewMonthIndex, 1);
  const isCurrentMonth = viewYear === todayYear && viewMonthIndex === todayMonth - 1;

  function goPrev() {
    setViewMonthIndex((prev) => {
      if (prev === 0) {
        setViewYear((y) => y - 1);
        return 11;
      }
      return prev - 1;
    });
  }

  function goNext() {
    if (isCurrentMonth) return;
    setViewMonthIndex((prev) => {
      if (prev === 11) {
        setViewYear((y) => y + 1);
        return 0;
      }
      return prev + 1;
    });
  }

  const cells = [];
  for (let i = 0; i < leadingBlanks; i += 1) {
    cells.push(
      <div key={`blank-${i}`} className="heatmap-cell heatmap-cell-blank" aria-hidden="true" />,
    );
  }
  for (let day = 1; day <= total; day += 1) {
    const iso = isoFor(viewYear, viewMonthIndex, day);
    let status;
    if (iso > today) status = "future";
    else if (iso < createdAt) status = "before-creation";
    else if (checkedSet.has(iso)) status = "done";
    else status = "missed";

    cells.push(
      <div key={iso} className={`heatmap-cell heatmap-cell-${status}`} title={iso}>
        {day}
      </div>,
    );
  }

  const heatmapStyle = accentColor ? { "--habit-accent": `var(--${accentColor})` } : undefined;

  return (
    <div className="heatmap" style={heatmapStyle}>
      <div className="heatmap-header">
        <button
          type="button"
          className="heatmap-nav"
          aria-label="Previous month"
          onClick={goPrev}
        >
          ‹
        </button>
        <span className="heatmap-month-label">
          {MONTH_LABELS[viewMonthIndex]} {viewYear}
        </span>
        <button
          type="button"
          className="heatmap-nav"
          aria-label="Next month"
          onClick={goNext}
          disabled={isCurrentMonth}
        >
          ›
        </button>
      </div>

      <div className="heatmap-weekdays" aria-hidden="true">
        {WEEKDAY_LABELS.map((label) => (
          <span key={label} className="heatmap-weekday">
            {label}
          </span>
        ))}
      </div>

      <div className="heatmap-grid">{cells}</div>
    </div>
  );
}

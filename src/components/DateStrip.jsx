import { addDaysISO, todayISO } from "../lib/dates.js";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function buildWeek() {
  const today = todayISO();
  const days = [];
  for (let offset = -6; offset <= 0; offset += 1) {
    const iso = addDaysISO(today, offset);
    const dayNumber = Number(iso.split("-")[2]);
    const weekdayIndex = new Date(`${iso}T00:00:00`).getDay();
    days.push({
      iso,
      dayNumber,
      weekday: WEEKDAY_LABELS[weekdayIndex],
      isToday: offset === 0,
    });
  }
  return days;
}

export default function DateStrip() {
  const days = buildWeek();

  return (
    <div className="date-strip" role="list" aria-label="This week">
      {days.map((day) => (
        <div
          key={day.iso}
          role="listitem"
          className={
            day.isToday ? "date-strip-day date-strip-day-active" : "date-strip-day"
          }
        >
          <span className="date-strip-weekday">{day.weekday}</span>
          <span className="date-strip-number">{day.dayNumber}</span>
        </div>
      ))}
    </div>
  );
}

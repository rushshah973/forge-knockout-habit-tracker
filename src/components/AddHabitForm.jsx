import { useState } from "react";

const MAX_LENGTH = 80;

const FREQUENCY_OPTIONS = [
  { value: "daily", label: "Every day" },
  { value: "2", label: "2x a week" },
  { value: "3", label: "3x a week" },
  { value: "4", label: "4x a week" },
  { value: "5", label: "5x a week" },
  { value: "6", label: "6x a week" },
];

export default function AddHabitForm({ onAddHabit }) {
  const [name, setName] = useState("");
  const [frequencyValue, setFrequencyValue] = useState("daily");

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    const frequency =
      frequencyValue === "daily"
        ? { type: "daily" }
        : { type: "weekly", target: Number(frequencyValue) };
    onAddHabit(trimmed, frequency);
    setName("");
    setFrequencyValue("daily");
  }

  return (
    <form className="add-habit-form" onSubmit={handleSubmit}>
      <label htmlFor="habit-name">Add a habit</label>
      <div className="add-habit-row">
        <input
          id="habit-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={MAX_LENGTH}
          placeholder="e.g. Drink a glass of water"
          autoComplete="off"
          autoFocus
        />
        <button type="submit">Add</button>
      </div>

      <label htmlFor="habit-frequency" className="add-habit-frequency-label">
        Repeats
      </label>
      <select
        id="habit-frequency"
        className="add-habit-frequency"
        value={frequencyValue}
        onChange={(e) => setFrequencyValue(e.target.value)}
      >
        {FREQUENCY_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </form>
  );
}

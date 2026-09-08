const STORAGE_KEY = "habit-tracker:habits";

export function loadHabits() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    // Legacy habits saved before frequency existed get a "daily" default;
    // spreading `habit` after the default means an existing frequency wins.
    return parsed.map((habit) => ({ frequency: { type: "daily" }, ...habit }));
  } catch {
    return [];
  }
}

export function saveHabits(habits) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  } catch {
    // localStorage unavailable (e.g. private browsing) — app still works for this session
  }
}

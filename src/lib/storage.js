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

const ONBOARDING_KEY = "habit-tracker:onboarded";

export function hasOnboarded() {
  try {
    // Fail open — if storage is unavailable, don't block the Core behind
    // an onboarding flow that can never be dismissed permanently.
    return localStorage.getItem(ONBOARDING_KEY) === "true";
  } catch {
    return true;
  }
}

export function markOnboarded() {
  try {
    localStorage.setItem(ONBOARDING_KEY, "true");
  } catch {
    // ignore — worst case onboarding reappears next visit
  }
}

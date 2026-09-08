const COLORS = ["pink", "lavender", "green", "blue", "yellow"];

const KEYWORD_ICONS = [
  { keywords: ["water", "hydrat", "drink"], icon: "💧" },
  { keywords: ["read", "book"], icon: "📚" },
  { keywords: ["gym", "workout", "exercise", "lift", "strength"], icon: "💪" },
  { keywords: ["run", "jog"], icon: "🏃" },
  { keywords: ["walk"], icon: "🚶" },
  { keywords: ["meditat", "breath", "mindful"], icon: "🧘" },
  { keywords: ["sleep", "bed"], icon: "😴" },
  { keywords: ["journal", "write", "diary"], icon: "📝" },
  { keywords: ["sugar", "diet", "eat", "food", "meal"], icon: "🥗" },
  { keywords: ["code", "study", "learn", "class"], icon: "🎓" },
  { keywords: ["music", "guitar", "piano", "practice"], icon: "🎵" },
  { keywords: ["stretch", "yoga"], icon: "🤸" },
  { keywords: ["clean", "tidy"], icon: "🧹" },
  { keywords: ["save", "budget", "money"], icon: "💰" },
  { keywords: ["gratitude", "grateful"], icon: "🙏" },
];

const FALLBACK_ICONS = ["✨", "🌟", "🎯", "🔥", "🌱"];

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/** Stable per-habit accent color, derived from id so it never shifts on reorder. */
export function getHabitColor(habit) {
  const index = hashString(habit.id) % COLORS.length;
  return COLORS[index];
}

/** Keyword-matched icon from the habit's name, falling back to a stable hashed pick. */
export function getHabitIcon(habit) {
  const lowerName = habit.name.toLowerCase();
  const match = KEYWORD_ICONS.find((entry) =>
    entry.keywords.some((word) => lowerName.includes(word)),
  );
  if (match) return match.icon;
  const index = hashString(habit.id) % FALLBACK_ICONS.length;
  return FALLBACK_ICONS[index];
}

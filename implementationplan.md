# Implementation Plan — Forge Knockout: Habit Tracker

**Companion doc:** [problemstatement.md](./problemstatement.md) — read that first for the "why" (problem narrowing) and the full UI/UX Design System spec. This document is the "how" and "in what order": a step-wise build plan you'll work through one stage at a time.

**How to use this file:** Each stage below is meant to be handed to Claude Code as its own self-contained task, in order. Tick the checkbox when a stage is done and verified in the browser before moving to the next one. Don't start a stage before its "Builds on" dependency is checked off.

---

## 0. Confirmed Current State (as of this plan)

Read directly from the repo so the plan below is grounded in what actually exists, not guesses:

- **Stack:** React 18.3 + Vite 6, plain JS (`.jsx`), no TypeScript, no CSS framework (plain `src/styles.css`), no router, no state library, no chart library.
- **Files:**
  ```
  index.html
  src/main.jsx
  src/App.jsx
  src/styles.css
  src/components/AddHabitForm.jsx
  src/components/HabitList.jsx
  src/components/HabitRow.jsx
  src/lib/dates.js
  src/lib/storage.js
  ```
- **Persistence:** `localStorage`, key `habit-tracker:habits`. No backend, no auth.
- **Deploy target:** Vercel, static `dist/` output.

This is intentionally minimal — that minimalism is the Core's whole point (see problemstatement.md §3). The plan below **adds to** this structure; it does not rip it out.

**Stack decisions locked in for this plan** (keep dependency footprint small — this is a hackathon, not a production app):
- No CSS framework — extend `styles.css` with CSS custom properties (design tokens) instead of introducing Tailwind.
- Add `react-router-dom` only in Stage 3, when a real second screen (Habit Detail) is needed. Until then, view-switching can stay as local component state.
- No chart/calendar library — hand-roll the heatmap and progress rings with plain SVG/CSS. Keeps bundle small and matches the reference's custom illustration style better than a generic chart library would.
- No backend/auth added unless Stage 9 (Social Accountability) is explicitly greenlit — it's marked stretch for a reason.

---

## Phase A — Foundation (do this before any visual work)

### Stage 1 — Design tokens & base styles ☐
**Priority:** Required
**Builds on:** current `main` branch as-is
**Touches:** `src/styles.css` (extend, don't replace)

Do:
- Add CSS custom properties to `:root` in `styles.css` for the full token set from problemstatement.md §2 and §28: `--background`, `--foreground`, `--primary`, `--pink`, `--lavender`, `--green`, `--blue`, `--yellow`, `--muted`, `--border`, `--card`, plus spacing scale (`--space-1` … `--space-12` matching `4/8/12/16/20/24/32/40/48`) and radius scale (`--radius-sm/md/lg/xl/pill`).
- Add base typography rules (font stack, the size scale from §3) as utility classes or base element styles.
- Swap the page background and text color over to the new tokens so the whole app instantly looks cream/black instead of default browser styling — this is a cheap, high-visibility first win.

Definition of done:
- App still runs (`npm run dev`), no functional regressions in add/check-off/persistence.
- Background is cream (`#FFFDF7`), text is near-black, and the token variables are visibly the source (inspect element shows `var(--...)`, not hardcoded hex, in any newly touched CSS).

---

### Stage 2 — App shell, top bar, bottom nav (structure only, no new screens yet) ☐
**Priority:** Required
**Builds on:** Stage 1
**Touches:** `src/App.jsx`, new `src/components/AppShell.jsx`, `src/components/BottomNav.jsx`, `src/components/TopBar.jsx`

Do:
- Wrap the existing app content in an `AppShell` that provides the mobile-first layout described in problemstatement.md §4, §29, §30 (max content width on desktop, full-width stacked layout on mobile).
- Add a `TopBar` with a placeholder greeting ("Good morning 👋") — wire to real dynamic content in Stage 4.
- Add a `BottomNav` with tabs: Home, Progress, Challenges, Insights, Profile. Only **Home** needs to route anywhere right now — the rest can be visually present but disabled/no-op until their stages land. This avoids building routing prematurely.
- Add the floating "+" button (visual only for now — wire to `AddHabitForm` in Stage 4).

Definition of done:
- Bottom nav and top bar render on mobile and desktop breakpoints correctly (test at 375px and 1280px widths).
- No dead links/console errors from nav items that aren't wired yet (disabled state or `#` is fine).

---

## Phase B — V1: Redesigned Home + Streaks (matches problemstatement.md roadmap V1)

### Stage 3 — Habit data model upgrade: streak calculation ☐
**Priority:** Required
**Builds on:** Stage 1
**Touches:** `src/lib/storage.js`, `src/lib/dates.js`, possibly new `src/lib/streaks.js`

Do:
- Without changing the stored shape in a breaking way, add a derived-streak function: given a habit's check-in history, compute current streak (consecutive days up to today or yesterday) and best streak.
- Keep this pure/testable — no UI in this stage.

Definition of done:
- A small manual test (temporary console.log or a scratch script) confirms streak count is correct for: a habit checked off today+yesterday+the day before (streak 3), a habit with a gap (streak resets correctly), and a habit with zero check-ins (streak 0).

---

### Stage 4 — Home Dashboard redesign ☐
**Priority:** Required
**Builds on:** Stage 2, Stage 3
**Touches:** `src/App.jsx`, `src/components/HabitList.jsx`, `src/components/HabitRow.jsx` → rename/restyle as `HabitCard`, new `src/components/DateStrip.jsx`, `src/components/ProgressRing.jsx`, `src/components/StreakBadge.jsx`

Do:
- Build the Home screen per problemstatement.md §5–§7: dynamic greeting, streak indicator, horizontal date strip, "Today's Progress" section using a circular `ProgressRing` (not a plain `<progress>` bar).
- Restyle `HabitRow` into `HabitCard` per §7: icon, name, frequency/target, `StreakBadge` (🔥 N day streak), and a large custom circular check control (not a native checkbox) with a completion micro-animation.
- Wire the floating "+" button from Stage 2 to open the existing `AddHabitForm` in a lightweight bottom sheet/modal — preserve the one-line frictionless creation, just restyle the container.

Definition of done:
- Home screen visually matches the reference direction: cream background, pastel accents, rounded cards, large streak number.
- Adding a habit, checking it off, and refreshing the page all still work exactly as before (Core behavior preserved).
- Streak badge on each card shows the correct number from Stage 3's logic.

---

### Stage 5 — Streak celebration ☐
**Priority:** Required (high demo value, low effort)
**Builds on:** Stage 4
**Touches:** new `src/components/CelebrationOverlay.jsx`

Do:
- On check-off, if the new streak count hits a milestone (7/14/21/30/50/100), show a brief celebration overlay per problemstatement.md §13 (large streak number, "You're on fire.", subtle animation/confetti, auto-dismiss or tap-to-dismiss).

Definition of done:
- Checking off a habit that crosses a milestone triggers the overlay; checking off a non-milestone day does not.
- Overlay is dismissible and doesn't block the rest of the UI from working.

---

## Phase C — V2: Habit Detail, Calendar, Custom Frequency

### Stage 6 — Routing + Habit Detail page shell ☐
**Priority:** Required
**Builds on:** Stage 4
**Touches:** `package.json` (add `react-router-dom`), `src/App.jsx`, new `src/pages/HabitDetail.jsx`

Do:
- Introduce `react-router-dom` (first new dependency in this plan — justified because we now have a real second screen).
- Tapping a `HabitCard` navigates to `/habit/:id` rendering `HabitDetail`.
- Detail page shows habit name, current streak, consistency % (derived from Stage 3 data), this-week completions, best streak, total completions — per problemstatement.md §11.

Definition of done:
- Navigating to a habit and back preserves state (no data loss, no full reload needed).
- Direct refresh on `/habit/:id` still works (Vite/Vercel SPA fallback configured if needed).

---

### Stage 7 — Calendar / heatmap component ☐
**Priority:** Required
**Builds on:** Stage 6
**Touches:** new `src/components/Heatmap.jsx`

Do:
- Hand-rolled month-grid heatmap per problemstatement.md §12: rounded cells, pastel intensity by completion, month navigation (prev/next).
- Embed in `HabitDetail`.

Definition of done:
- Heatmap accurately reflects the same check-in data shown elsewhere (spot-check against the streak badge).
- Month navigation works for months with no data (renders empty state, doesn't crash).

---

### Stage 8 — Custom frequency ☐
**Priority:** Medium (per problemstatement.md roadmap — do after 6/7, can slip if time-constrained)
**Builds on:** Stage 3
**Touches:** `src/components/AddHabitForm.jsx`, `src/lib/storage.js`, `src/lib/streaks.js`

Do:
- Support non-daily habits (e.g. "3x/week") — extend the habit's stored shape with a `frequency` field, defaulting to daily for existing/legacy habits (no migration breakage).
- Update streak logic to account for frequency (a 3x/week habit's "streak" means consecutive *weeks* hitting the target, not consecutive days).
- Update `HabitCard` and `HabitDetail` to display frequency-aware progress ("2/3 this week" instead of a daily-only streak).

Definition of done:
- Existing daily habits behave exactly as before.
- A new 3x/week habit correctly tracks partial-week progress and resets appropriately at week boundaries.

---

## Phase D — Differentiators (Recovery, Momentum, Daily Highlights)

These aren't in the original roadmap tiers but are called out heavily in the UI spec (problemstatement.md §14–§16) as product differentiators — sequence them after core V1/V2 is solid.

### Stage 9 — Recovery experience ☐
**Priority:** Required (cheap, high emotional payoff, easy demo beat)
**Builds on:** Stage 4
**Touches:** new `src/components/RecoveryCard.jsx`

Do:
- Detect when a habit's streak just broke (yesterday was missed after an active streak) and show an encouraging `RecoveryCard` instead of a bare "streak: 0" per problemstatement.md §14.

Definition of done:
- Missing a day shows the recovery message with the "still X% consistent" framing and a "Start again" CTA that just re-focuses the check-in control — no punitive language anywhere.

---

### Stage 10 — Momentum score ☐
**Priority:** Medium
**Builds on:** Stage 3, Stage 4
**Touches:** new `src/lib/momentum.js`, new `src/components/MomentumCard.jsx`

Do:
- Implement the composite score described in §15 (completion rate + streak + recovery + adherence + trend — keep the formula simple and documented in code, it's explicitly a product metric not a scientific one).
- Surface it on the Home dashboard.

Definition of done:
- Score moves sensibly as you check off / miss habits in manual testing (goes up with consistency, down with gaps).

---

### Stage 11 — Daily highlights ☐
**Priority:** Medium (visual signature piece, do once Home layout is stable)
**Builds on:** Stage 4
**Touches:** new `src/components/DailyHighlights.jsx`

Do:
- Build the organic pastel shape-card row from §16, pulling from the same habit data (no new backend fields needed — derive labels like "READ 20 min" from existing habit name + today's progress).

Definition of done:
- Renders correctly with 1 habit, with many habits (wraps/scrolls sanely), and with zero habits (doesn't render an empty broken row — falls back to the empty state from Stage 15).

---

## Phase E — Stretch: Challenges, Gamification, AI

Everything in this phase is explicitly optional/stretch per problemstatement.md's roadmap (V3 + optional tiers). Only build these if Phases A–D are solid and demo-ready with time to spare.

### Stage 12 — Challenges (mock data, client-only) ☐
**Priority:** Stretch
**Builds on:** Stage 4

Do:
- Static/local set of challenges (§17) with progress derived from real habit data where possible (e.g. a "No-Zero-Days" challenge tied to actual check-ins). No backend needed for a single-user demo.

Definition of done:
- At least one challenge card renders with correct, live progress from local data.

---

### Stage 13 — Gamification (XP/Level/Achievements) ☐
**Priority:** Stretch
**Builds on:** Stage 3, Stage 10

Do:
- Simple XP formula tied to check-ins and streak milestones. Level derived from cumulative XP. Achievement unlock list per §20, computed client-side from existing data.

Definition of done:
- Achievements unlock correctly and persist across refresh (stored alongside existing localStorage data).

---

### Stage 14 — AI contextual insights (rule-based, no chatbot) ☐
**Priority:** Stretch — but high demo value per problemstatement.md §35
**Builds on:** Stage 6, Stage 7

Do:
- **Do not build a chat UI.** Implement §21–§22 as rule-based derived insights first (e.g. "You're most consistent on weekdays" computed directly from the heatmap data) — this needs no external API and is fully demoable offline.
- If time allows and a real LLM call is wanted for the weekly-insight copywriting (turning stats into a natural sentence), that's a separate, explicit decision to make later — flag it rather than wiring in an API key silently.

Definition of done:
- Insight card(s) show real, data-derived statements (not lorem-ipsum placeholders) somewhere reachable from Home or Habit Detail.

---

### Stage 15 — Onboarding (skippable) ☐
**Priority:** Stretch — nice-to-have polish, not core to the demo
**Builds on:** Stage 2

Do:
- Lightweight multi-step flow per §23, skippable at every step, never blocking the Core "type a habit and go" path.

Definition of done:
- A first-time visitor can skip straight to Home and create a habit with zero onboarding friction, exactly as the Core always allowed.

---

### Stage 16 — Social accountability ☐
**Priority:** Stretch — lowest priority, requires backend/auth
**Builds on:** everything above

Do not start this without an explicit go-ahead — it's the only stage that breaks the "no accounts, no backend" Core principle. If greenlit, scope it as small as possible (e.g. a shareable read-only link rather than full auth) before reaching for a real backend.

---

## Phase F — Polish & Demo Prep (do last, always)

### Stage 17 — Empty states & micro-interactions pass ☐
**Priority:** Required
**Builds on:** whichever stages are actually built

Do:
- Add empty states (§25) anywhere a list/section can be blank.
- Add the completion/streak/navigation micro-animations from §26 wherever they're still missing.

---

### Stage 18 — Responsive + accessibility pass ☐
**Priority:** Required
**Builds on:** all UI stages

Do:
- Verify all three breakpoints from §32 (mobile/tablet/desktop).
- Check contrast, focus states, semantic markup, 44px touch targets, and that completion state is never color-only, per §31.

---

### Stage 19 — Demo data seeding ☐
**Priority:** Required
**Builds on:** all feature stages you've built

Do:
- Write a small local seed script/dev-only button that populates realistic habits + multi-week check-in history, so the demo doesn't open on an empty app. Gate it behind a dev-only flag so it never ships to a real user's first load.

---

### Stage 20 — Deploy & final walkthrough ☐
**Priority:** Required
**Builds on:** everything

Do:
- `npm run build`, verify `dist/` output, deploy to Vercel.
- Walk through the demo priority list from problemstatement.md §35 end-to-end once on the deployed build, not just localhost.

---

## Suggested Minimum Path for a Time-Boxed Hackathon

If time runs out, the stages that matter most, in order, are:

**1 → 2 → 3 → 4 → 5 → 9 → 17 → 18 → 19 → 20**

That alone gets you: a fully restyled, on-brand Home dashboard, real streaks, a celebration moment, a recovery moment, and a polished, deployed demo — which covers 6 of the top 7 items in problemstatement.md §35's demo priority list without needing routing, a backend, or any AI wiring. Everything else in Phases C–E is additive on top of that spine.

# Problem Statement — Forge Knockout: Habit Tracker

**Project repo:** https://github.com/rushshah973/forge-knockout-habit-tracker
**Stage:** Hackathon — Core (MVP) is live. This document defines the problem, the reasoning that led to the current build, and the roadmap for everything built on top of it.

---

## 1. The Vague Starting Point

We started from a deliberately underspecified sentence:

> "Students are not able to set and track habits."

This is not a usable problem statement. It fails on every axis that matters:
- **Who** — "students" is too broad to design for.
- **When** — no trigger moment, no context for why it's hard right now.
- **What already exists** — no acknowledgment of the tools people already try and abandon.
- **Why those tools fail** — no specific, falsifiable gap.
- **What "not able to" actually means** — is it forgetting, motivation, tooling friction, or something else entirely?

A statement this vague can justify building almost anything, which in practice means it justifies building nothing well. The rest of this document is the process of narrowing it into something buildable.

---

## 2. Narrowing the Problem

### 2.1 — Pick a specific person
Not "students" in general — **PGP students at MESA Forge** specifically. This matters because it lets us reason about a real context: cohort-based learning, a shared platform (Forge), and a population that is already forming new routines as part of the program (study habits, project work, career prep, etc.).

### 2.2 — Name the trigger moment
The problem doesn't hit constantly — it hits at specific moments: **the start of a new month, or after some other reset point** (end of a sprint, start of a new week, after a break), when a student notices they've fallen off a habit they meant to build. This is the moment of highest intent and highest friction simultaneously — they want to restart, but anything that gets in the way of restarting immediately kills the intent.

### 2.3 — Audit what already exists
We looked at three categories of existing solutions:

| Category | Examples | What they're good at |
|---|---|---|
| Dedicated habit apps | Habitica, Streaks | Gamification, streak visualization, reminders |
| General productivity tools | Google Calendar, Notion | Flexibility, integration with other work |
| Analog methods | Paper journal, sticky notes | Zero setup, tactile, no account needed |

### 2.4 — Find the honest gap
The gap we landed on, after looking at the above: **most digital tools ask for too much setup before they deliver any value.** Account creation, onboarding flows, choosing categories/colors/icons, configuring reminders — all of this sits between the user's intent ("I want to track this habit") and the first useful action (actually tracking it). Analog methods don't have this problem, but they don't scale, don't persist reliably, and don't show history well.

This is the gap we chose to attack: **time-to-first-value**, not gamification, not social features, not analytics. Those may matter later, but they are not the reason people quit before they start.

### 2.5 — Define the smallest possible fix
The smallest thing that tests this gap directly:

> Type a habit in one line, and immediately be able to check it off each day. No account, no setup screen, nothing to configure.

This is deliberately not a full product. It's a test of one specific hypothesis: **if you remove all setup friction, will students actually use it?**

---

## 3. What's Already Live — "The Core"

The Core is intentionally minimal. It does three things and nothing else:

1. **Frictionless habit capture** — type one line describing a habit → it's instantly added, no forms, no setup screen.
2. **Daily check-off** — one tap marks a habit done for today; tap again to undo.
3. **Local persistence** — habits and check-ins are saved in the browser and survive a refresh.

Explicitly **not** included yet: streaks, editing, deleting, reminders, multiple views, accounts. This is by design — a smaller thing that works and can be tested today is worth more than a bigger thing that isn't built yet.

---

## 4. Honest Caveats — What We Skipped

We moved fast to get something live in a single session, which meant skipping steps we'd normally do first:

- We did **not** map out how PGP students currently struggle with habits (no interviews, no survey).
- We did **not** collect student ideas or feedback before deciding what to build.
- The roadmap below is **our best guess at what matters next, not a validated fact.**

Part of the ongoing work on this project is testing that guess against real usage and real feedback — not just shipping every tier in order because it's written down.

---

## 5. Roadmap — Build Tiers

Each tier builds on the last. Nothing here is committed yet — this is the menu we'll pick from step-by-step, as UI and priorities get decided in follow-up sessions.

### Already Live (don't rebuild — extend)
- Frictionless habit capture
- Daily check-off
- Local persistence

### V1 — Beginner
*Build target: V1*

| Feature | Description | Value |
|---|---|---|
| Streak counter | Show consecutive days a habit has been completed, derived from saved check-in history | High |
| Multiple habits list | A proper list view for tracking more than one habit at once | High |

### V2 — Intermediate
*Build target: V1 + V2*

| Feature | Description | Value |
|---|---|---|
| Calendar / heatmap view | Visualize check-in history over weeks or months, not just today | Medium |
| Custom frequency | Support habits that aren't daily — e.g. 3x/week | Medium |

### V3 — Advanced
*Build target: V1 + V2 + V3*

| Feature | Description | Value | Notes |
|---|---|---|---|
| Push notifications | Real device reminders | High | Requires service worker + browser permission |
| Social accountability | Invite a friend, see each other's streaks | Medium-high | Requires accounts + backend |

### Optional — Pick-your-own (for anyone who finishes early)
- **Edit habit** — change a habit's name after creating it
- **Delete habit** — remove a habit entirely
- **In-app reminder banner** — flag habits not checked off by a set time
- **AI-suggested frequency/timing** — infer a sensible frequency from the one-line description (unproven idea, worth testing)
- **AI weekly insights** — AI-generated reflection on patterns, e.g. "consistent on weekdays, not weekends"
- **Cross-device sync / export**

---

## 6. Design Principles Going Forward

These constraints came directly from the reasoning in Section 2 and should hold for every tier we build:

1. **Never reintroduce setup friction.** Any new feature (accounts, notifications, social) must not block the core "type a habit, check it off" flow for someone who doesn't want that feature.
2. **Every addition should be testable against the original hypothesis.** Does this feature help students actually keep using the app past the first reset moment, or is it scope creep?
3. **Prefer shipping something small and real over something large and half-built.** This was the reasoning behind the Core, and it should govern each tier too — ship V1 fully before starting V2, etc.

---

## 7. Next Steps

- UI has not yet been decided — to be provided step-by-step in follow-up sessions.
- Feature build order to be confirmed tier-by-tier, starting with V1 (streak counter, multiple habits list) once UI direction is set.
- This document should be treated as a living reference — update it if testing the Core reveals the "too much setup" hypothesis is wrong, or reveals a different gap entirely.

---

# UI/UX DESIGN SYSTEM & PRODUCT INTERFACE SPECIFICATION

This section is the visual and interaction specification for the product, based on a set of mobile habit/wellness app reference images (styleguide + onboarding + dashboard + habit-detail screens). It translates that reference language into an implementation-ready spec for this habit tracker.

The final product should feel like a **premium, modern, playful habit/wellness app** — the same overall design direction as the references — **not** a generic dashboard, Notion clone, Bootstrap dashboard, or conventional productivity app.

The UI should be heavily inspired by the references in: layout, typography, color palette, rounded cards, soft pastel backgrounds, large visual elements, playful illustrations, progress visualization, mobile-first interaction, bottom navigation, habit detail screens, calendar/streak visualization, challenge presentation, gamification, micro-interactions, and overall visual hierarchy.

## 1. Overall Visual Direction

The application should have:
- Premium mobile-app aesthetic
- Clean, editorial-style layouts
- Large typography
- Generous whitespace
- Soft off-white/cream background
- Pastel accent colors
- Black/dark text
- Rounded UI elements
- Thin borders where appropriate
- Soft shadows
- Playful but sophisticated illustrations
- Organic shapes
- Cards with large rounded corners
- Minimal visual clutter
- Strong hierarchy
- Smooth animations
- Friendly and motivating personality

The interface should feel somewhere between: a premium wellness app, a modern habit tracker, a playful lifestyle app, and an editorial mobile product.

**Avoid:** overly corporate UI, excessive gradients, excessive glassmorphism, generic SaaS dashboards, excessive icons, tiny text, dense tables, boring checkbox lists, default browser styling.

## 2. Color System

Use the reference palette as the starting point, implemented as **design tokens**, not scattered hex values.

Core palette:
- Background: `#FFFDF7`
- Primary pastel pink: `#F5BCDD`
- Lavender: `#DFD9F9`
- Muted green: `#B6C682`
- Soft blue: `#B9CBEC`
- Warm yellow: `#F5D96E`
- Primary text: near-black / `#111111`
- Secondary text: muted gray

Tokens to define:
```
--background
--foreground
--primary
--pink
--lavender
--green
--blue
--yellow
--muted
--border
--card
```

Use colors strategically, not decoratively:
- Pink → primary actions, streaks, active states
- Yellow → achievements, energy, progress
- Green → completed/healthy habits
- Blue → water/focus/calm habits
- Lavender → analytics/focus/mind
- Cream → main background

The overall UI should remain **mostly cream + black with pastel accents** — do not make every component colorful.

## 3. Typography

Modern geometric/editorial typography style: large expressive headings, bold/semibold weights, clean body text, generous line height, strong hierarchy, rounded/geometric font feeling. If the exact reference fonts are unavailable, use an appropriate modern sans-serif fallback (e.g. a rounded geometric sans like the reference's "Acorn"/"TT Commons" family, falling back to something like Inter, General Sans, or system-ui equivalents).

Recommended hierarchy:
- Display: very large, bold
- H1: 36–48px desktop / 30–36px mobile
- H2: 24–32px
- H3: 18–22px
- Body: 15–17px
- Caption: 12–14px

Do not make the entire app tiny. Key numbers — streak, today's progress, challenge progress, completion percentage — should have strong visual emphasis (large, bold, high-contrast).

## 4. Responsive / Mobile-First Design

The references are heavily mobile-app oriented — design mobile-first. Desktop should NOT simply be a stretched mobile screen.

**Mobile:** bottom navigation, large touch targets, one-handed interactions, full-width cards, vertical content flow.

**Desktop:** centered content, maximum content width, multi-column layouts where appropriate, larger analytics visualizations, optional sidebar/navigation if useful.

Minimum touch target: **44px**. Buttons and habit completion controls must be easy to tap.

## 5. Main Dashboard

Top of screen:
- Greeting: "Good morning, Rushabh!" or dynamic "Good morning 👋"
- Short motivational/status line, e.g. "Let's keep your momentum going."
- Streak/momentum indicator near the top, e.g. "🔥 53"

Below that, a horizontal TODAY/date strip:
```
MON 7   TUE 8   WED 9   THU 10   FRI 11   SAT 12   SUN 13
```
The selected day gets a soft pastel highlight.

## 6. Today's Progress

A visually strong progress section, e.g.:
```
TODAY
3 / 5 habits completed
████████░░ 60%
```
Do not rely on a boring conventional progress bar alone — explore circular progress, organic progress shapes, a large percentage number, a pastel progress ring, and animated completion. The visual should feel rewarding, not administrative.

## 7. Habit Cards

Each habit card contains: habit icon, habit name, small frequency/target, current streak, and a completion control.

Example:
```
○ 📚 Read 20 pages
   Daily · 🔥 12 day streak
```

Completion control:
- Unchecked: outlined circular control
- Checked: filled pastel circle + checkmark
- On completion: subtle animation, small celebration, streak update, progress update, optional XP reward

Do **not** use plain HTML checkboxes.

## 8. Habit Creation

Preserve the existing frictionless Core: the user types "Read 20 pages every night" and the habit is created immediately. The UI wrapper around this should feel premium — a prominent floating/add button, opening a lightweight sheet/modal if needed. Do **not** introduce a long onboarding form for habit creation.

## 9. Floating Add Button

A persistent floating action button:
- Circular, pastel pink, subtle shadow, visually prominent
- Slight animation on hover/tap
- On mobile, placed above the bottom navigation

## 10. Bottom Navigation

Suggested tabs: **Home, Progress, Challenges, Insights, Profile**, with a center "+" action that visually floats above the bar:
```
[Home] [Progress]    (+)    [Challenges] [Profile]
```
Active navigation item uses the primary pastel accent. Keep icons minimal.

## 11. Habit Detail Page

Each habit gets a dedicated, visually rich detail screen, e.g.:
```
READING
🔥 12 DAY STREAK
87% Consistency

[Calendar / Heatmap]

This Week        6 / 7
Best streak       21 days
Total completions 84
```
Add an insights line, e.g. "You're most consistent on weekdays." Use visual charts rather than text alone.

## 12. Calendar / Heatmap

A beautiful visual calendar: small rounded cells, pastel intensity, clear completed/missed states, month navigation.
```
September 2026
Mon Tue Wed Thu Fri Sat Sun
 ■   ■   ■   □   ■   ■   ■
```
Should communicate consistency at a glance. Avoid generic spreadsheet-looking calendars.

## 13. Streak Experience

Streaks are one of the most visually important parts of the product. At milestones (7, 14, 21, 30, 50, 100 days), show a celebration state:
```
🔥
53
DAY STREAK
"You're on fire."
```
Use animation, a pastel burst, subtle confetti, large typography. Celebration should feel premium, not childish.

## 14. Recovery Experience

An important product differentiator: missing a day should never feel like total failure. Instead of only "Streak: 0", show something like:

> "You missed yesterday — but your consistency is still 87%."
> "Ready to restart?" **[START AGAIN]**

Build a dedicated, encouraging recovery card — not punitive framing.

## 15. Momentum Score

A visual "Momentum" component combining recent completion rate, streak, recovery, frequency adherence, and recent trend:
```
YOUR MOMENTUM
82
████████░░
"Strong week. Keep going."
```
Treat this explicitly as a product metric, not a medical/scientific measurement.

## 16. Daily Highlights

Inspired by the reference's colorful "Daily highlights" section — an organic visual grouping of pastel shapes/cards, e.g.:
```
Daily Highlights
   READ 20 min      GYM 3/3      MEDITATE 10 min      WATER 6/8
```
Instead of standard rectangles, experiment with circles, blobs, stars, pill shapes, irregular organic shapes. This should become a recognizable visual signature of the app.

## 17. Challenges

A prominent Challenges section, e.g.:
```
30-DAY WALKING CHALLENGE
Day 18 / 30
██████████████░░
You + 3 friends
```
Communicate: challenge name, participants (avatars where appropriate), progress, remaining days, reward.

Potential challenges: 7-Day Reading Challenge, 30-Day Fitness Challenge, No-Zero-Days Challenge, 21-Day Morning Routine, 14-Day Deep Work Challenge.

## 18. Social Accountability

If implemented, follow the reference's "compete with friends" concept without turning it into a messaging interface — the focus stays on progress and accountability:
```
YOUR CREW
You 🔥12    Alex 🔥9    Priya 🔥17

Weekly: You 6/7 · Alex 5/7 · Priya 7/7
```

## 19. Gamification

Tasteful gamification only: XP, Level, Streak, Achievements, Challenges, Milestones.
```
LEVEL 08
Consistency Builder
████████░░  +20 XP
```
Avoid excessive game UI — the app should still feel like a premium lifestyle product.

## 20. Achievement Visuals

Achievement cards, e.g.: 🔥 First 7-Day Streak · 🏆 30 Habits Completed · ⚡ Perfect Week · 🌱 First Habit Built · 🔁 Recovery Master · 💯 100 Check-ins. Use small illustrations or custom icons where possible.

## 21. AI UI — No Chatbot

**AI must NOT be implemented as a chatbot.** Do not create a chat window, an "Ask AI anything" input, or an AI assistant messaging screen.

Instead, AI appears as **contextual product intelligence**, embedded directly into relevant screens:

> **AI RECOMMENDATION**
> "Your gym habit is consistently completed 3–4 times per week."
> "Would you like to change your target from 5 days to 4 days?" **[Accept suggestion]**

> **WEEKLY INSIGHT**
> "You're 23% more consistent on weekdays."

> **SMART TIMING**
> "You usually complete this habit around 7–9 AM."
> "Suggested reminder: 7:30 AM" **[Use suggestion]**

## 22. Weekly Insights Page

A visually rich Insights screen:
```
YOUR WEEK
87% Overall consistency
🔥 12 Best current streak
6/7 Best habit this week
```
Sections:
- **What went well** — "Reading was your most consistent habit."
- **Your pattern** — "You complete habits more often before 10 AM."
- **One thing to improve** — "Weekend consistency is 32% lower."
- **AI insight** — "Try moving your weekend workout to Saturday morning."

## 23. Onboarding

The references show a beautiful multi-step onboarding flow. Ours should remain lightweight and skippable — a user must be able to skip it and immediately create a habit (this preserves the Core's frictionless hypothesis).

Possible screens: Welcome → What do you want to improve? → What motivates you? → What makes consistency difficult? → Create your first habit.

Use: progress indicator, large typography, simple illustrations, pastel backgrounds, one question per screen, large bottom CTA. Example options for "What do you want to improve?": Health, Focus, Learning, Fitness, Routine, Personal.

## 24. Illustration Style

Playful, hand-drawn-feeling illustrations: simple outlines, expressive characters, pastel fills, playful shapes, minimal details, friendly personality. Use strategically for onboarding, empty states, achievements, challenges, and milestones only — not everywhere. The product should remain clean.

## 25. Empty States

Intentional, encouraging empty states, e.g.:

> No habits yet. [Playful illustration] "Start with one tiny habit." **[+ Create a habit]**

> No activity this week. "Your next check-in starts today."

## 26. Micro-Interactions

- **Habit completion:** button scales slightly, checkmark appears, subtle particle/celebration, progress updates
- **Streak milestone:** number counts upward, subtle glow, confetti
- **Navigation:** smooth transitions
- **Cards:** slight hover/tap movement
- **AI recommendation:** subtle reveal animation

Keep animations fast and elegant — avoid excessive motion.

## 27. Component System

Reusable component set to build toward:
```
AppShell, BottomNav, TopBar, DateStrip,
HabitCard, HabitList, HabitCheckButton,
ProgressRing, ProgressBar, StreakBadge, MomentumCard,
DailyHighlights, ChallengeCard, ChallengeProgress,
AchievementCard, Heatmap, Calendar,
InsightCard, AIRecommendationCard, RecoveryCard,
EmptyState, AddHabitButton, HabitDetail,
ProfileCard, StatsCard, Modal, BottomSheet, Toast,
CelebrationOverlay
```
Each component should be reusable and responsive.

## 28. Design Tokens

Spacing, radius, shadows and typography must use reusable tokens, not one-off values.

Spacing scale: `4, 8, 12, 16, 20, 24, 32, 40, 48`

Border radius: `12, 16, 20, 24, 32, 9999` (pills/circles)
- Cards generally: 16–24px radius
- Buttons: 12–20px radius depending on style
- Shadows: subtle, not heavy

## 29. Desktop Layout

Beautiful desktop experience, not just a stretched mobile view:
```
------------------------------------------------
| Logo              Today       Profile        |
------------------------------------------------
| Greeting                                       |
| Today's Progress        Momentum              |
| Habits                                         |
| ┌──────────────┐ ┌──────────────┐             |
| │ Habit        │ │ Habit        │             |
| └──────────────┘ └──────────────┘             |
| Daily Highlights                               |
| Challenges                                     |
------------------------------------------------
```
Maximum content width ~1100–1300px — do not stretch content across the entire screen.

## 30. Mobile Layout

Should feel like an actual native-quality app, top to bottom:
1. Greeting + streak
2. Date strip
3. Daily progress
4. Habit list
5. Daily highlights
6. Challenges
7. Insights
8. Floating "+" and bottom navigation

Keep scrolling smooth.

## 31. Accessibility

Despite the visual design, maintain accessibility:
- Sufficient text contrast
- Semantic HTML
- Keyboard navigation
- Visible focus states
- Accessible labels
- Screen-reader-friendly controls
- Touch targets ≥ 44px
- Never rely on color alone to communicate completion state

## 32. Responsive Breakpoints

- Mobile: `< 640px`
- Tablet: `640–1024px`
- Desktop: `> 1024px`

Layouts should adapt intentionally at each breakpoint — not simply scale.

## 33. Product Feel

The emotional progression the UI should produce:

| Moment | Feeling |
|---|---|
| Open | "Let's see how I'm doing." |
| Complete | "Nice, I did it." |
| Progress | "I'm actually improving." |
| Streak | "I don't want to lose this." |
| Insight | "I understand my behavior better." |
| Recovery | "Missing one day isn't failure." |
| Challenge | "I want to keep going with my friends." |
| Return | "Let's do today's habits." |

## 34. Important Implementation Instructions

When this specification is eventually implemented:

1. Inspect the current codebase first.
2. Preserve the existing Core functionality.
3. Do not rebuild the entire application unnecessarily.
4. Build reusable components.
5. Keep habit/business logic separate from presentation.
6. Make the interface responsive.
7. Use the reference images as the visual benchmark.
8. Match the overall visual language, not just individual components.
9. Do not copy branding, logos, names, or proprietary assets from the references.
10. Create original illustrations/icons/assets where needed.
11. Do not introduce a chatbot.
12. AI should be contextual and embedded into the UX, never a chat interface.
13. Prioritize the daily habit completion flow above everything else.
14. Make the product feel premium and polished enough for a hackathon demo.
15. Use realistic demo data so the interface looks alive during presentation.
16. Add subtle animations and transitions.
17. Make the UI work beautifully on both mobile and desktop.

## 35. Hackathon Demo Visual Priority

For the final demo, prioritize these screens in this order:
1. Home Dashboard
2. Add Habit
3. Habit Detail
4. Streak Celebration
5. Calendar/Heatmap
6. Recovery Experience
7. AI Weekly Insight
8. AI Adaptive Goal Recommendation
9. Challenges
10. Social Accountability
11. Profile/Achievements

The **Home Dashboard** and **Habit Detail** screens should receive the highest visual polish.

## Final Design Principle

The reference images are visual inspiration for the entire product — not a literal template. The product should **not** look like "another habit tracker with checkboxes." It should look like **a premium, playful, intelligent habit-building experience.**

The Core principle must remain intact:

**FAST TO START. EASY TO USE. BEAUTIFUL TO RETURN TO. INTELLIGENT WHEN NEEDED.**

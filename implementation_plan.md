# Interactive Wall Calendar Component — Implementation Plan

## Goal

Build a premium, interactive React/Next.js wall-calendar component from scratch in the `c:\Users\DELL\Desktop\pathway\Takeuforward` workspace. The component must feel like a real physical wall calendar — hero imagery, a clean date grid, day-range selection, integrated notes, full responsiveness, and delightful creative extras.

---

## Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | **Next.js 14 (App Router)** | Modern React, file-based routing, easy Vercel deploy |
| Styling | **Vanilla CSS + CSS Modules** | Full control, no external deps, per-component scoping |
| State | **React `useState` / `useReducer`** | Simple client-side state; no Redux needed |
| Persistence | **`localStorage`** | Notes & selected ranges survive refresh |
| Fonts | **Google Fonts — "Playfair Display" + "Inter"** | Elegant serif for headings, clean sans for body |
| Images | **AI-generated hero images** (one per month) | Seasonal artwork matching the wall-calendar aesthetic |

---

## Proposed Architecture

```
src/
├── app/
│   ├── layout.js          # Root layout, fonts, metadata
│   ├── page.js            # Main page — renders <Calendar />
│   └── globals.css        # Design tokens, resets, utilities
├── components/
│   ├── Calendar/
│   │   ├── Calendar.jsx          # Top-level orchestrator
│   │   ├── Calendar.module.css
│   │   ├── CalendarHeader.jsx    # Month/year title + nav arrows
│   │   ├── CalendarGrid.jsx      # 7-col day grid w/ range selection
│   │   ├── CalendarGrid.module.css
│   │   ├── DayCell.jsx           # Individual day cell (start/end/in-range states)
│   │   ├── DayCell.module.css
│   │   ├── HeroImage.jsx         # Hero artwork panel w/ flip animation
│   │   ├── HeroImage.module.css
│   │   ├── NotesPanel.jsx        # Notes sidebar / bottom panel
│   │   ├── NotesPanel.module.css
│   │   ├── MiniCalendar.jsx      # Optional mini prev/next month
│   │   └── ThemeSwitcher.jsx     # Light / Dark / Seasonal toggle
│   └── shared/
│       ├── FlipTransition.jsx    # Page-flip CSS animation wrapper
│       └── Tooltip.jsx           # Hover tooltip for holidays
├── hooks/
│   ├── useCalendar.js       # Month navigation, day generation
│   ├── useRangeSelection.js # Start/end date logic
│   └── useLocalStorage.js   # Generic localStorage hook
├── data/
│   ├── holidays.js          # Static holiday markers (IN + US)
│   └── monthThemes.js       # Per-month color palette + image map
└── utils/
    └── dateHelpers.js        # Pure date math utilities
```

---

## Core Features

### 1. Wall Calendar Aesthetic
- **Hero Image Panel** — Large seasonal artwork (top on mobile, left on desktop) that occupies ~40% of the component, giving a "tear-off calendar" feel.
- **Paper texture** — Subtle CSS background texture, soft drop shadow, rounded corners to mimic thick card stock.
- **Spiral binding illusion** — Small CSS circles along the top edge to emulate the binding holes of a wall calendar.

### 2. Day Range Selector
- **Click logic**: First click → set start date (highlighted with accent circle). Second click → set end date. If the second click is before the first, swap them.
- **Visual states**:
  - `start` — Filled accent circle on the left half-pill.
  - `end` — Filled accent circle on the right half-pill.
  - `in-range` — Soft translucent highlight bar connecting start → end.
  - `hover-preview` — As the user hovers after picking start, the preview range is shown with a lighter shade.
  - `today` — Distinct ring / dot indicator.
- **Clear selection** button to reset.

### 3. Integrated Notes Section
- **Per-range notes**: When a range is selected, the notes panel shows a text area tied to that range (keyed by `startDate-endDate`).
- **General month memo**: When no range is selected, the panel shows a general memo for the current month.
- **Persistence**: All notes saved to `localStorage` under a structured key.
- **Character counter** and subtle save animation.

### 4. Fully Responsive Design
| Breakpoint | Layout |
|---|---|
| ≥ 1024px (desktop) | Side-by-side: Hero image left, calendar grid + notes right |
| 768–1023px (tablet) | Stacked: Hero on top (shorter), grid below, notes in a collapsible drawer |
| < 768px (mobile) | Fully stacked, compact grid, swipe gestures for month nav, notes in bottom sheet |

---

## Creative Extras ✨

| Feature | Description |
|---|---|
| **Page-flip animation** | When navigating months, the hero image and grid flip like turning a real calendar page using CSS 3D transforms |
| **Seasonal theming** | Each month auto-applies a color palette derived from its hero image (warm ambers for autumn, cool blues for winter, etc.) |
| **Theme toggle** | Light / Dark / Auto mode toggle with smooth CSS transitions |
| **Holiday markers** | Small colored dots on national holidays (India & US) with tooltip on hover showing the holiday name |
| **Today pulse** | A gentle pulsing ring around today's date |
| **Keyboard navigation** | Arrow keys to move focus, Enter to select, Escape to clear |
| **Print stylesheet** | `@media print` rules to produce a clean printable calendar |

---

## Implementation Steps

### Phase 1 — Project Scaffolding
1. Initialize Next.js project with `npx -y create-next-app@latest ./`
2. Clean boilerplate, set up folder structure
3. Configure `globals.css` design system (tokens, palette, typography)

### Phase 2 — Calendar Logic
4. Implement `dateHelpers.js` (days in month, first day offset, etc.)
5. Implement `useCalendar` hook (current month state, navigation)
6. Implement `useRangeSelection` hook (start/end/in-range logic)
7. Implement `useLocalStorage` hook

### Phase 3 — UI Components
8. Build `CalendarHeader` (month/year + prev/next arrows)
9. Build `DayCell` with all visual states
10. Build `CalendarGrid` composing DayCells
11. Build `HeroImage` panel
12. Build `NotesPanel`
13. Build top-level `Calendar` component assembling everything

### Phase 4 — Creative Extras
14. Add page-flip animation on month change
15. Add seasonal theme data + auto-theming
16. Add `ThemeSwitcher` (light/dark/auto)
17. Add holiday markers + tooltips
18. Add keyboard navigation
19. Add print styles

### Phase 5 — Polish & Verify
20. Generate hero images for at least the current month
21. Responsive testing across breakpoints
22. Final UX polish (micro-animations, transitions)
23. Create README.md with setup instructions
24. Record video demonstration via browser

---

## Verification Plan

### Automated / Tool-Verified
- `npm run build` succeeds with zero errors
- Browser subagent walkthrough: navigate months, select date ranges, add notes, resize viewport

### Manual Verification
- Visual inspection of the calendar at desktop, tablet, and mobile widths
- Confirm `localStorage` persistence by refreshing the page
- Confirm page-flip animation plays on month navigation
- Confirm holiday tooltips display correctly

---

## Open Questions

> [!IMPORTANT]
> 1. **Hero images** — I'll generate seasonal AI artwork for the current month (April) and a few others. Should I generate all 12 months upfront, or just a handful to keep build time reasonable?
> 2. **Holiday set** — I'll include Indian + US holidays. Any other regions you'd like?
> 3. **Deployment** — Do you want me to set up Vercel deployment, or is local dev sufficient for now?

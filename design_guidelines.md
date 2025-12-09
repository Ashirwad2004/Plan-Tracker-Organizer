# SmartPlan – Design Guidelines

## Design Approach: Productivity-Focused System Design

**Selected Approach:** Design System (Linear + Notion inspiration)

**Rationale:** This is a utility-focused productivity tool where efficiency, clarity, and usability are paramount. Drawing from Linear's clean interface and Notion's organizational patterns creates the optimal foundation for task management.

**Core Principles:**
- Clarity over decoration
- Scannable information hierarchy
- Efficient workflows with minimal clicks
- Data-dense but breathable layouts

---

## Typography

**Font Stack:** Inter (via Google Fonts CDN)

**Hierarchy:**
- Page Headers: text-2xl, font-semibold (32px)
- Section Titles: text-xl, font-semibold (24px)
- Card/Task Titles: text-base, font-medium (16px)
- Body Text: text-sm, font-normal (14px)
- Meta/Labels: text-xs, font-medium (12px, uppercase tracking)
- Priority Badges: text-xs, font-semibold (12px, uppercase)

---

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, and 8
- Tight spacing: p-2, gap-2 (badges, compact elements)
- Standard spacing: p-4, gap-4 (cards, form fields)
- Section spacing: p-6, gap-6 (card groups, panels)
- Page margins: p-8 (main containers)

**Grid Structure:**
- Main dashboard: Sidebar (w-64) + Main content (flex-1)
- Task cards: Single column on mobile, 2-column grid on tablet (md:grid-cols-2), maintain single column on desktop for better readability
- Statistics panel: 3-4 column grid for metrics (grid-cols-2 md:grid-cols-4)

**Container Widths:**
- Sidebar: Fixed 256px (w-64)
- Main content area: max-w-5xl mx-auto
- Task cards: Full width within container
- Modals/Forms: max-w-2xl

---

## Component Library

### Navigation Sidebar
- Fixed left sidebar with logo at top
- Navigation items with icons (from Heroicons outline)
- Active state: subtle background fill
- Sections: Dashboard, Today, This Week, Categories, Analytics

### Task Card
- Checkbox (left aligned, rounded-md border-2)
- Task title (font-medium)
- Priority badge (top-right corner, rounded-full px-3 py-1)
- Category badge (rounded-md px-2 py-1, with small dot indicator)
- Deadline display (text-xs with calendar icon)
- Edit/Delete icons (appear on hover, right side)
- Completed state: text-gray-400 with line-through

### Priority Badges
- High: Solid fill, bold text
- Medium: Border variant with matching text
- Low: Ghost variant, subtle text

### Category Pills
- Rounded badges with colored dot prefix
- Work, Study, Health, Finance, Personal (each distinct hue)
- Small size (text-xs px-2 py-1)

### Filter Bar
- Horizontal pill navigation (All, Pending, Completed, Today, This Week)
- Active state: filled background
- Inactive state: ghost/outline variant
- Search input with icon (rounded-lg border)

### Progress Indicators
- Linear progress bar (h-2 rounded-full)
- Percentage display (text-sm font-semibold)
- Statistics cards with large numbers (text-3xl) and labels (text-xs)

### Forms (Add/Edit Task)
- Input fields with labels above (text-sm font-medium)
- Border style: rounded-lg border focus:ring-2
- Textarea for description (min-h-24)
- Select dropdowns for priority and category
- Date picker for deadline
- Full-width primary button at bottom

### Calendar View
- Grid layout with day headers
- Date cells showing task count badges
- Today highlight with distinct border/background
- Clickable dates opening filtered task list

### Analytics Dashboard
- Card-based metrics (Total Tasks, Completed, In Progress, Overdue)
- Simple bar chart visualization for weekly progress
- Use chart library (Chart.js via CDN)
- Clean, minimal chart styling matching overall aesthetic

### Buttons
- Primary: Solid fill, rounded-lg px-4 py-2, font-medium
- Secondary: Border variant, same sizing
- Icon buttons: p-2 rounded-md with single icon
- Danger: For delete actions, distinct treatment

### Empty States
- Centered icon (from Heroicons, size-16)
- Heading: "No tasks yet"
- Subtext: Encouraging message
- CTA button to add first task

---

## Images

**Hero Section:** None required - this is a dashboard application focused on immediate utility.

**Illustration Usage:**
- Empty state illustrations (simple line drawings)
- Analytics icons/graphics for visual interest in stats
- Category icons (simple, consistent style from Heroicons)

All visual elements should be functional, not decorative.

---

## Animations

**Minimal, Purposeful Only:**
- Task completion: Subtle checkbox check animation (200ms)
- Card hover: Slight elevation shadow (150ms ease)
- Sidebar item active state: Smooth background fade (200ms)
- Modal/Dialog: Fade in with scale (300ms ease-out)
- Filter pills: Background color transition (150ms)

**No scroll animations, no complex transitions.** Keep interface snappy and responsive.

---

## Key Layout Patterns

**Dashboard View:**
- Sidebar navigation (left)
- Top bar with search and quick add button
- Stats row (4 metric cards)
- Filter bar below stats
- Task list (cards with consistent spacing)

**Mobile Responsive:**
- Sidebar collapses to hamburger menu
- Single column task cards
- Bottom navigation bar for key actions
- Simplified stats (2 columns instead of 4)

This design prioritizes clarity, efficiency, and professional polish suitable for a productivity application.
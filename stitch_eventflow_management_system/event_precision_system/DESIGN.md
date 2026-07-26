---
name: Event Precision System
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#434655'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#5d5f5f'
  on-secondary: '#ffffff'
  secondary-container: '#dfe0e0'
  on-secondary-container: '#616363'
  tertiary: '#4d556b'
  on-tertiary: '#ffffff'
  tertiary-container: '#656d84'
  on-tertiary-container: '#eef0ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#dae2fd'
  tertiary-fixed-dim: '#bec6e0'
  on-tertiary-fixed: '#131b2e'
  on-tertiary-fixed-variant: '#3f465c'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  container-max: 1440px
  sidebar-width: 280px
  gutter: 24px
---

## Brand & Style

The design system is engineered for a high-performance SaaS environment dedicated to professional event management. The brand personality is **reliable, efficient, and sophisticated**, designed to instill confidence in organizers managing complex logistics.

The visual style is **refined minimalism**. It prioritizes clarity and functional density without sacrificing aesthetic appeal. By utilizing expansive whitespace and a strict adherence to a systematic grid, the UI recedes to let the event content—analytics, attendee lists, and schedules—take center stage. The emotional response should be one of "controlled calm," reducing the cognitive load typically associated with data-heavy management tools.

## Colors

The palette is anchored by a **Primary Blue (#2563eb)**, chosen for its associations with trust and professional utility. This color is reserved for primary actions, active states, and critical brand touchpoints. 

**Secondary White (#ffffff)** serves as the base for all card elements and containers, creating a distinct "layered" look against the **Background Gray (#f8fafc)**. 

The neutral scale is strictly derived from slate tones to maintain a cool, professional temperature. Use **Tertiary (#0f172a)** for high-contrast headings and **Neutral (#64748b)** for secondary body text and metadata. Success and Error accents are applied with low-chroma backgrounds and high-chroma borders/text to ensure they are visible but not jarring.

## Typography

This design system utilizes **Inter** exclusively to leverage its exceptional legibility and systematic weight distribution. 

- **Headlines:** Use Semi-Bold (600) and Bold (700) with slight negative letter-spacing to create a tight, authoritative feel.
- **Body Text:** Standardized at 16px for optimal readability. Use the Regular (400) weight for long-form content and Medium (500) for emphasis within paragraphs.
- **Labels:** Small labels use uppercase with increased tracking to differentiate them from body text, ideal for table headers and category tags.
- **Responsive Scaling:** On mobile devices, Display and Headline-LG roles scale down significantly to prevent awkward line breaks while maintaining hierarchy.

## Layout & Spacing

The layout follows a **12-column fluid grid** for the main content area, complemented by a **fixed sidebar** for the dashboard navigation. 

- **Sidebar:** Fixed at 280px on desktop. On tablet, it collapses into a narrow icon-only bar (72px). On mobile, it becomes a hidden off-canvas drawer.
- **Margins:** 32px on desktop, 24px on tablet, and 16px on mobile.
- **Rhythm:** An 8px linear scale (with a 4px half-step for tight components) governs all padding and margins. This ensures vertical rhythm across cards and data tables.
- **Content Max-Width:** While the grid is fluid, readable content (like event descriptions or settings pages) should be capped at 800px to maintain line-length integrity.

## Elevation & Depth

Hierarchy is established through **Tonal Layering** and **Ambient Shadows**. 

1. **Surface (Level 0):** The background (#f8fafc).
2. **Card (Level 1):** White background with a subtle 1px border (#e2e8f0) and a soft, diffused shadow (0px 4px 6px -1px rgba(0, 0, 0, 0.05)).
3. **Popovers/Modals (Level 2):** White background with a more pronounced shadow (0px 10px 15px -3px rgba(0, 0, 0, 0.1)) to indicate a significant jump in the Z-axis.

Avoid heavy black shadows. All shadows should use a tint of the neutral slate color to maintain a clean, integrated appearance. Outlines are used on interactive elements like input fields to provide tactile feedback without adding visual weight.

## Shapes

The design system employs a **Rounded** shape language to soften the professional tone and make the interface more approachable.

- **Buttons & Inputs:** 0.5rem (8px) corner radius.
- **Cards & Sections:** 0.75rem to 1rem (12px to 16px) corner radius, depending on the container size.
- **Selection Indicators:** Small indicators (like checkboxes or active state bars) use a 2px or 4px radius.

This consistency in curvature creates a cohesive visual rhythm, suggesting that even complex data can be easily navigated and managed.

## Components

### Buttons
- **Primary:** Solid #2563eb with white text. High-contrast, 0.5rem roundedness.
- **Secondary:** White background with #e2e8f0 border and #0f172a text.
- **Ghost:** No border or background; text only. Used for secondary actions in tables or navigation.

### Data Tables
Tables are the heart of the event system. They should use a "zebra-less" approach, relying on 1px horizontal dividers (#f1f5f9) and generous cell padding (16px vertical). Table headers are `label-sm` with a subtle gray background.

### Event Cards
High-fidelity cards should include a 16:9 image area (if applicable), a bold `headline-sm` title, and a `body-sm` metadata section (date, location, attendees) using icons for clarity.

### Input Fields
Inputs use a white background, 1px border (#cbd5e1), and 0.5rem roundedness. Focus states utilize a 2px blue ring with 50% opacity.

### Navigation Sidebar
The sidebar should use a dark-on-light or light-on-dark theme. Active items are marked by a vertical Primary Blue pill on the left edge and a subtle background tint (#eff6ff). Icons should be 20px, stroke-based, and consistent in weight.